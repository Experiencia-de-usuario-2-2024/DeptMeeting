import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserMSG } from 'src/common/constants';
import { ClientProxyMeetflow } from 'src/common/proxy/client-proxy';
import { LoginDto } from 'src/user/dto/login.dto';
import { UserDTO } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientProxy: ClientProxyMeetflow,
    private readonly jwtService: JwtService,
  ) {}

  // cliente proxy de usuarios
  private _clientProxyUser = this.clientProxy.clientProxyUser();

  /*  
   Metodo para validar un usuario ingresado
   entrada: datos del usuario. 
   salida: boolean de usuario validado
  */
  async validateUser(username: string, password: string): Promise<any> {
    this._clientProxyUser.send(UserMSG.VALID_USER, { username, password });
  }

  /*  
   Metodo para iniciar sesion de usuario
   entrada: datos del usuario. 
   salida: objeto del nuevo usuario.  
  */
  async signIn(loginDto: LoginDto) {
    return this._clientProxyUser.send(UserMSG.VALID_USER, loginDto);
  }

  /*  
   Metodo para asginar token con una firma en específica (id y email de usuario)
   entrada: datos del usuario. 
   salida: token jwt
  */
  async setToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  /*  
     Metodo para crear un nuevo usuario.
     entrada: datos del usuario. 
     salida: objeto del nuevo usuario.  
  */
  async signUp(userDTO: UserDTO) {
    return this._clientProxyUser.send(UserMSG.CREATE, userDTO);
  }
}
