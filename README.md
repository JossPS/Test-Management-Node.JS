# Prueba Técnica - WoowTechnology

## 📌 Descripción

Aplicación fullstack desarrollada con:

- Backend: Node.js + Express + TypeScript
- Base de datos: PostgreSQL
- Autenticación: JWT
- Frontend: React + TypeScript
- Arquitectura limpia (controllers, services, repositories)

El sistema permite:

- Registro de usuarios
- Login con JWT
- Perfil editable
- Gestión de roles (user / admin)
- Listado de usuarios para administradores

---

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- bcryptjs
- jsonwebtoken
- express-validator

### Frontend
- React 18
- TypeScript
- React Router
- Axios
- CSS puro

---

## 📦 Estructura del Proyecto
root/
├── backend/
├── frontend/
├── database/
└── package.json


---

## ⚙️ Prerrequisitos

- Node.js 18+
- PostgreSQL 14+
- npm

---

## 🔐 Variables de Entorno

Crear un archivo `.env` dentro de `backend/`:


---

## 🗄️ Configuración de Base de Datos

1. Crear base de datos:

```sql
CREATE DATABASE woow_db

Ejecutar database/schema.sql

Ejecutar database/seed.sql (opcional)
Instalación

Instalar dependencias del backend:

cd backend
npm install

Instalar dependencias del frontend:

cd frontend
npm install

Ejecutar Proyecto

cd ..
npm run dev

Desde la raíz del proyecto:

```bash
npm install
npm run dev
```



Servidor en:

🔑 Credenciales de Prueba
Usuario Admin

Email: admin@example.com

Password: 12345678

Usuario Normal

Email: user@example.com

Password: 12345678

📡 Endpoints
Registro

POST /api/auth/register

Login

POST /api/auth/login

Perfil

GET /api/users/me

Actualizar Perfil

PUT /api/users/me

Listar Usuarios (admin)

GET /api/users
Seguridad Implementada

Passwords hasheados con bcrypt

JWT con userId, email y role

Middleware de autenticación

Middleware de autorización por rol

Validaciones con express-validator

Prepared statements (prevención SQL injection)

No se exponen passwords en respuestas
Consideraciones

TypeScript estricto

Separación de responsabilidades

Manejo centralizado de errores

Variables sensibles en .env