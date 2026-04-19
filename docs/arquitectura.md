# Arquitectura del backend AutoRent

## Tipo de arquitectura

El backend de AutoRent utiliza una arquitectura monolitica modular. La aplicacion se ejecuta como un unico servicio NestJS, pero organiza el codigo por modulos funcionales para separar responsabilidades.

La funcionalidad seleccionada para el trabajo es la gestion basica de rentas de vehiculos. Esta funcionalidad usa tres modulos principales:

- `AuthModule`: protege los endpoints mediante autenticacion JWT.
- `ClientsModule`: administra clientes y permite validar que el cliente exista.
- `VehiclesModule`: administra vehiculos, disponibilidad y estado operativo.
- `AlquileresModule`: crea y consulta rentas relacionando clientes y vehiculos.

## Vista general

```txt
Frontend React local
        |
        | HTTP
        v
Backend NestJS monolitico modular
        |
        | Mongoose
        v
MongoDB local
```

## Capas principales

```txt
Controller
  Recibe peticiones HTTP y expone endpoints REST.

Service
  Contiene reglas de negocio y coordina modelos internos.

Schema / Model
  Define las entidades persistidas en MongoDB.

MongoDB
  Guarda clientes, vehiculos, usuarios y rentas.
```

## Modulo de rentas

El modulo de rentas representa la funcionalidad central del trabajo. Su objetivo es permitir que un cliente existente rente un vehiculo disponible durante un rango de fechas valido.

Archivos principales:

```txt
src/rents/rents.module.ts
src/rents/rents.controller.ts
src/rents/rents.service.ts
src/rents/dto/create-rent.dto.ts
src/rents/schemas/rent.schema.ts
```

## Flujo principal

```txt
POST /alquileres
    |
    v
AlquileresController.create()
    |
    v
AlquileresService.create()
    |
    +-- valida IDs de cliente y vehiculo
    +-- valida fechas
    +-- verifica que el cliente exista
    +-- verifica que el vehiculo exista
    +-- valida que el vehiculo este DISPONIBLE
    +-- crea la renta en MongoDB
    +-- cambia el vehiculo a ALQUILADO
```

## Endpoints incluidos

```txt
POST /alquileres
GET  /alquileres
GET  /alquileres/:id
GET  /vehiculos/:id/alquileres
```

## Funcionalidades excluidas

Para mantener el alcance simple y coherente con la arquitectura monolitica elegida, se excluyeron:

- Mantenimientos.
- Recordatorios.
- Notificaciones.
- Fotos iniciales o finales.
- Cancelacion avanzada de contratos.
- Finalizacion con dias de exceso.

## Justificacion

La gestion basica de rentas es adecuada para representar un monolito modular porque integra varias entidades del dominio dentro de una unica aplicacion backend. Aunque intervienen clientes, vehiculos y rentas, no hay servicios independientes ni comunicacion entre microservicios. Toda la logica se ejecuta dentro del mismo proceso NestJS y comparte la misma base de datos MongoDB.
