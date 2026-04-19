# ADR 001: Usar monolito modular para la gestion basica de rentas

## Estado

Aceptada.

## Contexto

El proyecto AutoRent necesita mostrar una funcionalidad sencilla pero representativa del negocio. La funcionalidad seleccionada es la gestion basica de rentas, que relaciona clientes, vehiculos y rentas.

## Decision

Se decide implementar esta funcionalidad dentro de una arquitectura monolitica modular usando NestJS. La aplicacion se mantiene como un unico backend, pero organizada por modulos de dominio.

Modulos incluidos en el alcance:

- `AuthModule`
- `ClientsModule`
- `VehiclesModule`
- `AlquileresModule`

## Consecuencias

Ventajas:

- Menor complejidad de despliegue.
- Comunicacion interna directa entre modulos.
- Facil de ejecutar localmente.
- Adecuada para un proyecto academico con alcance controlado.

Limitaciones:

- No hay independencia de despliegue por funcionalidad.
- Todos los modulos comparten el mismo proceso backend.
- El crecimiento futuro debe manejarse con buena separacion interna para evitar acoplamiento excesivo.
