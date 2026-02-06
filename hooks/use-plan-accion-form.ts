"use client"

// hooks/use-plan-accion-form.ts
import { useReducer, useCallback } from "react"
import { format } from "date-fns"
import {
  PlanAccionEstado,
  type PlanAccionFormAction,
  type PlanAccionFormErrors,
  type PlanAccionFormState,
  type PlanAccionItem,
} from "@/types/plan-accion"

// Expresión regular para validar formato de presupuesto
const PRESUPUESTO_REGEX = /^\$?[\d,.]+$/

// Estado inicial del formulario
const initialState: PlanAccionFormState = {
  item: {
    id: "",
    programa: "",
    objetivo: "",
    meta: "",
    presupuesto: "",
    acciones: "",
    indicadores: "",
    porcentajeAvance: 0,
    fechaInicio: "",
    fechaFin: "",
    estado: PlanAccionEstado.PENDIENTE,
    responsable: "",
  },
  errors: {},
  fechaInicioDate: null,
  fechaFinDate: null,
}

// Reducer para manejar el estado del formulario
function formReducer(state: PlanAccionFormState, action: PlanAccionFormAction): PlanAccionFormState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        item: {
          ...state.item,
          [action.field]: action.value,
        },
      }
    case "SET_DATE":
      if (action.field === "fechaInicio") {
        return {
          ...state,
          fechaInicioDate: action.date,
          item: {
            ...state.item,
            fechaInicio: action.date ? format(action.date, "dd/MM/yyyy") : "",
          },
        }
      } else if (action.field === "fechaFin") {
        return {
          ...state,
          fechaFinDate: action.date,
          item: {
            ...state.item,
            fechaFin: action.date ? format(action.date, "dd/MM/yyyy") : "",
          },
        }
      }
      return state
    case "RESET":
      return initialState
    case "SET_ERRORS":
      return {
        ...state,
        errors: action.payload,
      }
    case "CLEAR_ERROR":
      const { [action.field]: _, ...restErrors } = state.errors
      return {
        ...state,
        errors: restErrors,
      }
    default:
      return state
  }
}

/**
 * Hook personalizado para manejar el formulario de Plan de Acción
 * @param onSubmit Función a ejecutar cuando el formulario es válido y se envía
 */
export function usePlanAccionForm(onSubmit: (item: PlanAccionItem) => void) {
  const [state, dispatch] = useReducer(formReducer, initialState)

  // Función para actualizar un campo del formulario
  const updateField = useCallback(
    (field: keyof PlanAccionItem, value: any) => {
      dispatch({ type: "SET_FIELD", field, value })

      // Limpiar error si el campo tiene valor
      if (state.errors[field] && value) {
        dispatch({ type: "CLEAR_ERROR", field })
      }
    },
    [state.errors],
  )

  // Función para establecer la fecha de inicio
  const setFechaInicioDate = useCallback(
    (date: Date | null) => {
      dispatch({ type: "SET_DATE", field: "fechaInicio", date })

      // Limpiar error si hay fecha
      if (date && state.errors.fechaInicio) {
        dispatch({ type: "CLEAR_ERROR", field: "fechaInicio" })
      }
    },
    [state.errors.fechaInicio],
  )

  // Función para establecer la fecha de fin
  const setFechaFinDate = useCallback(
    (date: Date | null) => {
      dispatch({ type: "SET_DATE", field: "fechaFin", date })

      // Limpiar error si hay fecha
      if (date && state.errors.fechaFin) {
        dispatch({ type: "CLEAR_ERROR", field: "fechaFin" })
      }
    },
    [state.errors.fechaFin],
  )

  // Función para validar el formulario
  const validateForm = useCallback((): boolean => {
    const errors: PlanAccionFormErrors = {}
    const { item } = state

    // Validar campos obligatorios
    if (!item.programa || item.programa.trim() === "") {
      errors.programa = "El programa es obligatorio"
    }

    if (!item.objetivo || item.objetivo.trim() === "") {
      errors.objetivo = "El objetivo es obligatorio"
    }

    if (!item.meta || item.meta.trim() === "") {
      errors.meta = "La meta es obligatoria"
    }

    // Validar presupuesto (debe tener formato de moneda)
    if (!item.presupuesto || item.presupuesto.trim() === "") {
      errors.presupuesto = "El presupuesto es obligatorio"
    } else if (!PRESUPUESTO_REGEX.test(item.presupuesto)) {
      errors.presupuesto = "Formato inválido. Ejemplo: $100,000,000"
    }

    // Validar acciones
    if (!item.acciones || item.acciones.trim() === "") {
      errors.acciones = "Las acciones son obligatorias"
    }

    // Validar indicadores
    if (!item.indicadores || item.indicadores.trim() === "") {
      errors.indicadores = "Los indicadores son obligatorios"
    }

    // Validar responsable
    if (!item.responsable || item.responsable.trim() === "") {
      errors.responsable = "El responsable es obligatorio"
    }

    // Validar porcentaje de avance
    if (item.porcentajeAvance === undefined || item.porcentajeAvance < 0 || item.porcentajeAvance > 100) {
      errors.porcentajeAvance = "El porcentaje debe estar entre 0 y 100"
    }

    // Validar fechas
    if (!item.fechaInicio) {
      errors.fechaInicio = "La fecha de inicio es obligatoria"
    }

    if (!item.fechaFin) {
      errors.fechaFin = "La fecha de fin es obligatoria"
    }

    // Validar que la fecha fin sea posterior a la fecha inicio
    if (item.fechaInicio && item.fechaFin && state.fechaInicioDate && state.fechaFinDate) {
      if (state.fechaFinDate < state.fechaInicioDate) {
        errors.fechaFin = "La fecha de fin debe ser posterior a la fecha de inicio"
      }
    }

    dispatch({ type: "SET_ERRORS", payload: errors })
    return Object.keys(errors).length === 0
  }, [state])

  // Función para manejar el envío del formulario
  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      onSubmit(state.item)
      dispatch({ type: "RESET" })
    }
  }, [validateForm, state.item, onSubmit])

  // Función para resetear el formulario
  const resetForm = useCallback(() => {
    dispatch({ type: "RESET" })
  }, [])

  return {
    item: state.item,
    errors: state.errors,
    fechaInicioDate: state.fechaInicioDate,
    fechaFinDate: state.fechaFinDate,
    updateField,
    setFechaInicioDate,
    setFechaFinDate,
    validateForm,
    handleSubmit,
    resetForm,
  }
}
