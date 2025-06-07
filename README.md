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
    
    git config --global user.namer "nombre"
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

Instrucciones de usos Angular en terceros

1.- Instalar Angular CLI y ngx-charts

    npm install -g @angular/cli
    npm install @swimlane/ngx-charts
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

Instrucciones para ejecutar Docker