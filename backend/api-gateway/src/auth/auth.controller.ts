import {Body, Controller, Get, Param, Post, Req, Res, UnprocessableEntityException, UseGuards} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserMSG } from 'src/common/constants';
import { ClientProxyMeetflow } from 'src/common/proxy/client-proxy';
import { LoginDto } from 'src/user/dto/login.dto';
import { UserDTO } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Observable } from 'rxjs';
import {AuthGuard} from "@nestjs/passport";

@ApiTags('Autentificación (auth)')
@Controller('api/auth')
export class AuthController {

    constructor(private readonly jwtService: JwtService, private readonly clientProxy: ClientProxyMeetflow, private readonly authService: AuthService) {
    }

    // cliente proxy de notificaciones
    private _clientProxyNotifications =
        this.clientProxy.clientProxyNotification();

    // cliente proxy de usuarios
    private _clientProxyUser = this.clientProxy.clientProxyUser();

    /*  
    Metodo para iniciar sesión de usuario.
    entrada: correo y contraseña de usuario
    salida: token de usuario validado 
    */
    @Post('signin')
    async signIn(@Body() loginDto: any) {
        console.log("obteniendo usuario", loginDto);
        const isExist = await this._clientProxyUser.send('VALID_USER', loginDto).toPromise();
        if (isExist) {
            console.log("existe", isExist);
            const payload = {
                id: isExist._id,
                email: isExist.email
            }
            console.log("PAYLOAD:", payload);
            const token = await this.jwtService.sign(payload);
            return { token };
        }
        else {
            console.log("no existe");
            throw new UnprocessableEntityException('No existe el usuario especificado o la contraseña es incorrecta.');
        }
    }

    /*  
   Metodo para registrar un usuario nuevo.
   entrada: nombre, correo y contraseña de usuario
   salida: token de booleano de autorización
   */
    @Post('signup')
    async signUp(@Body() userDTO: UserDTO) {
        console.log("solicitando crear el usuario: ", userDTO);
        const isExist = await this._clientProxyUser.send(UserMSG.CREATE, userDTO).toPromise();
        if (isExist) {
            console.log("usuario creado: ", isExist);
            return { isExist };
        }
        else {
            console.log("Correo ya registrado")
            throw new UnprocessableEntityException('Usuario ya registrado, favor de iniciar sesión:w.');
        }
    }


    /*  
    Metodo para resetear contraseña y obtener una nueva mediante correo electronico
    entrada: correo electronico de usuario a recuperar contraseña
    salida: se envia contraseña por correo
    */
    @Get('resetpass/:email')
    @ApiOperation({ summary: 'obtener nueva contraseña' })
    async resetPass(@Param('email') email: string): Promise<Observable<any>> {
        const user = await this._clientProxyUser.send('RESET_PASS', email).toPromise();
        if (user) {
            await this._clientProxyNotifications.send('SEND_PASS', user).toPromise();
            return user;
        }
        else {
            throw new UnprocessableEntityException('no existe un usuario con ese correo electronico.');
        }
    }

    /*  
Metodo para resetear contraseña y obtener una nueva mediante correo electronico
entrada: correo electronico de usuario a recuperar contraseña
salida: se envia contraseña por correo
*/
    @Post('notify/user/invited/new')
    @ApiOperation({ summary: 'obtener nueva contraseña' })
    async notifyNewUser(@Body() newUser: any): Promise<Observable<any>> {
        return await this._clientProxyNotifications.send('SEND_INVITED_NEW_USER', newUser).toPromise();
    }

}
