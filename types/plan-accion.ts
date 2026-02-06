// types/plan-accion.ts

// Enumeración para los posibles estados de un plan de acción
export enum PlanAccionEstado {
  PENDIENTE = "Pendiente",
  EN_PROGRESO = "En progreso",
  COMPLETADO = "Completado",
  RETRASADO = "Retrasado",
}

// Interfaz para los elementos del plan de acción
export interface PlanAccionItem {
  id: string
  programa: string
  objetivo: string
  meta: string
  presupuesto: string
  acciones: string // Nombre correcto según la tabla en Supabase
  indicadores: string // Nombre correcto según la tabla en Supabase
  porcentajeAvance: number
  fechaInicio: string
  fechaFin: string
  estado: PlanAccionEstado | string
  responsable: string
  prioridad?: string
  comentarios?: string
}

// Interfaz para los errores del formulario
export interface PlanAccionFormErrors {
  programa?: string
  objetivo?: string
  meta?: string
  presupuesto?: string
  acciones?: string
  indicadores?: string
  porcentajeAvance?: string
  fechaInicio?: string
  fechaFin?: string
  responsable?: string
}

// Interfaz para las estadísticas del plan de acción
export interface PlanAccionStats {
  presupuestoTotal: number
  avancePromedio: number
  estadosCount: Record<string, number>
  totalItems: number
}

// Interfaz para las acciones del reducer del formulario
export type PlanAccionFormAction =
  | { type: "SET_FIELD"; field: keyof PlanAccionItem; value: any }
  | { type: "RESET" }
  | { type: "SET_ERRORS"; payload: PlanAccionFormErrors }
  | { type: "CLEAR_ERROR"; field: keyof PlanAccionFormErrors }

// Estado del formulario
export interface PlanAccionFormState {
  item: PlanAccionItem
  errors: PlanAccionFormErrors
  fechaInicioDate: Date | null
  fechaFinDate: Date | null
}

export type MatrizSeguimientoItem = {
  id: string
  area: string
  areaId: string
  color: string
  programa: string
  objetivo: string
  meta: string
  presupuesto: string
  acciones: string
  indicadores: string
  avance: number
  fechaInicio: string
  fechaFin: string
  responsable: string
  estado: string
  prioridad: string
  descripcion?: string
}

export interface MatrizFilters {
  searchTerm?: string
  area?: string
  estado?: string
}

export interface MatrizStats {
  totalActividades: number
  avanceGlobal: number
  completadas: number
  porArea: Record<string, number>
}
