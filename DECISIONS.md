```markdown
# Documento de Decisiones Técnicas

## 1. Arquitectura

Se implementó una arquitectura en capas:

- Controllers: manejo de requests/responses
- Services: lógica de negocio
- Repositories: acceso a base de datos

Esta separación facilita escalabilidad y testeo.

---

## 2. Base de Datos

Se utilizó PostgreSQL por:

- Robustez
- Soporte ACID
- Integración sencilla con Node
- Soporte para producción real

Las consultas se realizan usando prepared statements para prevenir SQL injection.

---

## 3. Autenticación

Se utilizó JWT porque:

- Es stateless
- Escalable horizontalmente
- No requiere sesiones en servidor

El token incluye:
- userId
- email
- role

---

## 4. Seguridad

- Passwords hasheados con bcrypt
- Middleware de autenticación
- Middleware de autorización por rol
- Validación de inputs
- No exposición de datos sensibles

---

## 5. Frontend

Se utilizó:

- React con hooks
- Context API para manejo de autenticación
- Axios para centralizar llamadas HTTP
- Guards de rutas protegidas

---

## 6. Desafíos Encontrados

- Manejo correcto de tipado en TypeScript
- Sincronización entre backend y frontend
- Manejo de estados de loading y error

---

## 7. Mejoras Futuras

Con más tiempo implementaría:

- Tests unitarios (Jest)
- Dockerización
- Refresh tokens
- Rate limiting
- Deploy en producción
- Validaciones más robustas

---

## 8. Escalabilidad

Para escalar la solución:

- Separar servicios en microservicios
- Implementar Redis para caché
- Implementar sistema de logs centralizado
- Balanceador de carga