# ADR 002: Estrategia de ramas

## Estado

Propuesta.

## Contexto

El proyecto requiere una forma simple de organizar cambios sin introducir demasiada complejidad.

## Decision

Se propone una estrategia de ramas basica:

```txt
main
  Rama estable. Contiene versiones listas para entregar o desplegar.

develop
  Rama de integracion. Recibe funcionalidades terminadas antes de pasar a main.

feature/*
  Ramas cortas para cambios concretos, por ejemplo:
  feature/rentas-basicas
  feature/frontend-rentas
  feature/docs-arquitectura
```

## Flujo recomendado

```txt
feature/* -> develop -> main
```

## Justificacion

Esta estrategia permite separar trabajo en progreso de la version estable, sin llegar a un modelo demasiado pesado. Es suficiente para un equipo pequeno y para el alcance academico del proyecto.
