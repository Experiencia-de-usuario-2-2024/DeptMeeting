import { Controller } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientProxyMeetflow } from 'src/common/proxy/client-proxy';
import {
    Body,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { IJavaTest } from 'src/common/interfaces/java-test.interface';
import { Observable } from 'rxjs';

@ApiTags('Microservicio de java test')
@Controller('api/javatest')
export class JavaTestController {
    // Entrada: cliente proxy global
    constructor(private readonly clientProxy: ClientProxyMeetflow) { }

    // cliente proxy de notificaionces
    private _ClientProxyJavaTest = this.clientProxy.clientProxyJavaTest();

     /* 
    Modelo estructural de datos:

        1. IJavaTest:    Interface

        2. JavaTestMSG:  Mensajeria por RabbitMQ

        3. javaTestDTO:  JavaTestDTO: Objeto de transferencia de datos 

    */

    // METODOS CRUD para notificaciones

    /*  
    Metodo para crear una nueva notificación.
    entrada: datos de la notificación. 
    salida: objeto de nueva notificación.  
    */
    @Post()
    @ApiOperation({ summary: 'Crear un java test' })
    async create(@Body() javaTest: any): Promise<Observable<IJavaTest>> {
        return await this._ClientProxyJavaTest.send('create', javaTest);
    }

    /*  
    Metodo para obtener todas las notificaciones.
    salida: objeto de notificaciones encontradas. 
    */
    @Get()
    @ApiOperation({ summary: 'Obtener todos los java test' })
    async findAll(): Promise<Observable<IJavaTest[]>> {
        return await this._ClientProxyJavaTest.send('getAll', '');
    }

    /*  
    Metodo para  obtener una notificación a partir del id.
    entrada: id de la notificación. 
    salida: objeto de la notificación encontrada.  
    */
    @Get('/getNotificationByID/:id')
    @ApiOperation({ summary: 'Obtener notificación por id' })
    async findOne(@Param('id') id: string) {
        return await this._ClientProxyJavaTest.send('getForId', id);
    }

    /*  
    Metodo para actualizar una notificación a partir del id.
    entrada: id de la notificación y nuevos datos de la notificación. 
    salida: objeto de la notificacion actualizada.
    */
    @Put(':id')
    @ApiOperation({ summary: 'Actualizar notificación por id' })
    async update(
        @Param('id') id: string,
        @Body() javaTest: any,
    ): Promise<Observable<IJavaTest>> {
        return await this._ClientProxyJavaTest.send('update', { id, javaTest });
    }

    /*  
    Metodo para borrar permanentemente una notificación a partir del id.
    entrada: id de la notificación.
    salida: valor booleano de confirmación.
    */
    @Delete(':id')
    @ApiOperation({ summary: 'Borrar permanentemente una notificación por id' })
    delete(@Param('id') id: string): Observable<any> {
        return this._ClientProxyJavaTest.send('delete', id);
    }
}
