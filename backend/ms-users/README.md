# ms-users
Microservicio asociado a la gestión de usuarios en D-MeetFlow++. Ofrece soporte para roles de usuario y usa el motor de base de datos MongoDB

## Consideraciones
Se debe tener instalado node versión 16 o superior.
El microservicio corre en el puerto 4010.

## Pasos para iniciar el microservicio
1. Ingresar a la carpeta
  
  ### `cd ms-users`

2. Instalar las dependencias

  ### `npm install`

3. Iniciar el microservicio
   
  ### `npm run start:dev`

4. Probar funcionamiento

#### Para probar las peticiones, se puede utilizar Postman, donde se debe importar el archivo ms-users.postman_collection.json. Asegurarse que al momento de hacer un POST, el body esté en formato raw, en JSON.
