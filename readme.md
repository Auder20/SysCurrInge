# SysCurrInge — Sistema de Gestión de Actas Curriculares

Aplicación web fullstack para la gestión de reuniones, actas, tareas y usuarios del comité curricular de un programa de Ingeniería en Sistemas. Desarrollada como proyecto académico con una arquitectura cliente-servidor separada.

---

## ¿Qué hace esta aplicación?

El sistema permite administrar el ciclo completo de una reunión de comité curricular:

- **Autenticación y registro de usuarios** con verificación por correo electrónico y control de roles
- **Gestión de usuarios** (CRUD completo) con soporte para múltiples roles: administrador, coordinador, miembro, invitado y jefe de departamento
- **Gestión de tareas** asignadas a usuarios según su rol, con estados (pendiente, en progreso, completada) y fechas de vencimiento
- **Programación de reuniones** con asignación de organizador y ubicación
- **Redacción de actas** con temas tratados, decisiones, asistentes y tareas derivadas
- **Control de acceso por rol**: cada tipo de usuario ve un dashboard distinto con las funcionalidades correspondientes

---

## Tecnologías utilizadas

### Backend
- **Node.js** con **Express** — servidor HTTP y manejo de rutas
- **Sequelize** — ORM para interacción con la base de datos
- **MySQL** — base de datos relacional
- **JWT (jsonwebtoken)** — autenticación stateless mediante tokens
- **bcryptjs** — hash de contraseñas
- **Nodemailer** — envío de correos para verificación de cuenta
- **dotenv** — manejo de variables de entorno

### Frontend
- **React** (Create React App) — librería principal de UI
- **React Router DOM** — navegación entre vistas
- **Axios** — cliente HTTP para consumir la API
- **React Bootstrap** y **Bootstrap** — componentes y estilos
- **React Icons** — íconos en la interfaz
- **jwt-decode** — decodificación del token en el cliente para determinar el rol del usuario

---

## Estructura del proyecto

```
/
├── backend/
│   ├── config/          # Configuración de la base de datos (Sequelize)
│   ├── controllers/     # Lógica de negocio (auth, admin, registro)
│   ├── middlewares/     # Middleware de autenticación JWT
│   ├── models/          # Modelos Sequelize (Usuario, Tarea, Reunión)
│   ├── routes/          # Definición de rutas REST
│   ├── services/        # Servicio de correo electrónico
│   └── index.js         # Punto de entrada del servidor
│
└── frontend/
    └── src/
        ├── components/  # Componentes React (Login, Register, dashboards, CRUD forms)
        ├── context/     # Contextos de React para estado global (Auth, Admin, Register)
        ├── hooks/       # Hooks personalizados para consumir los contextos
        ├── services/    # Instancia de Axios configurada
        └── styles/      # Estilos CSS
```

---

## API REST — Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Inicio de sesión, retorna JWT |
| POST | `/api/register/register` | Registro de nuevo usuario |
| GET | `/api/register/admin-exists` | Verifica si ya existe un administrador |
| POST | `/api/register/send-verification-code` | Envía código al correo |
| POST | `/api/register/verify-code` | Valida el código de verificación |
| GET | `/api/admin/loadUsers` | Lista todos los usuarios |
| PUT | `/api/admin/updateUser` | Actualiza un usuario |
| DELETE | `/api/admin/deleteUser/:id` | Elimina un usuario |
| GET | `/api/admin/loadTasks` | Lista todas las tareas |
| POST | `/api/admin/addTask` | Crea una nueva tarea |
| PUT | `/api/admin/updateTask` | Actualiza una tarea |
| DELETE | `/api/admin/deleteTask/:id` | Elimina una tarea |
| POST | `/api/admin/addMeeting` | Crea una nueva reunión |

---

## Instalación y ejecución local

### Requisitos previos
- Node.js >= 14
- MySQL corriendo localmente

### Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en `/backend` con las siguientes variables:

```env
PORT=5000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASS=tu_contraseña
DB_NAME=syscurringe
JWT_SECRET=tu_secreto
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASSWORD=tu_app_password
```

```bash
npm run dev
```

### Seed (Datos iniciales)

Para poblar la base de datos con usuarios de ejemplo y datos de prueba:

```bash
cd backend
node seed.js
```

O para ejecución automática al iniciar el servidor, agrega a tu `.env`:
```env
RUN_SEED=true
```

**Nota importante**: La seed está diseñada para ser idempotente - solo inserta datos si no existen previamente.

### Frontend

```bash
cd frontend
npm install
npm start
```

La app estará disponible en `http://localhost:3000` y consumirá el backend en `http://localhost:5000/api`.

---

## Notas de desarrollo

- El sistema de roles determina a qué dashboard se redirige el usuario tras el login. El rol y el tipo de usuario están codificados en el JWT y se decodifican en el frontend.
- El primer usuario en registrarse puede elegir el rol de administrador; ese rol queda deshabilitado en el formulario una vez que ya existe uno.
- La verificación de correo usa un código de 6 dígitos con expiración de 15 minutos.
- El middleware de autenticación protege las rutas del panel de administración verificando el token en el header `Authorization: Bearer <token>`.

---

## Despliegue

### Render (Backend)

El backend está configurado para desplegarse en **Render**. Para que la seed se ejecute automáticamente en producción:

1. En el dashboard de Render, ve a tu proyecto
2. Settings → Environment Variables  
3. Agrega: `RUN_SEED` = `true`

### Vercel (Frontend)

El frontend se despliega en **Vercel** con configuración automática.

---

## Estado del proyecto

Proyecto en desarrollo. Algunas funcionalidades como la generación de reportes, el módulo de actas completo y la gestión de asistencia están parcialmente implementadas o pendientes de integración con el backend.

---

## Autor

Desarrollado por **Auder Gonzalez, Alcidez y Miguel** como proyecto del ciclo académico de Ingeniería en Sistemas.