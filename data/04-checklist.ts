// ========================================
// 04. LISTAS DE CHEQUEO
// Sistema de evaluación por categorías
// 8 Categorías | 24 Ítems | 24 Respuestas
// ========================================

// ============ CATEGORÍAS (8) ============
export const CHECKLIST_CATEGORIAS = [
  {
    id: "cat-001",
    nombre: "Infraestructura y Dotación",
    descripcion: "Evaluación de espacios físicos y recursos materiales",
    area_id: "2d8bf8a1-0557-4974-8212-a2f4a93a4fb2",
    orden: 1,
    activa: true,
    created_at: "2025-11-01T10:00:00Z",
  },
  {
    id: "cat-002",
    nombre: "Gestión Académica",
    descripcion: "Procesos de enseñanza y evaluación",
    area_id: "e28654eb-216c-49cd-9a96-42366c097f12",
    orden: 2,
    activa: true,
    created_at: "2025-11-01T10:15:00Z",
  },
  {
    id: "cat-003",
    nombre: "Talento Humano",
    descripcion: "Gestión del personal educativo",
    area_id: "15bb34b0-25eb-407f-9ce7-f781fcd04ecc",
    orden: 3,
    activa: true,
    created_at: "2025-11-01T10:30:00Z",
  },
  {
    id: "cat-004",
    nombre: "Cumplimiento Normativo",
    descripcion: "Verificación de requisitos legales",
    area_id: "502d6c5d-0a1e-43fa-85b7-ae91f7743f0d",
    orden: 4,
    activa: true,
    created_at: "2025-11-01T10:45:00Z",
  },
  {
    id: "cat-005",
    nombre: "Procesos Administrativos",
    descripcion: "Gestión documental y administrativa",
    area_id: "d07c17e4-15f3-42c6-9f87-7cfca4d19ad9",
    orden: 5,
    activa: true,
    created_at: "2025-11-01T11:00:00Z",
  },
  {
    id: "cat-006",
    nombre: "Convivencia Escolar",
    descripcion: "Clima institucional y resolución de conflictos",
    area_id: "e28654eb-216c-49cd-9a96-42366c097f12",
    orden: 6,
    activa: true,
    created_at: "2025-11-01T11:15:00Z",
  },
  {
    id: "cat-007",
    nombre: "Seguridad y Protección",
    descripcion: "Condiciones de seguridad y protección estudiantil",
    area_id: "502d6c5d-0a1e-43fa-85b7-ae91f7743f0d",
    orden: 7,
    activa: true,
    created_at: "2025-11-01T11:30:00Z",
  },
  {
    id: "cat-008",
    nombre: "Inclusión y Diversidad",
    descripcion: "Atención a poblaciones especiales",
    area_id: "e28654eb-216c-49cd-9a96-42366c097f12",
    orden: 8,
    activa: true,
    created_at: "2025-11-01T11:45:00Z",
  },
]

// ============ ÍTEMS (24 - 3 por categoría) ============
export const CHECKLIST_ITEMS = [
  // INFRAESTRUCTURA Y DOTACIÓN (3)
  {
    id: "item-001",
    categoria_id: "cat-001",
    descripcion: "¿Las aulas cuentan con mobiliario adecuado y en buen estado?",
    obligatorio: true,
    requiere_evidencia: true,
    peso: 10,
    orden: 1,
    created_at: "2025-11-02T09:00:00Z",
  },
  {
    id: "item-002",
    categoria_id: "cat-001",
    descripcion: "¿Las instalaciones sanitarias funcionan correctamente?",
    obligatorio: true,
    requiere_evidencia: true,
    peso: 8,
    orden: 2,
    created_at: "2025-11-02T09:15:00Z",
  },
  {
    id: "item-003",
    categoria_id: "cat-001",
    descripcion: "¿Existe dotación tecnológica suficiente (computadores, tablets)?",
    obligatorio: false,
    requiere_evidencia: true,
    peso: 7,
    orden: 3,
    created_at: "2025-11-02T09:30:00Z",
  },

  // GESTIÓN ACADÉMICA (3)
  {
    id: "item-004",
    categoria_id: "cat-002",
    descripcion: "¿El PEI está actualizado según normatividad vigente?",
    obligatorio: true,
    requiere_evidencia: true,
    peso: 10,
    orden: 4,
    created_at: "2025-11-02T10:00:00Z",
  },
  {
    id: "item-005",
    categoria_id: "cat-002",
    descripcion: "¿Se implementan estrategias pedagógicas innovadoras?",
    obligatorio: false,
    requiere_evidencia: true,
    peso: 6,
    orden: 5,
    created_at: "2025-11-02T10:15:00Z",
  },
  {
    id: "item-006",
    categoria_id: "cat-002",
    descripcion: "¿Existen planes de mejoramiento académico documentados?",
    obligatorio: true,
    requiere_evidencia: true,
    peso: 9,
    orden: 6,
    created_at: "2025-11-02T10:30:00Z",
  },

  // TALENTO HUMANO (3)
  {
    id: "item-007",
    categoria_id: "cat-003",
    descripcion: "¿El personal docente cuenta con títulos profesionales acreditados?",
    obligatorio: true,
    requiere_evidencia: true,
    peso: 10,
    orden: 7,
    created_at: "2025-11-02T11:00:00Z",
  },
  {
    id: "item-008",
    categoria_id: "cat-003",
    descripcion: "¿Se ejecuta plan de formación continua para docentes?",
    obligatorio: false,
    requiere_evidencia: true,
    peso: 7,
    orden: 8,
    created_at: "2025-11-02T11:15:00Z",
  },
  {
    id: "item-009",
    categoria_id: "cat-003",
    descripcion: "¿Existe sistema de evaluación de desempeño docente?",
    obligatorio: true,
    requiere_evidencia: true,
    peso: 8,
    orden: 9,
    created_at: "2025-11-02T11:30:00Z",
  },

  // CUMPLIMIENTO NORMATIVO (3)
  {
    id: "item-010",
    categoria_id: "cat-004",
    descripcion: "¿La licencia de funcionamiento está vigente?",
    obligatorio: true,
    requiere_evidencia: true,
    peso: 10,
    orden: 10,
    created_at: "2025-11-02T14:00:00Z",
  },
  {
    id: "item-011",
    categoria_id: "cat-004",
    descripcion: "¿Se cumplen normas de seguridad industrial y salud ocupacional?",
    obligatorio: true,
    requiere_evidencia: true,
    peso: 9,
    orden: 11,
    created_at: "2025-11-02T14:15:00Z",
  },
  {
    id: "item-012",
    categoria_id: "cat-004",
    descripcion: "¿Los libros reglamentarios están al día?",
    obligatorio: true,
    requiere_evidencia: false,
    peso: 6,
    orden: 12,
    created_at: "2025-11-02T14:30:00Z",
  },

  // PROCESOS ADMINISTRATIVOS (3)
  {
    id: "item-013",
    categoria_id: "cat-005",
    descripcion: "¿Existe sistema organizado de archivo documental?",
    obligatorio: true,
    requiere_evidencia: true,
    peso: 8,
    orden: 13,
    created_at: "2025-11-02T15:00:00Z",
  },
  {
    id: "item-014",
    categoria_id: "cat-005",
    descripcion: "¿Los procesos de contratación siguen normativa vigente?",
    obligatorio: true,
    requiere_evidencia: true,
    peso: 10,
    orden: 14,
    created_at: "2025-11-02T15:15:00Z",
  },
  {
    id: "item-015",
    categoria_id: "cat-005",
    descripcion: "¿Se realizan auditorías internas periódicas?",
    obligatorio: false,
    requiere_evidencia: true,
    peso: 7,
    orden: 15,
    created_at: "2025-11-02T15:30:00Z",
  },

  // CONVIVENCIA ESCOLAR (3)
  {
    id: "item-016",
    categoria_id: "cat-006",
    descripcion: "¿Existe manual de convivencia socializado?",
    obligatorio: true,
    requiere_evidencia: true,
    peso: 9,
    orden: 16,
    created_at: "2025-11-02T16:00:00Z",
  },
  {
    id: "item-017",
    categoria_id: "cat-006",
    descripcion: "¿Funciona comité de convivencia escolar?",
    obligatorio: true,
    requiere_evidencia: false,
    peso: 8,
    orden: 17,
    created_at: "2025-11-02T16:15:00Z",
  },
  {
    id: "item-018",
    categoria_id: "cat-006",
    descripcion: "¿Se implementan estrategias de prevención del bullying?",
    obligatorio: false,
    requiere_evidencia: true,
    peso: 7,
    orden: 18,
    created_at: "2025-11-02T16:30:00Z",
  },

  // SEGURIDAD Y PROTECCIÓN (3)
  {
    id: "item-019",
    categoria_id: "cat-007",
    descripcion: "¿Existe plan de emergencias actualizado?",
    obligatorio: true,
    requiere_evidencia: true,
    peso: 10,
    orden: 19,
    created_at: "2025-11-03T09:00:00Z",
  },
  {
    id: "item-020",
    categoria_id: "cat-007",
    descripcion: "¿Las salidas de emergencia están señalizadas y despejadas?",
    obligatorio: true,
    requiere_evidencia: true,
    peso: 10,
    orden: 20,
    created_at: "2025-11-03T09:15:00Z",
  },
  {
    id: "item-021",
    categoria_id: "cat-007",
    descripcion: "¿Se realizan simulacros semestrales de evacuación?",
    obligatorio: true,
    requiere_evidencia: true,
    peso: 8,
    orden: 21,
    created_at: "2025-11-03T09:30:00Z",
  },

  // INCLUSIÓN Y DIVERSIDAD (3)
  {
    id: "item-022",
    categoria_id: "cat-008",
    descripcion: "¿Existen adaptaciones para estudiantes con discapacidad?",
    obligatorio: false,
    requiere_evidencia: true,
    peso: 8,
    orden: 22,
    created_at: "2025-11-03T10:00:00Z",
  },
  {
    id: "item-023",
    categoria_id: "cat-008",
    descripcion: "¿Se atienden necesidades de población étnica diferenciada?",
    obligatorio: false,
    requiere_evidencia: true,
    peso: 6,
    orden: 23,
    created_at: "2025-11-03T10:15:00Z",
  },
  {
    id: "item-024",
    categoria_id: "cat-008",
    descripcion: "¿Hay programas de educación flexible para estudiantes en situación de vulnerabilidad?",
    obligatorio: false,
    requiere_evidencia: true,
    peso: 7,
    orden: 24,
    created_at: "2025-11-03T10:30:00Z",
  },
]

// ============ RESPUESTAS (24 - 1 por ítem) ============
export const CHECKLIST_RESPUESTAS = [
  // Respuestas INFRAESTRUCTURA
  { id: "resp-001", item_id: "item-001", institucion: "I.E. San José", cumple: true, observaciones: "Mobiliario en buen estado, renovado en 2025", evidencia_url: "/evidencias/mobiliario-sj.jpg", fecha_verificacion: "2026-01-15", verificador: "Ing. Luis Castro", created_at: "2026-01-15T14:00:00Z" },
  { id: "resp-002", item_id: "item-002", institucion: "I.E. San José", cumple: true, observaciones: "Sanitarios funcionales, mantenimiento al día", evidencia_url: "/evidencias/sanitarios-sj.jpg", fecha_verificacion: "2026-01-15", verificador: "Ing. Luis Castro", created_at: "2026-01-15T14:15:00Z" },
  { id: "resp-003", item_id: "item-003", institucion: "I.E. San José", cumple: false, observaciones: "Requiere ampliación de sala de sistemas", evidencia_url: null, fecha_verificacion: "2026-01-15", verificador: "Ing. Luis Castro", created_at: "2026-01-15T14:30:00Z" },

  // Respuestas GESTIÓN ACADÉMICA
  { id: "resp-004", item_id: "item-004", institucion: "I.E. María Auxiliadora", cumple: true, observaciones: "PEI actualizado 2026, aprobado por consejo directivo", evidencia_url: "/evidencias/pei-ma.pdf", fecha_verificacion: "2026-01-18", verificador: "María González", created_at: "2026-01-18T10:00:00Z" },
  { id: "resp-005", item_id: "item-005", institucion: "I.E. María Auxiliadora", cumple: true, observaciones: "Implementan aprendizaje basado en proyectos", evidencia_url: "/evidencias/abp-ma.jpg", fecha_verificacion: "2026-01-18", verificador: "María González", created_at: "2026-01-18T10:20:00Z" },
  { id: "resp-006", item_id: "item-006", institucion: "I.E. María Auxiliadora", cumple: true, observaciones: "Plan de mejoramiento aprobado y en ejecución", evidencia_url: "/evidencias/plan-ma.pdf", fecha_verificacion: "2026-01-18", verificador: "María González", created_at: "2026-01-18T10:40:00Z" },

  // Respuestas TALENTO HUMANO
  { id: "resp-007", item_id: "item-007", institucion: "I.E. La Esperanza", cumple: true, observaciones: "100% docentes con títulos profesionales verificados", evidencia_url: "/evidencias/titulos-le.pdf", fecha_verificacion: "2026-01-20", verificador: "Diana López", created_at: "2026-01-20T09:00:00Z" },
  { id: "resp-008", item_id: "item-008", institucion: "I.E. La Esperanza", cumple: true, observaciones: "Plan de formación ejecutado 85%", evidencia_url: "/evidencias/formacion-le.xlsx", fecha_verificacion: "2026-01-20", verificador: "Diana López", created_at: "2026-01-20T09:20:00Z" },
  { id: "resp-009", item_id: "item-009", institucion: "I.E. La Esperanza", cumple: true, observaciones: "Evaluación de desempeño implementada conforme Decreto 1278", evidencia_url: "/evidencias/eval-le.pdf", fecha_verificacion: "2026-01-20", verificador: "Diana López", created_at: "2026-01-20T09:40:00Z" },

  // Respuestas CUMPLIMIENTO NORMATIVO  
  { id: "resp-010", item_id: "item-010", institucion: "I.E. El Progreso", cumple: true, observaciones: "Licencia vigente hasta diciembre 2028", evidencia_url: "/evidencias/licencia-ep.pdf", fecha_verificacion: "2026-01-22", verificador: "Ana Ruiz", created_at: "2026-01-22T11:00:00Z" },
  { id: "resp-011", item_id: "item-011", institucion: "I.E. El Progreso", cumple: true, observaciones: "Cumple normas SST, COPASST activo", evidencia_url: "/evidencias/sst-ep.pdf", fecha_verificacion: "2026-01-22", verificador: "Ana Ruiz", created_at: "2026-01-22T11:20:00Z" },
  { id: "resp-012", item_id: "item-012", institucion: "I.E. El Progreso", cumple: true, observaciones: "Libros reglamentarios al día", evidencia_url: null, fecha_verificacion: "2026-01-22", verificador: "Ana Ruiz", created_at: "2026-01-22T11:40:00Z" },

  // Respuestas PROCESOS ADMINISTRATIVOS
  { id: "resp-013", item_id: "item-013", institucion: "I.E. Nueva Granada", cumple: false, observaciones: "Sistema de archivo requiere mejoras, documentos dispersos", evidencia_url: "/evidencias/archivo-ng.jpg", fecha_verificacion: "2026-01-24", verificador: "Carlos Mendoza", created_at: "2026-01-24T14:00:00Z" },
  { id: "resp-014", item_id: "item-014", institucion: "I.E. Nueva Granada", cumple: true, observaciones: "Contrataciones conforme Ley 80 y estatuto de contratación", evidencia_url: "/evidencias/contratos-ng.pdf", fecha_verificacion: "2026-01-24", verificador: "Carlos Mendoza", created_at: "2026-01-24T14:20:00Z" },
  { id: "resp-015", item_id: "item-015", institucion: "I.E. Nueva Granada", cumple: false, observaciones: "No se realizan auditorías internas programadas", evidencia_url: null, fecha_verificacion: "2026-01-24", verificador: "Carlos Mendoza", created_at: "2026-01-24T14:40:00Z" },

  // Respuestas CONVIVENCIA ESCOLAR
  { id: "resp-016", item_id: "item-016", institucion: "I.E. Simón Bolívar", cumple: true, observaciones: "Manual de convivencia actualizado y socializado", evidencia_url: "/evidencias/manual-sb.pdf", fecha_verificacion: "2026-01-25", verificador: "Sandra Ortiz", created_at: "2026-01-25T10:00:00Z" },
  { id: "resp-017", item_id: "item-017", institucion: "I.E. Simón Bolívar", cumple: true, observaciones: "Comité se reúne mensualmente, actas al día", evidencia_url: null, fecha_verificacion: "2026-01-25", verificador: "Sandra Ortiz", created_at: "2026-01-25T10:20:00Z" },
  { id: "resp-018", item_id: "item-018", institucion: "I.E. Simón Bolívar", cumple: true, observaciones: "Programa Aulas en Paz implementado", evidencia_url: "/evidencias/bullying-sb.jpg", fecha_verificacion: "2026-01-25", verificador: "Sandra Ortiz", created_at: "2026-01-25T10:40:00Z" },

  // Respuestas SEGURIDAD
  { id: "resp-019", item_id: "item-019", institucion: "I.E. Santa Teresita", cumple: true, observaciones: "Plan de emergencias actualizado 2026", evidencia_url: "/evidencias/emergencias-st.pdf", fecha_verificacion: "2026-01-27", verificador: "Jorge Suárez", created_at: "2026-01-27T09:00:00Z" },
  { id: "resp-020", item_id: "item-020", institucion: "I.E. Santa Teresita", cumple: true, observaciones: "Señalización completa y salidas despejadas", evidencia_url: "/evidencias/salidas-st.jpg", fecha_verificacion: "2026-01-27", verificador: "Jorge Suárez", created_at: "2026-01-27T09:20:00Z" },
  { id: "resp-021", item_id: "item-021", institucion: "I.E. Santa Teresita", cumple: true, observaciones: "Último simulacro realizado enero 2026", evidencia_url: "/evidencias/simulacro-st.pdf", fecha_verificacion: "2026-01-27", verificador: "Jorge Suárez", created_at: "2026-01-27T09:40:00Z" },

  // Respuestas INCLUSIÓN
  { id: "resp-022", item_id: "item-022", institucion: "I.E. Integración", cumple: true, observaciones: "Rampas de acceso, baños adaptados, señalización Braille", evidencia_url: "/evidencias/adaptaciones-int.jpg", fecha_verificacion: "2026-01-29", verificador: "Roberto Gómez", created_at: "2026-01-29T11:00:00Z" },
  { id: "resp-023", item_id: "item-023", institucion: "I.E. Integración", cumple: true, observaciones: "Etnoeducación implementada para población indígena", evidencia_url: "/evidencias/etno-int.pdf", fecha_verificacion: "2026-01-29", verificador: "Roberto Gómez", created_at: "2026-01-29T11:20:00Z" },
  { id: "resp-024", item_id: "item-024", institucion: "I.E. Integración", cumple: true, observaciones: "Programa de aceleración del aprendizaje activo", evidencia_url: "/evidencias/flexible-int.pdf", fecha_verificacion: "2026-01-29", verificador: "Roberto Gómez", created_at: "2026-01-29T11:40:00Z" },
]
