import {Body, Controller, Get, Param, Post, Req, Res, UnprocessableEntityException, UseGuards, HttpException, HttpStatus} from '@nestjs/common';
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
        try {
            const isGoogleLogin = !!loginDto.googlePassword;
            const user = await this._clientProxyUser.send('validateUser', {
                email: loginDto.email,
                password: isGoogleLogin ? loginDto.googlePassword : loginDto.password,
                isGoogleLogin
            }).toPromise();

            if (!user) {
                throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
            }

            // Generate JWT token
            const payload = {
                id: user._id,
                email: user.email
            }
            const token = await this.jwtService.sign(payload);
            return { token };

        } catch (error) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*  
   Metodo para registrar un usuario nuevo.
   entrada: nombre, correo y contraseña de usuario
   salida: token de booleano de autorización
   */
    @Post('signup')
    async signUp(@Body() userDTO: UserDTO) {
        try {
            const user = await this._clientProxyUser.send('createUser', userDTO).toPromise();
            return user;
        } catch (error) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
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
