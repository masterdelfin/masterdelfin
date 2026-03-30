# MedRecords — Sistema de Fichas Médicas

Sistema web para la gestión de fichas médicas de pacientes, diseñado para médicos que necesitan acceder al historial completo de sus pacientes de forma organizada y eficiente.

## Características

- **Autenticación de médicos** — Registro, inicio de sesión y gestión de perfil
- **Salas de pacientes** — Espacios virtuales donde el médico accede a toda la información de un paciente específico
- **Historial de consultas** — Registro completo de todas las consultas con formato SOAP (Subjetivo, Objetivo, Evaluación, Plan)
- **Fichas de pacientes** — Información demográfica, alergias, medicamentos actuales e historia médica
- **Recetas digitales** — Registro de prescripciones por consulta

## Arquitectura

```
masterdelfin/
├── server/          # Backend — Node.js + Express + SQLite
└── client/          # Frontend — React + Vite
```

### Backend
- **Node.js + Express** — API REST
- **better-sqlite3** — Base de datos SQLite
- **bcryptjs** — Hash de contraseñas
- **jsonwebtoken** — Autenticación JWT

### Frontend
- **React 18** — Interfaz de usuario
- **Vite** — Build tool
- **React Router v6** — Navegación
- **Axios** — Cliente HTTP

## Instalación

### Requisitos
- Node.js >= 18

### Backend

```bash
cd server
cp .env.example .env
# Editar .env y configurar JWT_SECRET
npm install
npm run dev
```

El servidor se iniciará en `http://localhost:3001`.

### Frontend

```bash
cd client
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Estructura de la Base de Datos

| Tabla | Descripción |
|-------|-------------|
| `doctors` | Médicos registrados en el sistema |
| `patients` | Fichas de pacientes |
| `salas` | Salas virtuales (relación médico-paciente) |
| `consultations` | Registro de consultas médicas |

## Flujo de Uso

1. El médico se registra en el sistema
2. Crea una ficha para su paciente
3. Abre una **sala** para ese paciente
4. Dentro de la sala puede ver:
   - Información completa del paciente
   - Historial de todas las consultas anteriores
5. Registra una nueva consulta con notas SOAP y recetas

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar médico |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/doctors/me` | Perfil del médico |
| GET | `/api/patients` | Listar pacientes |
| POST | `/api/patients` | Crear paciente |
| GET | `/api/salas` | Listar salas |
| POST | `/api/salas` | Crear sala |
| GET | `/api/salas/:id` | Detalle de sala (con paciente) |
| GET | `/api/salas/:id/consultations` | Historial de consultas |
| POST | `/api/salas/:id/consultations` | Nueva consulta |
