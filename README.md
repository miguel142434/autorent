Flujo de autenticación actual (Autorent) — Solo ADMIN

1) Login

Endpoint: POST http://localhost:3000/auth/login
Body esperado (JSON):
{
  "email": "admin@autorent.local",
  "password": "Admin123"
}
Respuesta exitosa (200):
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f0c1f9e8c4a1b2c3d4e5f6",
    "email": "admin@autorent.local",
    "role": "ADMIN"
  }
}
2) Errores posibles

Credenciales inválidas (401):
{
  "statusCode": 401,
  "message": "Credenciales inválidas",
  "error": "Unauthorized"
}
Validación (400) — ejemplo si falta email:
{
  "statusCode": 400,
  "message": [
    "email must be an email"
  ],
  "error": "Bad Request"
}
3) Uso del JWT

Guardas el access_token en el frontend (ej. localStorage).
En cada request protegido, envías:
Authorization: Bearer <access_token>
4) Ruta protegida (ejemplo real del backend)

Endpoint: GET http://localhost:3000/auth/me
Header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Respuesta (200):
{
  "id": "65f0c1f9e8c4a1b2c3d4e5f6",
  "email": "admin@autorent.local",
  "role": "ADMIN"
}
Protección: esta ruta usa JwtAuthGuard (requiere token válido).
5) Cómo se protege una ruta en NestJS

@UseGuards(JwtAuthGuard)
@Get('me')
me(@Req() req) {
  return req.user;
}
6) Flujo completo (Login → Dashboard → Logout)

Login: React envía POST /auth/login con email/password del ADMIN.
Backend responde con access_token y user.
Frontend guarda el token (ej. localStorage).
Dashboard: React pide datos protegidos (ej. /auth/me) con Authorization: Bearer <token>.
Backend valida el JWT y responde con los datos del ADMIN.
Logout: el frontend elimina el token (no hay endpoint de logout).
Notas clave

Solo existe un usuario ADMIN por ahora (seed inicial).
Si el token expira o es inválido, el backend responde 401.
isActive = false bloquearía el login (mismo error genérico).