require('dotenv').config();
const bcrypt = require('bcryptjs');
const { DataTypes } = require('sequelize');
const sequelize = require('./config/database');

// ── Modelos ────────────────────────────────────────────────
const Usuario = sequelize.define('Usuario', {
  id_usuario:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:             { type: DataTypes.STRING,  allowNull: false },
  apellido:           { type: DataTypes.STRING,  allowNull: false },
  correo_electronico: { type: DataTypes.STRING,  allowNull: false, unique: true },
  contrasena:         { type: DataTypes.STRING,  allowNull: false },
  rol:                { type: DataTypes.STRING,  allowNull: false },
  tipo_usuario:       { type: DataTypes.STRING,  allowNull: true },
  estado:             { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'usuario', timestamps: false });

const Tarea = sequelize.define('Tarea', {
  id_tarea:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descripcion:       { type: DataTypes.TEXT,    allowNull: false },
  fecha_creacion:    { type: DataTypes.DATE,    defaultValue: DataTypes.NOW },
  fecha_vencimiento: { type: DataTypes.DATE },
  estado:            { type: DataTypes.ENUM('pendiente', 'en_progreso', 'completada'), defaultValue: 'pendiente' },
  id_usuario:        { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'tarea', timestamps: false });

const Reunion = sequelize.define('Reunion', {
  id_reunion:     { type: DataTypes.INTEGER,     primaryKey: true, autoIncrement: true },
  nombre_reunion: { type: DataTypes.STRING(100), allowNull: false },
  fecha:          { type: DataTypes.DATEONLY,    allowNull: false },
  ubicacion:      { type: DataTypes.STRING(100), allowNull: true },
  id_usuario:     { type: DataTypes.INTEGER,     allowNull: true },
}, { tableName: 'reunion', timestamps: false });

const Agenda = sequelize.define('Agenda', {
  id_agenda:   { type: DataTypes.INTEGER,     primaryKey: true, autoIncrement: true },
  id_reunion:  { type: DataTypes.INTEGER,     allowNull: false },
  titulo:      { type: DataTypes.STRING(200), allowNull: false },
  descripcion: { type: DataTypes.TEXT,        allowNull: true },
  responsable: { type: DataTypes.STRING(100), allowNull: true },
  tiempo:      { type: DataTypes.INTEGER,     allowNull: true },
  estado:      { type: DataTypes.STRING(50),  allowNull: false, defaultValue: 'pendiente' },
}, { tableName: 'agenda', timestamps: true });

// ── Datos ──────────────────────────────────────────────────
const usuariosData = [
  { nombre: 'Alcides',    apellido: 'Administrador', correo_electronico: 'admin@syscurringe.com',        contrasena: 'Admin123!',    rol: 'administrador',       tipo_usuario: null,        estado: true  },
  { nombre: 'Carlos',     apellido: 'Ruiz',          correo_electronico: 'carlos.ruiz@syscurringe.com',  contrasena: 'Carlos123!',   rol: 'coordinador',         tipo_usuario: 'moderador', estado: true  },
  { nombre: 'Laura',      apellido: 'Coordinadora',  correo_electronico: 'coordinador@syscurringe.com',  contrasena: 'Coord123!',    rol: 'coordinador',         tipo_usuario: 'moderador', estado: true  },
  { nombre: 'Sofía',      apellido: 'Asistente',     correo_electronico: 'asistente@syscurringe.com',    contrasena: 'Asist123!',    rol: 'coordinador',         tipo_usuario: 'asistente', estado: true  },
  { nombre: 'Ana',        apellido: 'López',         correo_electronico: 'ana.lopez@syscurringe.com',    contrasena: 'Ana123!',      rol: 'participante',        tipo_usuario: 'miembro',   estado: true  },
  { nombre: 'Juan',       apellido: 'Miembro',       correo_electronico: 'miembro@syscurringe.com',      contrasena: 'Miembro123!',  rol: 'participante',        tipo_usuario: 'miembro',   estado: true  },
  { nombre: 'Pedro',      apellido: 'Invitado',      correo_electronico: 'invitado@syscurringe.com',     contrasena: 'Invitado123!', rol: 'participante',        tipo_usuario: 'invitado',  estado: false },
  { nombre: 'Valentina',  apellido: 'Torres',        correo_electronico: 'v.torres@syscurringe.com',     contrasena: 'Val123!',      rol: 'participante',        tipo_usuario: 'miembro',   estado: true  },
  { nombre: 'Miguel',     apellido: 'Herrera',       correo_electronico: 'm.herrera@syscurringe.com',    contrasena: 'Miguel123!',   rol: 'coordinador',         tipo_usuario: 'asistente', estado: true  },
  { nombre: 'Isabella',   apellido: 'Moreno',        correo_electronico: 'i.moreno@syscurringe.com',     contrasena: 'Isa123!',      rol: 'participante',        tipo_usuario: 'miembro',   estado: true  },
  { nombre: 'Sebastián',  apellido: 'Castro',        correo_electronico: 's.castro@syscurringe.com',     contrasena: 'Seba123!',     rol: 'participante',        tipo_usuario: 'miembro',   estado: true  },
  { nombre: 'Camila',     apellido: 'Jiménez',       correo_electronico: 'c.jimenez@syscurringe.com',    contrasena: 'Cami123!',     rol: 'coordinador',         tipo_usuario: 'moderador', estado: true  },
  { nombre: 'Andrés',     apellido: 'Vargas',        correo_electronico: 'a.vargas@syscurringe.com',     contrasena: 'Andres123!',   rol: 'participante',        tipo_usuario: 'invitado',  estado: true  },
  { nombre: 'Daniela',    apellido: 'Ríos',          correo_electronico: 'd.rios@syscurringe.com',       contrasena: 'Dani123!',     rol: 'participante',        tipo_usuario: 'miembro',   estado: true  },
  { nombre: 'Felipe',     apellido: 'Mendoza',       correo_electronico: 'f.mendoza@syscurringe.com',    contrasena: 'Felipe123!',   rol: 'jefe de departamento',tipo_usuario: null,        estado: true  },
];

const reunionesData = [
  { nombre_reunion: 'Planificación Trimestral Q2 2026',          fecha: '2026-04-10', ubicacion: 'Sala de Juntas A – Piso 3'   },
  { nombre_reunion: 'Revisión de Procedimientos Internos',        fecha: '2026-04-18', ubicacion: 'Auditorio Central'           },
  { nombre_reunion: 'Reunión Extraordinaria de Coordinadores',    fecha: '2026-04-25', ubicacion: 'Sala Virtual – Zoom'         },
  { nombre_reunion: 'Asamblea General de Participantes',          fecha: '2026-05-05', ubicacion: 'Auditorio Principal'         },
  { nombre_reunion: 'Seguimiento de Tareas Pendientes',           fecha: '2026-04-03', ubicacion: 'Sala de Reuniones B'         },
  { nombre_reunion: 'Comité de Evaluación Semestral',             fecha: '2026-05-15', ubicacion: 'Sala Ejecutiva – Piso 5'     },
  { nombre_reunion: 'Capacitación: Nuevas Herramientas TI',       fecha: '2026-04-22', ubicacion: 'Laboratorio de Cómputo 2'    },
  { nombre_reunion: 'Mesa de Trabajo: Rediseño de Procesos',      fecha: '2026-04-30', ubicacion: 'Sala de Reuniones C'         },
  { nombre_reunion: 'Revisión de Indicadores de Gestión',         fecha: '2026-05-08', ubicacion: 'Sala Virtual – Teams'        },
  { nombre_reunion: 'Kick-off Proyecto Digitalización',           fecha: '2026-05-12', ubicacion: 'Sala Principal – Piso 1'     },
  { nombre_reunion: 'Reunión de Cierre Q1 2026',                  fecha: '2026-03-28', ubicacion: 'Auditorio Central'           },
  { nombre_reunion: 'Taller de Innovación y Mejora Continua',     fecha: '2026-05-20', ubicacion: 'Sala de Creatividad'         },
];

// Agendas por reunión (índice 0-based = primera reunión, etc.)
const agendasPorReunion = [
  // Reunión 0: Planificación Q2
  [
    { titulo: 'Apertura y bienvenida',                 descripcion: 'Palabras de apertura por el coordinador principal.',              responsable: 'Carlos Ruiz',    tiempo: 10, estado: 'completada' },
    { titulo: 'Revisión del acta anterior',             descripcion: 'Lectura y aprobación del acta de la sesión previa.',             responsable: 'Laura Coord',    tiempo: 15, estado: 'pendiente'  },
    { titulo: 'Informe de avance de tareas Q1',         descripcion: 'Cada responsable presenta el estado de sus tareas.',             responsable: 'Todos',          tiempo: 40, estado: 'pendiente'  },
    { titulo: 'Definición de objetivos Q2',             descripcion: 'Establecimiento de metas y KPIs para el segundo trimestre.',     responsable: 'Alcides Admin',  tiempo: 50, estado: 'pendiente'  },
    { titulo: 'Asignación de responsabilidades',        descripcion: 'Distribución de tareas y responsables para el período.',         responsable: 'Carlos Ruiz',    tiempo: 25, estado: 'pendiente'  },
    { titulo: 'Varios y cierre',                        descripcion: 'Temas propuestos por asistentes y cierre de sesión.',            responsable: 'Todos',          tiempo: 10, estado: 'pendiente'  },
  ],
  // Reunión 1: Procedimientos
  [
    { titulo: 'Presentación del nuevo manual',          descripcion: 'Introducción al manual actualizado de procedimientos.',          responsable: 'Sofía Asistente',tiempo: 20, estado: 'pendiente'  },
    { titulo: 'Sección 1: Gestión documental',          descripcion: 'Revisión de los cambios en gestión documental.',                 responsable: 'Miguel Herrera', tiempo: 30, estado: 'pendiente'  },
    { titulo: 'Sección 2: Comunicaciones internas',     descripcion: 'Nuevos canales y protocolos de comunicación.',                   responsable: 'Camila Jiménez', tiempo: 30, estado: 'pendiente'  },
    { titulo: 'Sección 3: Gestión de actas',            descripcion: 'Formato estándar y proceso de aprobación de actas.',             responsable: 'Laura Coord',    tiempo: 25, estado: 'pendiente'  },
    { titulo: 'Ronda de preguntas y ajustes',           descripcion: 'Espacio para retroalimentación y ajustes al manual.',            responsable: 'Todos',          tiempo: 20, estado: 'pendiente'  },
  ],
  // Reunión 2: Extraordinaria coordinadores
  [
    { titulo: 'Situación actual del proyecto',          descripcion: 'Diagnóstico del estado de avance por área.',                     responsable: 'Carlos Ruiz',    tiempo: 30, estado: 'pendiente'  },
    { titulo: 'Identificación de bloqueos',             descripcion: 'Listado de obstáculos y propuestas de solución.',                responsable: 'Todos',          tiempo: 35, estado: 'pendiente'  },
    { titulo: 'Plan de acción inmediato',               descripcion: 'Definición de acciones correctivas y plazos.',                   responsable: 'Alcides Admin',  tiempo: 40, estado: 'pendiente'  },
    { titulo: 'Compromisos y cierre',                   descripcion: 'Registro de compromisos individuales y fecha de seguimiento.',   responsable: 'Sofía Asistente',tiempo: 15, estado: 'pendiente'  },
  ],
  // Reunión 3: Asamblea general
  [
    { titulo: 'Informe de gestión anual',               descripcion: 'Presentación de resultados del año por la administración.',      responsable: 'Alcides Admin',  tiempo: 45, estado: 'pendiente'  },
    { titulo: 'Propuestas de mejora',                   descripcion: 'Participantes presentan sus propuestas de mejora institucional.',responsable: 'Todos',          tiempo: 60, estado: 'pendiente'  },
    { titulo: 'Elección de representantes',             descripcion: 'Proceso de votación para elegir representantes por área.',       responsable: 'Carlos Ruiz',    tiempo: 30, estado: 'pendiente'  },
    { titulo: 'Resoluciones y acuerdos',                descripcion: 'Formalización de los acuerdos alcanzados en la asamblea.',       responsable: 'Laura Coord',    tiempo: 20, estado: 'pendiente'  },
    { titulo: 'Cierre y refrigerio',                    descripcion: 'Palabras de cierre y espacio de networking.',                    responsable: 'Alcides Admin',  tiempo: 15, estado: 'pendiente'  },
  ],
  // Reunión 4: Seguimiento tareas
  [
    { titulo: 'Revisión de tareas vencidas',            descripcion: 'Análisis de tareas que superaron su fecha de vencimiento.',      responsable: 'Camila Jiménez', tiempo: 25, estado: 'completada' },
    { titulo: 'Actualización de estados',               descripcion: 'Cada responsable actualiza el estado de sus tareas activas.',    responsable: 'Todos',          tiempo: 30, estado: 'en_progreso'},
    { titulo: 'Reasignación de tareas',                 descripcion: 'Redistribución de tareas sin responsable o bloqueadas.',         responsable: 'Carlos Ruiz',    tiempo: 20, estado: 'pendiente'  },
    { titulo: 'Cierre y próxima fecha',                 descripcion: 'Definición de la próxima reunión de seguimiento.',               responsable: 'Laura Coord',    tiempo: 10, estado: 'pendiente'  },
  ],
  // Reunión 5: Comité evaluación
  [
    { titulo: 'Indicadores del semestre',               descripcion: 'Presentación de KPIs y métricas de rendimiento semestral.',      responsable: 'Felipe Mendoza', tiempo: 40, estado: 'pendiente'  },
    { titulo: 'Evaluación por departamentos',           descripcion: 'Revisión del desempeño de cada área funcional.',                 responsable: 'Todos',          tiempo: 50, estado: 'pendiente'  },
    { titulo: 'Plan de mejora',                         descripcion: 'Propuestas de mejora basadas en la evaluación.',                 responsable: 'Camila Jiménez', tiempo: 35, estado: 'pendiente'  },
    { titulo: 'Aprobación del informe',                 descripcion: 'Revisión y aprobación del informe semestral.',                   responsable: 'Alcides Admin',  tiempo: 20, estado: 'pendiente'  },
  ],
  // Reunión 6: Capacitación TI
  [
    { titulo: 'Introducción a las nuevas herramientas', descripcion: 'Presentación del catálogo de herramientas nuevas.',              responsable: 'Miguel Herrera', tiempo: 20, estado: 'pendiente'  },
    { titulo: 'Demo: Sistema de gestión documental',    descripcion: 'Demostración en vivo del nuevo sistema DMS.',                    responsable: 'Miguel Herrera', tiempo: 35, estado: 'pendiente'  },
    { titulo: 'Demo: Plataforma de videoconferencia',   descripcion: 'Configuración y uso de la nueva plataforma.',                    responsable: 'Sofía Asistente',tiempo: 30, estado: 'pendiente'  },
    { titulo: 'Práctica guiada',                        descripcion: 'Los participantes practican con las herramientas.',              responsable: 'Miguel Herrera', tiempo: 40, estado: 'pendiente'  },
    { titulo: 'Resolución de dudas',                    descripcion: 'Espacio para preguntas técnicas y soporte.',                     responsable: 'Todos',          tiempo: 15, estado: 'pendiente'  },
  ],
  // Reunión 7: Mesa rediseño procesos
  [
    { titulo: 'Diagnóstico de procesos actuales',       descripcion: 'Mapeo de los procesos existentes y sus pain points.',            responsable: 'Felipe Mendoza', tiempo: 35, estado: 'pendiente'  },
    { titulo: 'Identificación de oportunidades',        descripcion: 'Dinámica grupal para identificar mejoras.',                      responsable: 'Todos',          tiempo: 45, estado: 'pendiente'  },
    { titulo: 'Propuesta de nuevos flujos',             descripcion: 'Diseño preliminar de procesos optimizados.',                     responsable: 'Camila Jiménez', tiempo: 40, estado: 'pendiente'  },
    { titulo: 'Validación y próximos pasos',            descripcion: 'Revisión de propuestas y plan de implementación.',               responsable: 'Carlos Ruiz',    tiempo: 20, estado: 'pendiente'  },
  ],
  // Reunión 8: Indicadores
  [
    { titulo: 'Presentación del dashboard de KPIs',     descripcion: 'Revisión del tablero de indicadores actualizado.',               responsable: 'Felipe Mendoza', tiempo: 25, estado: 'pendiente'  },
    { titulo: 'Análisis de desviaciones',               descripcion: 'Discusión sobre indicadores fuera del rango esperado.',          responsable: 'Todos',          tiempo: 35, estado: 'pendiente'  },
    { titulo: 'Medidas correctivas',                    descripcion: 'Definición de acciones para los indicadores críticos.',          responsable: 'Alcides Admin',  tiempo: 30, estado: 'pendiente'  },
  ],
  // Reunión 9: Kick-off digitalización
  [
    { titulo: 'Presentación del proyecto',              descripcion: 'Alcance, objetivos y beneficios esperados del proyecto.',        responsable: 'Felipe Mendoza', tiempo: 30, estado: 'pendiente'  },
    { titulo: 'Roles y responsabilidades',              descripcion: 'Asignación del equipo de proyecto y sus funciones.',             responsable: 'Carlos Ruiz',    tiempo: 25, estado: 'pendiente'  },
    { titulo: 'Cronograma del proyecto',                descripcion: 'Revisión de hitos, entregables y fechas clave.',                 responsable: 'Miguel Herrera', tiempo: 30, estado: 'pendiente'  },
    { titulo: 'Riesgos identificados',                  descripcion: 'Análisis de riesgos y plan de mitigación.',                      responsable: 'Camila Jiménez', tiempo: 20, estado: 'pendiente'  },
    { titulo: 'Acuerdos y cierre del kick-off',         descripcion: 'Formalización de acuerdos y arranque oficial del proyecto.',     responsable: 'Alcides Admin',  tiempo: 15, estado: 'pendiente'  },
  ],
  // Reunión 10: Cierre Q1
  [
    { titulo: 'Balance de resultados Q1',               descripcion: 'Presentación de logros y métricas del primer trimestre.',        responsable: 'Alcides Admin',  tiempo: 40, estado: 'completada' },
    { titulo: 'Lecciones aprendidas',                   descripcion: 'Reflexión sobre aciertos y áreas de mejora del trimestre.',      responsable: 'Todos',          tiempo: 30, estado: 'completada' },
    { titulo: 'Reconocimientos',                        descripcion: 'Reconocimiento a miembros destacados del trimestre.',            responsable: 'Carlos Ruiz',    tiempo: 15, estado: 'completada' },
    { titulo: 'Transición hacia Q2',                    descripcion: 'Breve introducción a las prioridades del próximo trimestre.',    responsable: 'Laura Coord',    tiempo: 20, estado: 'completada' },
  ],
  // Reunión 11: Taller innovación
  [
    { titulo: 'Marco de innovación institucional',      descripcion: 'Conceptos clave y metodología Design Thinking.',                responsable: 'Felipe Mendoza', tiempo: 30, estado: 'pendiente'  },
    { titulo: 'Ejercicio: Ideación',                    descripcion: 'Dinámica grupal de generación de ideas.',                       responsable: 'Todos',          tiempo: 45, estado: 'pendiente'  },
    { titulo: 'Prototipado rápido',                     descripcion: 'Equipos desarrollan prototipos de sus mejores ideas.',          responsable: 'Todos',          tiempo: 50, estado: 'pendiente'  },
    { titulo: 'Presentación de prototipos',             descripcion: 'Cada equipo presenta su propuesta al grupo.',                   responsable: 'Todos',          tiempo: 40, estado: 'pendiente'  },
    { titulo: 'Selección y próximos pasos',             descripcion: 'Votación de ideas a implementar y plan de seguimiento.',        responsable: 'Camila Jiménez', tiempo: 15, estado: 'pendiente'  },
  ],
];

// ── Función principal ──────────────────────────────────────
async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa\n');

    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas\n');

    // ── 1. USUARIOS ──────────────────────────────────────
    console.log('👥 Insertando usuarios...');
    const usuariosCreados = [];

    for (const u of usuariosData) {
      const existe = await Usuario.findOne({ where: { correo_electronico: u.correo_electronico } });
      if (existe) {
        console.log(`   ⏭  Ya existe: ${u.correo_electronico}`);
        usuariosCreados.push(existe);
        continue;
      }
      const hash  = await bcrypt.hash(u.contrasena, 10);
      const nuevo = await Usuario.create({ ...u, contrasena: hash });
      usuariosCreados.push(nuevo);
      console.log(`   ✔  Creado: ${u.correo_electronico} (${u.rol})`);
    }

    // Referencias por rol
    const admin    = usuariosCreados.find(u => u.rol === 'administrador');
    const coords   = usuariosCreados.filter(u => u.rol === 'coordinador');
    const miembros = usuariosCreados.filter(u => u.tipo_usuario === 'miembro');
    const jefe     = usuariosCreados.find(u => u.rol === 'jefe de departamento');
    const todos    = usuariosCreados;

    // ── 2. TAREAS ─────────────────────────────────────────
    console.log('\n📋 Insertando tareas...');
    
    const responsables = [...coords, ...miembros, admin, jefe].filter(Boolean);
    const tareas = [
      { descripcion: 'Preparar presentación para la reunión de planificación trimestral. Incluir métricas del Q1 y proyecciones para Q2.',                       fecha_vencimiento: '2026-04-15', estado: 'pendiente',    id_usuario: responsables[0]?.id_usuario },
      { descripcion: 'Revisar y actualizar el manual de procedimientos del departamento. Sección 3: gestión de actas.',                                           fecha_vencimiento: '2026-04-10', estado: 'en_progreso',  id_usuario: responsables[1]?.id_usuario },
      { descripcion: 'Enviar convocatoria a todos los participantes para la reunión extraordinaria de abril.',                                                     fecha_vencimiento: '2026-04-05', estado: 'completada',   id_usuario: responsables[2]?.id_usuario },
      { descripcion: 'Consolidar el informe de asistencia de las últimas 5 reuniones y enviarlo a administración.',                                               fecha_vencimiento: '2026-04-20', estado: 'pendiente',    id_usuario: responsables[3]?.id_usuario },
      { descripcion: 'Diseñar plantilla estándar para actas de reunión según los nuevos lineamientos institucionales.',                                           fecha_vencimiento: '2026-03-30', estado: 'en_progreso',  id_usuario: responsables[4]?.id_usuario },
      { descripcion: 'Actualizar base de datos de participantes con la información del nuevo semestre académico.',                                                 fecha_vencimiento: '2026-04-25', estado: 'pendiente',    id_usuario: admin?.id_usuario },
      { descripcion: 'Coordinar con TI la instalación del nuevo sistema de videoconferencia en sala principal.',                                                  fecha_vencimiento: '2026-04-08', estado: 'completada',   id_usuario: responsables[1]?.id_usuario },
      { descripcion: 'Elaborar orden del día para la asamblea general del próximo mes.',                                                                          fecha_vencimiento: '2026-04-30', estado: 'pendiente',    id_usuario: responsables[0]?.id_usuario },
      { descripcion: 'Levantar acta de la reunión de coordinadores del 25 de marzo y distribuirla a los asistentes.',                                             fecha_vencimiento: '2026-04-02', estado: 'completada',   id_usuario: responsables[2]?.id_usuario },
      { descripcion: 'Revisar propuestas de mejora enviadas por los participantes y clasificarlas por prioridad.',                                                 fecha_vencimiento: '2026-04-12', estado: 'pendiente',    id_usuario: jefe?.id_usuario },
      { descripcion: 'Configurar el nuevo sistema de gestión documental y capacitar al equipo en su uso.',                                                        fecha_vencimiento: '2026-04-18', estado: 'en_progreso',  id_usuario: responsables[1]?.id_usuario },
      { descripcion: 'Elaborar informe de indicadores de gestión para el comité de evaluación semestral.',                                                        fecha_vencimiento: '2026-05-01', estado: 'pendiente',    id_usuario: jefe?.id_usuario },
      { descripcion: 'Coordinar la logística del taller de innovación: sala, materiales, refrigerios y confirmación de asistencia.',                             fecha_vencimiento: '2026-05-15', estado: 'pendiente',    id_usuario: responsables[3]?.id_usuario },
      { descripcion: 'Actualizar el directorio institucional con los datos de contacto del nuevo personal vinculado en el primer trimestre.',                      fecha_vencimiento: '2026-04-07', estado: 'completada',   id_usuario: responsables[2]?.id_usuario },
      { descripcion: 'Preparar el plan de trabajo para el proyecto de digitalización: cronograma, presupuesto y recursos.',                                       fecha_vencimiento: '2026-05-10', estado: 'pendiente',    id_usuario: jefe?.id_usuario },
      { descripcion: 'Realizar encuesta de satisfacción a los participantes sobre las reuniones del Q1 y tabular resultados.',                                     fecha_vencimiento: '2026-04-14', estado: 'en_progreso',  id_usuario: responsables[0]?.id_usuario },
      { descripcion: 'Revisar y aprobar los borradores de las actas de las últimas tres reuniones antes de su publicación oficial.',                               fecha_vencimiento: '2026-04-06', estado: 'completada',   id_usuario: admin?.id_usuario },
      { descripcion: 'Crear y publicar el calendario de reuniones para el segundo trimestre en el portal interno.',                                                fecha_vencimiento: '2026-04-03', estado: 'completada',   id_usuario: responsables[1]?.id_usuario },
      { descripcion: 'Documentar los procesos de onboarding para nuevos miembros que se incorporen durante el Q2.',                                               fecha_vencimiento: '2026-04-28', estado: 'pendiente',    id_usuario: responsables[3]?.id_usuario },
      { descripcion: 'Preparar resumen ejecutivo del Q1 para presentar a las directivas en la reunión de cierre trimestral.',                                     fecha_vencimiento: '2026-03-28', estado: 'completada',   id_usuario: admin?.id_usuario },
      { descripcion: 'Desarrollar protocolo de gestión de conflictos para uso en reuniones con múltiples partes involucradas.',                                   fecha_vencimiento: '2026-05-05', estado: 'pendiente',    id_usuario: responsables[0]?.id_usuario },
      { descripcion: 'Migrar los archivos históricos de actas al nuevo repositorio digital y verificar su integridad.',                                           fecha_vencimiento: '2026-04-22', estado: 'en_progreso',  id_usuario: responsables[1]?.id_usuario },
      { descripcion: 'Definir métricas de éxito para el proyecto de digitalización y establecer línea base de medición.',                                         fecha_vencimiento: '2026-05-08', estado: 'pendiente',    id_usuario: jefe?.id_usuario },
      { descripcion: 'Organizar sesión de retroalimentación con miembros sobre el funcionamiento de las reuniones virtuales.',                                     fecha_vencimiento: '2026-04-16', estado: 'pendiente',    id_usuario: responsables[2]?.id_usuario },
      { descripcion: 'Actualizar las políticas de uso de salas de reuniones y publicarlas en el portal institucional.',                                           fecha_vencimiento: '2026-04-11', estado: 'en_progreso',  id_usuario: admin?.id_usuario },
    ];

    for (const t of tareas) {
      const existe = await Tarea.findOne({ where: { descripcion: t.descripcion } });
      if (!existe) {
        await Tarea.create(t);
        console.log(`   ✔  Tarea: "${t.descripcion.substring(0, 55)}..." (${t.estado})`);
      } else {
        console.log(`   ⏭  Ya existe: "${t.descripcion.substring(0, 55)}..."`);
      }
    }

    // ── 3. REUNIONES ──────────────────────────────────────
    console.log('\n📅 Insertando reuniones...');
    let reunionesCreadas = [];
    
    const responsablesReunion = [admin, coords[0], coords[1], admin, coords[0], jefe, coords[1], coords[0], jefe, coords[1], admin, jefe];
    for (let i = 0; i < reunionesData.length; i++) {
      const r = reunionesData[i];
      const existe = await Reunion.findOne({ where: { nombre_reunion: r.nombre_reunion } });
      
      if (!existe) {
        const resp = responsablesReunion[i % responsablesReunion.length];
        const nueva = await Reunion.create({ ...r, id_usuario: resp?.id_usuario || null });
        reunionesCreadas.push(nueva);
        console.log(`   ✔  Reunión: "${r.nombre_reunion}" (${r.fecha})`);
      } else {
        reunionesCreadas.push(existe);
        console.log(`   ⏭  Ya existe: "${r.nombre_reunion}"`);
      }
    }

    // ── 4. AGENDAS ────────────────────────────────────────
    console.log('\n📋 Insertando agendas...');
    let totalAgendaCreada = 0;

    for (let i = 0; i < reunionesCreadas.length; i++) {
      const reunion = reunionesCreadas[i];
      const items   = agendasPorReunion[i];
      if (!items) continue;

      const agendaExistente = await Agenda.count({ where: { id_reunion: reunion.id_reunion } });
      if (agendaExistente > 0) {
        console.log(`   ⏭  Agenda ya existe para: "${reunion.nombre_reunion}"`);
        continue;
      }

      for (const item of items) {
        await Agenda.create({ ...item, id_reunion: reunion.id_reunion });
        totalAgendaCreada++;
      }
      console.log(`   ✔  ${items.length} items para: "${reunion.nombre_reunion}"`);
    }

    // ── Resumen ────────────────────────────────────────────
    const totU = await Usuario.count();
    const totT = await Tarea.count();
    const totR = await Reunion.count();
    const totA = await Agenda.count();

    console.log('\n' + '═'.repeat(60));
    console.log('🎉  Semilla completada exitosamente');
    console.log('═'.repeat(60));
    console.log(`\n   👥 Usuarios:  ${totU}`);
    console.log(`   📋 Tareas:    ${totT}`);
    console.log(`   📅 Reuniones: ${totR}`);
    console.log(`   🗒️  Agenda:    ${totA} items en ${reunionesCreadas.length} reuniones`);
    console.log('\n📋 Credenciales de acceso:');
    console.log('   admin@syscurringe.com          →  Admin123!      (administrador)');
    console.log('   carlos.ruiz@syscurringe.com    →  Carlos123!     (coordinador/moderador)');
    console.log('   coordinador@syscurringe.com    →  Coord123!      (coordinador/moderador)');
    console.log('   asistente@syscurringe.com      →  Asist123!      (coordinador/asistente)');
    console.log('   f.mendoza@syscurringe.com      →  Felipe123!     (jefe de departamento)');
    console.log('   ana.lopez@syscurringe.com      →  Ana123!        (participante/miembro)');
    console.log('   miembro@syscurringe.com        →  Miembro123!    (participante/miembro)');
    console.log('   invitado@syscurringe.com       →  Invitado123!   (participante/invitado)');
    console.log('');

  } catch (error) {
    console.error('❌ Error durante la semilla:', error.message);
    if (error.original) console.error('   DB error:', error.original.message);
    if (require.main === module) {
      await sequelize.close();
      process.exit(1);
    }
    throw error;
  } finally {
    if (require.main === module) {
      await sequelize.close();
    }
  }
}

// Ejecución directa: node seed.js
if (require.main === module) {
  seed();
}

// Importado desde index.js
module.exports = seed;