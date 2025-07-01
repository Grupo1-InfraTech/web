# Usar una imagen base de Node.js
FROM node:20 AS build

# Instalar git
RUN apt-get update && apt-get install -y git

# Establecer el directorio de trabajo
WORKDIR /app

# Clonar el repositorio público
ARG REPO_URL=https://github.com/Grupo1-InfraTech/web.git
RUN git clone ${REPO_URL} .

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

# Cambiar al directorio frontend e instalar dependencias
WORKDIR /app/frontend
RUN npm install

# Instalar dependencias y construir la app Angular
RUN npm run build -- --output-path=dist

# Usar Nginx para servir la app en producción
FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]