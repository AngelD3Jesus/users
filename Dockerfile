#Usar una imagen base de Node.js
FROM node:18

#Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

#Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./

#Instalar dependencias
RUN npm install

#Copiar el resto de los archivos
COPY . .

#Exponer el puerto en el que corre el servicio
EXPOSE 5001

#Comando para iniciar la aplicación
CMD ["node", "index.js"]