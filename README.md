# AutoRent

AutoRent es una aplicacion para gestionar clientes, vehiculos y rentas basicas de vehiculos. El proyecto se ejecuta localmente con un backend en NestJS, un frontend en React y una base de datos MongoDB local.

## Arquitectura

El proyecto usa una arquitectura monolitica modular.

Es monolitica porque el backend se ejecuta como una sola aplicacion NestJS. Todas las funcionalidades principales viven en el mismo proceso, se levantan con el mismo comando y comparten la misma conexion a MongoDB.

Es modular porque el codigo esta separado por dominios dentro del mismo backend:

```txt
src/
├── auth/
├── clients/
├── vehicles/
├── rents/
├── seed/
├── app.module.ts
└── main.ts
```

Los modulos no son microservicios. No se despliegan por separado y no se comunican por HTTP entre ellos. NestJS los conecta internamente dentro de la misma aplicacion.

La estructura general es:

```txt
Frontend React
      |
      | HTTP
      v
Backend NestJS monolitico modular
      |
      | Mongoose
      v
MongoDB local
```

La funcionalidad principal trabajada es la gestion basica de rentas:

```txt
Cliente existente + Vehiculo disponible + Fechas validas
                         |
                         v
                   Crear renta
                         |
                         v
              Vehiculo pasa a ALQUILADO
```

## Requisitos

Antes de correr el proyecto necesitas:

- Node.js 20 o superior.
- npm.
- MongoDB corriendo localmente.
- Dos terminales: una para backend y otra para frontend.

## Puertos

```txt
Backend:  http://localhost:3000
Frontend: http://127.0.0.1:5173
MongoDB:  mongodb://127.0.0.1:27017/autorent
```

## 1. Configurar MongoDB local

Inicia MongoDB en tu computador.

La cadena local recomendada es:

```txt
mongodb://127.0.0.1:27017/autorent
```

Si usas MongoDB Compass, conectate a:

```txt
mongodb://127.0.0.1:27017
```

La base de datos `autorent` se crea automaticamente cuando la aplicacion guarda datos.

## 2. Configurar el backend

Abre una terminal en la carpeta del backend:

```bash
cd "C:\Users\EIA2024\Desktop\Universidad EIA\Quinto Semestre\Análisis y Diseño de Software\autorent_backend\autorent"
```

Instala dependencias:

```bash
npm install
```

Crea o edita el archivo `.env` en la raiz del backend:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/autorent
JWT_SECRET=super_secreto_largo_y_unico
JWT_EXPIRES_IN=1d
ADMIN_EMAIL=admin@autorent.local
ADMIN_PASSWORD=Admin123
```

Ejecuta el backend:

```bash
npm run start:dev
```

El backend queda disponible en:

```txt
http://localhost:3000
```

## 3. Configurar el frontend

Abre otra terminal en la carpeta del frontend:

```bash
cd "C:\Users\EIA2024\Desktop\Universidad EIA\Quinto Semestre\Análisis y Diseño de Software\autorent_frontend"
```

Instala dependencias:

```bash
npm install
```

Ejecuta el frontend:

```bash
npm run dev
```

Abre en el navegador la URL que muestra Vite. Normalmente es:

```txt
http://127.0.0.1:5173/
```

## 4. Usuario administrador

Al iniciar el backend, el seed crea automaticamente un administrador si no existe.

Con la configuracion anterior puedes iniciar sesion con:

```txt
Correo: admin@autorent.local
Clave:  Admin123
```

## 5. Flujo para probar la aplicacion

1. Inicia MongoDB local.
2. Corre el backend con `npm run start:dev`.
3. Corre el frontend con `npm run dev`.
4. Abre `http://127.0.0.1:5173/`.
5. Inicia sesion con el usuario administrador.
6. Crea un cliente.
7. Crea un vehiculo.
8. Crea un alquiler con ese cliente y ese vehiculo.
9. Verifica que el vehiculo quede en estado `ALQUILADO`.

## Scripts del backend

```bash
npm run start:dev   # Ejecuta el backend en desarrollo
npm run build       # Compila el backend
npm run test        # Ejecuta pruebas
```

## Scripts del frontend

```bash
npm run dev     # Ejecuta el frontend en desarrollo
npm run build   # Compila el frontend
npm run lint    # Ejecuta revision de lint
```

## Endpoints principales

```txt
POST /auth/login
GET  /auth/me

GET  /clients
POST /clients

GET  /vehicles
POST /vehicles
GET  /vehicles/:id
PATCH /vehicles/:id
DELETE /vehicles/:id
GET  /vehiculos/:id/alquileres

GET  /alquileres
POST /alquileres
GET  /alquileres/:id
```

## Documentacion adicional

La documentacion del proyecto esta en:

```txt
docs/
├── arquitectura.md
├── modelo-dominio.md
├── diagramas/
└── decisiones/
```

El contrato OpenAPI anterior se conserva en:

```txt
docs/openapi.yaml
```

## Notas importantes

- No subas el archivo `.env` al repositorio.
- Para correr localmente usa MongoDB local, no MongoDB Atlas.
- El frontend espera que el backend este corriendo en `http://localhost:3000`.
- Si cambias el puerto del backend, tambien debes ajustar la URL usada por el frontend.
