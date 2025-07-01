# Backend - InfraTech Incident Management

Este backend está construido con Django y Django Rest Framework.

## Requisitos
- Python 3.11+
- pip
- Docker (opcional)

## Instalación y ejecución local

1. Instala dependencias:
   ```sh
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Aplica migraciones:
   ```sh
   python manage.py migrate
   ```
3. Ejecuta el servidor:
   ```sh
   python manage.py runserver
   ```

## Ejecución con Docker

1. Construye la imagen:
   ```sh
   docker build -t backend .
   ```
2. Ejecuta el contenedor:
   ```sh
   docker run -p 8000:8000 backend
   ```

## Variables de entorno
Puedes crear un archivo `.env` para definir variables de entorno como la configuración de la base de datos.

## Endpoints
- `/api/` - API REST de incidentes, usuarios, etc.

---
