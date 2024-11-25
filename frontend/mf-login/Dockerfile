# Usa una imagen base adecuada para tu proyecto
FROM node:18

# Establece el directorio de trabajo dentro del contenedor  ----> MODIFICAR POR CADA DOCKERFILE
WORKDIR /mf-login

# Copia los archivos de tu proyecto al directorio de trabajo
COPY package*.json ./

# Limpia la caché de npm
RUN npm cache clean --force

# Elimina la carpeta node_modules
RUN rm -rf node_modules

# Elimina el archivo package-lock.json
RUN rm package-lock.json

# Instala las dependencias del proyecto
RUN npm install --force

# Copia el resto de los archivos del proyecto al directorio de trabajo
COPY . .

# Expone el puerto en el que se ejecuta tu aplicación ---> MODIFICAR POR CADA DOCKERFILE
EXPOSE 3021

# Comando para iniciar tu aplicación
CMD [ "npm", "start" ]