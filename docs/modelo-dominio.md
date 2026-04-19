# Modelo de dominio

## Dominio seleccionado

El dominio trabajado es la gestion basica de rentas de vehiculos. El sistema permite registrar clientes, registrar vehiculos y crear rentas entre ambos.

## Entidades principales

### Cliente

Representa a la persona que puede rentar un vehiculo.

Atributos principales:

```txt
_id
fullName
documentType
documentNumber
phone
email
status
```

Responsabilidades:

- Identificar a la persona que realiza la renta.
- Mantener informacion de contacto.
- Servir como referencia desde una renta.

### Vehiculo

Representa un vehiculo de la flota.

Atributos principales:

```txt
_id
plate
brand
model
year
status
```

Estados usados en el alcance simplificado:

```txt
DISPONIBLE
ALQUILADO
INACTIVO
```

Responsabilidades:

- Registrar informacion basica del vehiculo.
- Indicar si puede ser rentado.
- Cambiar a `ALQUILADO` cuando se crea una renta activa.

### Renta

Representa el contrato basico entre un cliente y un vehiculo.

Atributos principales:

```txt
_id
cliente
vehiculo
fechaInicio
fechaFin
estado
createdAt
updatedAt
```

Estados usados:

```txt
ACTIVO
```

Responsabilidades:

- Asociar un cliente con un vehiculo.
- Registrar el periodo de uso del vehiculo.
- Mantener el historial basico de rentas.

## Relaciones

```txt
Cliente 1 ---- * Renta
Vehiculo 1 ---- * Renta
```

Una renta pertenece a un cliente y a un vehiculo. Un cliente puede tener varias rentas a lo largo del tiempo. Un vehiculo tambien puede tener varias rentas en su historial, pero en el alcance simplificado solo puede tener una renta activa.

## Reglas de negocio

- No se puede crear una renta si el cliente no existe.
- No se puede crear una renta si el vehiculo no existe.
- No se puede crear una renta si el vehiculo no esta `DISPONIBLE`.
- La fecha fin debe ser mayor que la fecha inicio.
- Al crear una renta, el estado de la renta queda como `ACTIVO`.
- Al crear una renta, el vehiculo cambia a `ALQUILADO`.
- No se permite mas de una renta activa para el mismo vehiculo.

## Caso de uso principal

```txt
Crear renta basica

Actor: Administrador
Precondiciones:
- El administrador inicio sesion.
- Existe al menos un cliente registrado.
- Existe al menos un vehiculo disponible.

Flujo:
1. El administrador abre la pantalla de alquileres.
2. Selecciona crear nuevo alquiler.
3. Selecciona cliente.
4. Selecciona vehiculo disponible.
5. Ingresa fecha inicio y fecha fin.
6. El sistema valida los datos.
7. El sistema crea la renta.
8. El sistema cambia el vehiculo a ALQUILADO.
9. El sistema muestra la renta en el listado.
```
