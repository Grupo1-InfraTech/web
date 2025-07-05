Solemne - Gestión de incidentes tecnícos internos - InfraTech S.A

Contexto y problemática: Se desarrollará un portal de gestiones de incidentes tecnológicos internos. Este portal permitirá a los usuarios registrar y hacer seguimientos de incidentes, asignar técnicos y consultar estadística del portal.

Software necesarios:

- Node.js 22.15
- Angular CLI 19.2.12
- Git 2.49
- IDE
- Docker 28.0.4

Instrucciones de ejecución del "frontend" en git

1.- Asegurar de tener github en pc 

2.- Configurar git por primera vez:
    
<<<<<<< HEAD
    git config --global user.name "nombre"
=======
    git config --global user.namer "nombre"
>>>>>>> df0de82918747e6701377c03972c5f641593ff47
    git config --global user.email "@correo.uss.cl"
3.- Se ejecuta solo una vez y es para los terceros
    
    git clone <url-del-repositorio>.git
    cd <nombre-de-la-carpeta-del-proyecto>
4.- Ir a la carpeta del poyecto

    cd solemne2
5.- Antes de empezar, realizar sincronizacion
    
    git pull origin main
6.- Recomendación: Antes usa "git status" para ver si se modificó algo
    
    git status
7.- Ir a carpeta frontend

    cd frontend
8.- Agregar cambios:

    git add <nombre-del-archivo>  
    add . (para todos los cambios realizados)
9-. Hacer commit:

    git commit -m "descripción de cambios realizados"
10.- Subir los cambios al repositorio remoto (recuerden estar en la rama main):

    git push origin main 

Instrucciones de usos Angular para terceros

1.- Instalar Angular CLI, ngx-charts, jspdf y chart.js

    npm install -g @angular/cli
    npm install @swimlane/ngx-charts
    npm install jspdf
    npm install chart.js
2.- Comprobar instalaciones

    node -v
    npm -v
Sí, hay error. Abril la PowerShell como administrador y ejecuta

    Set-ExecutionPolicy Unrestricted
3.- Instalar dependencias de Angular

    npm install
4.- Iniciar servidor

    Modo de desarrollo: ng serve 
    Acceso desde cualquier dispositivo: ng serve --host 0.0.0.0

---

## Ejecución completa con Docker Compose (Frontend + Backend + Base de Datos)

Puedes levantar **todo el sistema** (frontend, backend y base de datos) fácilmente usando Docker Compose.

### Pasos

1. Asegúrate de tener Docker Desktop instalado y en ejecución.
2. Abre una terminal en la raíz del proyecto (donde está el archivo `docker-compose.yml`).
3. Ejecuta el siguiente comando:

    ```sh
    docker compose up --build
    ```

4. Espera a que todos los servicios se inicien correctamente.

### Acceso a las aplicaciones

- **Frontend Angular:** [http://localhost:4200](http://localhost:4200)
- **Backend Django API:** [http://localhost:8000/api/](http://localhost:8000/api/)

### Detener los servicios

Para detener todos los servicios, presiona `Ctrl+C` en la terminal y luego ejecuta:

```sh
docker compose down
```

> **Nota:**  
> Si es la primera vez que ejecutas el proyecto, la base de datos se inicializará automáticamente.  
> Si necesitas reiniciar todo desde cero (incluyendo la base de datos), puedes usar:
> 
> ```sh
> docker compose down -v
> ```

---

Instrucciones para ejecutar Docker solo para el frontend (opcional)

1.- tener docker desktop instalado 

2.- Hacer estos pasos:
    
    git clone https://github.com/Grupo1-InfraTech/web.git
    cd <carpeta_del_proyecto>
    docker build -t frontend .
    docker run -p 4200:4200 frontend
    Luego ir al navegador: http://localhost:4200