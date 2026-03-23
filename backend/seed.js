// ============================================================
//  seed.js  —  Semilla de datos para SysCurringe
//  Ubicación: backend/seed.js
//  Uso:       node seed.js
// ============================================================
//
//  INSTRUCCIONES:
//  1. Copia este archivo en la carpeta backend/
//  2. Asegúrate de tener el .env configurado con tus credenciales de BD
//  3. Ejecuta: node seed.js
//  4. El script crea las tablas (si no existen) e inserta los datos
//
//  USUARIOS CREADOS:
//  ┌─────────────────────────────┬──────────────────┬──────────────┬──────────────┐
//  │ Correo                      │ Contraseña       │ Rol          │ Tipo         │
//  ├─────────────────────────────┼──────────────────┼──────────────┼──────────────┤
//  │ admin@syscurringe.com       │ Admin123!        │ administrador│ —            │
//  │ coordinador@syscurringe.com │ Coord123!        │ coordinador  │ moderador    │
//  │ asistente@syscurringe.com   │ Asist123!        │ coordinador  │ asistente    │
//  │ miembro@syscurringe.com     │ Miembro123!      │ participante │ miembro      │
//  │ invitado@syscurringe.com    │ Invitado123!     │ participante │ invitado     │
//  │ ana.lopez@syscurringe.com   │ Ana123!          │ participante │ miembro      │
//  │ carlos.ruiz@syscurringe.com │ Carlos123!       │ coordinador  │ moderador    │
//  └─────────────────────────────┴──────────────────┴──────────────┴──────────────┘
// ============================================================

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');

// ── Conexión ──────────────────────────────────────────────
const sequelize = require('./config/database');

// ── Modelos (inline para que el seed sea autónomo) ─────────

const Usuario = sequelize.define('Usuario', {
  id_usuario:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:              { type: DataTypes.STRING,  allowNull: false },
  apellido:            { type: DataTypes.STRING,  allowNull: false },
  correo_electronico:  { type: DataTypes.STRING,  allowNull: false, unique: true },
  contrasena:          { type: DataTypes.STRING,  allowNull: false },
  rol:                 { type: DataTypes.STRING,  allowNull: false },
  tipo_usuario:        { type: DataTypes.STRING,  allowNull: true },
  estado:              { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'usuario', timestamps: false });

const Tarea = sequelize.define('Tarea', {
  id_tarea:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descripcion:      { type: DataTypes.TEXT,    allowNull: false },
  fecha_creacion:   { type: DataTypes.DATE,    defaultValue: DataTypes.NOW },
  fecha_vencimiento:{ type: DataTypes.DATE },
  estado:           { type: DataTypes.ENUM('pendiente', 'en_progreso', 'completada'), defaultValue: 'pendiente' },
  id_usuario:       { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'tarea', timestamps: false });

const Reunion = sequelize.define('Reunion', {
  id_reunion:    { type: DataTypes.INTEGER,     primaryKey: true, autoIncrement: true },
  nombre_reunion:{ type: DataTypes.STRING(100), allowNull: false },
  fecha:         { type: DataTypes.DATEONLY,    allowNull: false },
  ubicacion:     { type: DataTypes.STRING(100), allowNull: true },
  id_usuario:    { type: DataTypes.INTEGER,     allowNull: true },
}, { tableName: 'reunion', timestamps: false });

const Agenda = sequelize.define('Agenda', {
  id_agenda:  { type: DataTypes.INTEGER,     primaryKey: true, autoIncrement: true },
  id_reunion: { type: DataTypes.INTEGER,     allowNull: false },
  titulo:     { type: DataTypes.STRING(200), allowNull: false },
  descripcion:{ type: DataTypes.TEXT,        allowNull: true },
  responsable:{ type: DataTypes.STRING(100), allowNull: true },
  tiempo:     { type: DataTypes.INTEGER,     allowNull: true },
  estado:     { type: DataTypes.STRING(50),  allowNull: false, defaultValue: 'pendiente' },
}, { tableName: 'agenda', timestamps: true });

const VerificationCode = sequelize.define('VerificationCode', {
  email:          { type: DataTypes.STRING, allowNull: false, unique: true },
  code:           { type: DataTypes.STRING, allowNull: false },
  expirationTime: { type: DataTypes.BIGINT, allowNull: false },
}, { tableName: 'verification_codes', timestamps: true });

// ── Función principal ──────────────────────────────────────
async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa\n');

    // Sincronizar tablas (crea si no existen, NO borra datos existentes)
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas\n');

    // ── 1. USUARIOS ──────────────────────────────────────
    console.log('📦 Insertando usuarios...');

    const usuariosData = [
      {
        nombre: 'Alcides',
        apellido: 'Administrador',
        correo_electronico: 'admin@syscurringe.com',
        contrasena: 'Admin123!',
        rol: 'administrador',
        tipo_usuario: null,
        estado: true,
      },
      {
        nombre: 'Carlos',
        apellido: 'Ruiz',
        correo_electronico: 'carlos.ruiz@syscurringe.com',
        contrasena: 'Carlos123!',
        rol: 'coordinador',
        tipo_usuario: 'moderador',
        estado: true,
      },
      {
        nombre: 'Laura',
        apellido: 'Coordinadora',
        correo_electronico: 'coordinador@syscurringe.com',
        contrasena: 'Coord123!',
        rol: 'coordinador',
        tipo_usuario: 'moderador',
        estado: true,
      },
      {
        nombre: 'Sofía',
        apellido: 'Asistente',
        correo_electronico: 'asistente@syscurringe.com',
        contrasena: 'Asist123!',
        rol: 'coordinador',
        tipo_usuario: 'asistente',
        estado: true,
      },
      {
        nombre: 'Ana',
        apellido: 'López',
        correo_electronico: 'ana.lopez@syscurringe.com',
        contrasena: 'Ana123!',
        rol: 'participante',
        tipo_usuario: 'miembro',
        estado: true,
      },
      {
        nombre: 'Juan',
        apellido: 'Miembro',
        correo_electronico: 'miembro@syscurringe.com',
        contrasena: 'Miembro123!',
        rol: 'participante',
        tipo_usuario: 'miembro',
        estado: true,
      },
      {
        nombre: 'Pedro',
        apellido: 'Invitado',
        correo_electronico: 'invitado@syscurringe.com',
        contrasena: 'Invitado123!',
        rol: 'participante',
        tipo_usuario: 'invitado',
        estado: false,
      },
    ];

    const usuariosCreados = [];

    for (const u of usuariosData) {
      const existe = await Usuario.findOne({ where: { correo_electronico: u.correo_electronico } });
      if (existe) {
        console.log(`   ⏭  Usuario ya existe: ${u.correo_electronico}`);
        usuariosCreados.push(existe);
        continue;
      }
      const hash = await bcrypt.hash(u.contrasena, 10);
      const nuevo = await Usuario.create({ ...u, contrasena: hash });
      usuariosCreados.push(nuevo);
      console.log(`   ✔  Creado: ${u.correo_electronico} (${u.rol})`);
    }

    // Referencias útiles
    const admin      = usuariosCreados.find(u => u.rol === 'administrador');
    const coord1     = usuariosCreados.find(u => u.correo_electronico === 'carlos.ruiz@syscurringe.com');
    const coord2     = usuariosCreados.find(u => u.correo_electronico === 'coordinador@syscurringe.com');
    const miembro1   = usuariosCreados.find(u => u.correo_electronico === 'ana.lopez@syscurringe.com');
    const miembro2   = usuariosCreados.find(u => u.correo_electronico === 'miembro@syscurringe.com');

    // ── 2. TAREAS ─────────────────────────────────────────
    console.log('\n📦 Insertando tareas...');

    const tareasExistentes = await Tarea.count();
    if (tareasExistentes > 0) {
      console.log(`   ⏭  Ya existen ${tareasExistentes} tareas, se omite la inserción`);
    } else {
      const tareas = [
        {
          descripcion: 'Preparar presentación para la reunión de planificación trimestral. Incluir métricas del Q1 y proyecciones para Q2.',
          fecha_vencimiento: new Date('2026-04-15'),
          estado: 'pendiente',
          id_usuario: coord1?.id_usuario || null,
        },
        {
          descripcion: 'Revisar y actualizar el manual de procedimientos del departamento. Sección 3: gestión de actas.',
          fecha_vencimiento: new Date('2026-04-10'),
          estado: 'en_progreso',
          id_usuario: coord2?.id_usuario || null,
        },
        {
          descripcion: 'Enviar convocatoria a todos los participantes para la reunión extraordinaria del mes de abril.',
          fecha_vencimiento: new Date('2026-04-05'),
          estado: 'completada',
          id_usuario: miembro1?.id_usuario || null,
        },
        {
          descripcion: 'Consolidar el informe de asistencia de las últimas 5 reuniones y enviarlo a administración.',
          fecha_vencimiento: new Date('2026-04-20'),
          estado: 'pendiente',
          id_usuario: miembro2?.id_usuario || null,
        },
        {
          descripcion: 'Diseñar plantilla estándar para las actas de reunión según los nuevos lineamientos institucionales.',
          fecha_vencimiento: new Date('2026-03-30'),
          estado: 'en_progreso',
          id_usuario: coord1?.id_usuario || null,
        },
        {
          descripcion: 'Actualizar base de datos de participantes con la información del nuevo semestre.',
          fecha_vencimiento: new Date('2026-04-25'),
          estado: 'pendiente',
          id_usuario: admin?.id_usuario || null,
        },
        {
          descripcion: 'Coordinar con TI la instalación del nuevo sistema de videoconferencia en sala principal.',
          fecha_vencimiento: new Date('2026-04-08'),
          estado: 'completada',
          id_usuario: coord2?.id_usuario || null,
        },
        {
          descripcion: 'Elaborar orden del día para la asamblea general del próximo mes.',
          fecha_vencimiento: new Date('2026-04-30'),
          estado: 'pendiente',
          id_usuario: miembro1?.id_usuario || null,
        },
      ];

      for (const t of tareas) {
        await Tarea.create(t);
        console.log(`   ✔  Tarea: "${t.descripcion.substring(0, 50)}..." (${t.estado})`);
      }
    }

    // ── 3. REUNIONES ──────────────────────────────────────
    console.log('\n📦 Insertando reuniones...');

    const reunionesExistentes = await Reunion.count();
    let reunionesCreadas = [];

    if (reunionesExistentes > 0) {
      console.log(`   ⏭  Ya existen ${reunionesExistentes} reuniones, se omite la inserción`);
      reunionesCreadas = await Reunion.findAll({ limit: 3 });
    } else {
      const reuniones = [
        {
          nombre_reunion: 'Planificación Trimestral Q2 2026',
          fecha: '2026-04-10',
          ubicacion: 'Sala de Juntas A - Piso 3',
          id_usuario: admin?.id_usuario || null,
        },
        {
          nombre_reunion: 'Revisión de Procedimientos Internos',
          fecha: '2026-04-18',
          ubicacion: 'Auditorio Central',
          id_usuario: coord1?.id_usuario || null,
        },
        {
          nombre_reunion: 'Reunión Extraordinaria de Coordinadores',
          fecha: '2026-04-25',
          ubicacion: 'Sala Virtual - Zoom',
          id_usuario: coord2?.id_usuario || null,
        },
        {
          nombre_reunion: 'Asamblea General de Participantes',
          fecha: '2026-05-05',
          ubicacion: 'Auditorio Principal',
          id_usuario: admin?.id_usuario || null,
        },
        {
          nombre_reunion: 'Seguimiento de Tareas Pendientes',
          fecha: '2026-04-03',
          ubicacion: 'Sala de Reuniones B',
          id_usuario: coord1?.id_usuario || null,
        },
      ];

      for (const r of reuniones) {
        const nueva = await Reunion.create(r);
        reunionesCreadas.push(nueva);
        console.log(`   ✔  Reunión: "${r.nombre_reunion}" (${r.fecha})`);
      }
    }

    // ── 4. AGENDA ─────────────────────────────────────────
    console.log('\n📦 Insertando agenda para la primera reunión...');

    if (reunionesCreadas.length > 0) {
      const primeraReunion = reunionesCreadas[0];
      const agendaExistente = await Agenda.count({ where: { id_reunion: primeraReunion.id_reunion } });

      if (agendaExistente > 0) {
        console.log(`   ⏭  Ya existe agenda para la reunión ID ${primeraReunion.id_reunion}`);
      } else {
        const items = [
          { titulo: 'Apertura y bienvenida',              descripcion: 'Palabras de apertura por parte del coordinador principal.',       responsable: 'Carlos Ruiz',   tiempo: 10, estado: 'pendiente' },
          { titulo: 'Revisión del acta anterior',          descripcion: 'Lectura y aprobación del acta de la reunión anterior.',           responsable: 'Laura Coord',   tiempo: 15, estado: 'pendiente' },
          { titulo: 'Informe de avance de tareas',         descripcion: 'Cada responsable presenta el estado de sus tareas asignadas.',    responsable: 'Todos',         tiempo: 30, estado: 'pendiente' },
          { titulo: 'Planificación Q2 — objetivos',        descripcion: 'Definición de metas y KPIs para el segundo trimestre.',           responsable: 'Alcides Admin', tiempo: 45, estado: 'pendiente' },
          { titulo: 'Asignación de nuevas responsabilidades', descripcion: 'Distribución de tareas para el período siguiente.',           responsable: 'Carlos Ruiz',   tiempo: 20, estado: 'pendiente' },
          { titulo: 'Varios y cierre',                     descripcion: 'Temas varios propuestos por los asistentes y cierre de sesión.',   responsable: 'Todos',         tiempo: 10, estado: 'pendiente' },
        ];

        for (const item of items) {
          await Agenda.create({ ...item, id_reunion: primeraReunion.id_reunion });
          console.log(`   ✔  Agenda item: "${item.titulo}" (${item.tiempo} min)`);
        }
      }
    }

    // ── Resumen final ──────────────────────────────────────
    console.log('\n' + '═'.repeat(55));
    console.log('🎉  Semilla completada exitosamente');
    console.log('═'.repeat(55));

    const totalUsuarios  = await Usuario.count();
    const totalTareas    = await Tarea.count();
    const totalReuniones = await Reunion.count();
    const totalAgenda    = await Agenda.count();

    console.log(`\n   👥 Usuarios:  ${totalUsuarios}`);
    console.log(`   ✅ Tareas:    ${totalTareas}`);
    console.log(`   📅 Reuniones: ${totalReuniones}`);
    console.log(`   📋 Agenda:    ${totalAgenda} items`);

    console.log('\n📋 Credenciales de acceso:');
    console.log('   admin@syscurringe.com        →  Admin123!      (administrador)');
    console.log('   carlos.ruiz@syscurringe.com  →  Carlos123!     (coordinador/moderador)');
    console.log('   coordinador@syscurringe.com  →  Coord123!      (coordinador/moderador)');
    console.log('   asistente@syscurringe.com    →  Asist123!      (coordinador/asistente)');
    console.log('   ana.lopez@syscurringe.com    →  Ana123!        (participante/miembro)');
    console.log('   miembro@syscurringe.com      →  Miembro123!    (participante/miembro)');
    console.log('   invitado@syscurringe.com     →  Invitado123!   (participante/invitado)');
    console.log('');

  } catch (error) {
    console.error('❌ Error durante la semilla:', error.message);
    if (error.original) console.error('   DB error:', error.original.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seed();