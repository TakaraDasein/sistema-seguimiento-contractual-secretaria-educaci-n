"use client"

import { useState, useEffect, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"
import type { PlanAccionItem } from "@/types/plan-accion"

// Función para asegurar que las fechas sean válidas y estén en formato ISO
function ensureValidDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString()

  try {
    // Verificar si ya está en formato ISO
    if (dateStr.includes("T")) {
      return dateStr
    }

    // Asumiendo formato dd/mm/yyyy
    const parts = dateStr.split("/")
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number)
      const date = new Date(year, month - 1, day)

      // Verificar si la fecha es válida
      if (!isNaN(date.getTime())) {
        return date.toISOString()
      }
    }

    // Si no se pudo parsear, devolver la fecha actual
    console.warn(`No se pudo parsear la fecha: ${dateStr}, usando fecha actual como respaldo`)
    return new Date().toISOString() // Valor por defecto en caso de error
  } catch (error) {
    console.error("Error parsing date:", dateStr, error)
    return new Date().toISOString() // Valor por defecto en caso de error
  }
}

// Función auxiliar para formatear fechas desde ISO a formato local
function formatDate(dateString: string | null): string {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch (error) {
    console.error("Error formateando fecha:", dateString, error)
    return dateString || ""
  }
}

export function usePlanAccionService(areaSlug: string) {
  const [items, setItems] = useState<PlanAccionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [areaId, setAreaId] = useState<string | null>(null)
  const [areaName, setAreaName] = useState<string>("")
  const supabase = createClientComponentClient()

  // Obtener el ID del área desde Supabase
  useEffect(() => {
    async function fetchAreaId() {
      try {
        setIsLoading(true)

        // Si el areaSlug ya es un UUID, asumimos que es el ID directamente
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(areaSlug)) {
          console.log(`El área parece ser un UUID válido: ${areaSlug}`)

          // Verificar que el ID existe en la tabla areas
          const { data, error } = await supabase.from("areas").select("id, nombre, codigo").eq("id", areaSlug).single()

          if (error) {
            console.error("Error verificando ID de área:", error)
            throw new Error(`No se pudo verificar el ID del área: ${error.message}`)
          }

          if (data) {
            console.log(`ID de área confirmado: ${data.id}, Nombre: ${data.nombre}`)
            setAreaId(data.id)
            setAreaName(data.nombre || "Área")
            return
          }
        }

        // Mapeo de slugs a nombres de área
        const AREA_SLUGS: Record<string, string> = {
          "calidad-educativa": "Calidad Educativa",
          "inspeccion-vigilancia": "Inspección y Vigilancia",
          "cobertura-infraestructura": "Cobertura e Infraestructura",
          "talento-humano": "Talento Humano",
        }

        // Obtener el nombre del área a partir del slug
        const areaName = AREA_SLUGS[areaSlug] || areaSlug

        console.log(`Buscando ID para el área: ${areaName} (slug: ${areaSlug})`)

        // Buscar el ID del área en la tabla areas
        const { data, error } = await supabase
          .from("areas")
          .select("id, nombre")
          .ilike("nombre", `%${areaName}%`)
          .limit(1)

        if (error) {
          console.error("Error al buscar el ID del área:", error)
          throw error
        }

        if (data && data.length > 0) {
          console.log(`ID del área encontrado: ${data[0].id}, Nombre: ${data[0].nombre}`)
          setAreaId(data[0].id)
          setAreaName(data[0].nombre || areaName)
        } else {
          // Si no encontramos por nombre, intentamos buscar por slug/código
          const { data: dataBySlug, error: errorBySlug } = await supabase
            .from("areas")
            .select("id, nombre, codigo")
            .ilike("codigo", `%${areaSlug}%`)
            .limit(1)

          if (errorBySlug) {
            console.error("Error al buscar el ID del área por slug:", errorBySlug)
            throw errorBySlug
          }

          if (dataBySlug && dataBySlug.length > 0) {
            console.log(`ID del área encontrado por slug: ${dataBySlug[0].id}, Nombre: ${dataBySlug[0].nombre}`)
            setAreaId(dataBySlug[0].id)
            setAreaName(dataBySlug[0].nombre || areaName)
          } else {
            console.error(`No se encontró ID para el área: ${areaName} (slug: ${areaSlug})`)
            throw new Error(`No se encontró el área: ${areaName}`)
          }
        }
      } catch (err: any) {
        console.error("Error al obtener el ID del área:", err)
        setError(err instanceof Error ? err : new Error(err.message || "Error desconocido"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchAreaId()
  }, [areaSlug, supabase])

  // Cargar planes de acción
  const loadPlanesAccion = useCallback(async () => {
    if (!areaId) {
      console.log("No se puede cargar planes de acción sin ID de área")
      return []
    }

    try {
      setIsLoading(true)
      console.log(`Cargando planes de acción para área ID: ${areaId}`)

      const { data, error } = await supabase
        .from("plan_accion")
        .select(`
          id, 
          programa,
          objetivo,
          meta,
          presupuesto,
          acciones,
          indicadores,
          porcentaje_avance,
          fecha_inicio,
          fecha_fin,
          responsable,
          estado,
          prioridad,
          comentarios
        `)
        .eq("area_id", areaId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error cargando planes de acción:", error)
        throw new Error(`Error cargando planes de acción: ${error.message}`)
      }

      console.log(`Planes de acción cargados: ${data?.length || 0}`)

      // Transformar datos al formato esperado por la aplicación
      const formattedItems: PlanAccionItem[] = (data || []).map((item) => ({
        id: item.id,
        programa: item.programa || "",
        objetivo: item.objetivo || "",
        meta: item.meta || "",
        presupuesto: item.presupuesto || "",
        acciones: item.acciones || "",
        indicadores: item.indicadores || "",
        porcentajeAvance: item.porcentaje_avance || 0,
        fechaInicio: formatDate(item.fecha_inicio) || "",
        fechaFin: formatDate(item.fecha_fin) || "",
        responsable: item.responsable || "",
        estado: item.estado || "Pendiente",
        prioridad: item.prioridad || "Media",
        comentarios: item.comentarios || "",
      }))

      setItems(formattedItems)
      return formattedItems
    } catch (err: any) {
      console.error("Error en loadPlanesAccion:", err)
      setError(err instanceof Error ? err : new Error(err.message || "Error desconocido"))
      toast({
        title: "Error al cargar planes de acción",
        description: err.message || "Ocurrió un error al cargar los datos",
        variant: "destructive",
      })
      return []
    } finally {
      setIsLoading(false)
    }
  }, [areaId, supabase])

  // Cargar datos cuando cambia el areaId
  useEffect(() => {
    if (areaId) {
      loadPlanesAccion()
    }
  }, [areaId, loadPlanesAccion])

  // Añadir un nuevo plan de acción
  const addPlanAccion = useCallback(
    async (newItem: PlanAccionItem) => {
      if (!areaId) {
        throw new Error("No se puede añadir un plan de acción sin ID de área")
      }

      try {
        setIsLoading(true)
        console.log("Añadiendo nuevo plan de acción:", newItem)

        // Validar campos requeridos
        const requiredFields = [
          { field: "programa", label: "Programa" },
          { field: "objetivo", label: "Objetivo" },
          { field: "meta", label: "Meta" },
          { field: "presupuesto", label: "Presupuesto" },
          { field: "acciones", label: "Acciones" },
          { field: "indicadores", label: "Indicadores" },
          { field: "responsable", label: "Responsable" },
        ]

        for (const { field, label } of requiredFields) {
          if (!newItem[field as keyof typeof newItem]) {
            throw new Error(`El campo ${label} es requerido`)
          }
        }

        // Asegurar fechas válidas
        const fechaInicio = ensureValidDate(newItem.fechaInicio)
        const fechaFin = ensureValidDate(newItem.fechaFin)

        // Obtener usuario actual
        const { data: userData } = await supabase.auth.getUser()

        // Preparar datos para inserción
        const insertData = {
          area_id: areaId,
          programa: newItem.programa,
          objetivo: newItem.objetivo,
          meta: newItem.meta,
          presupuesto: newItem.presupuesto,
          acciones: newItem.acciones,
          indicadores: newItem.indicadores,
          porcentaje_avance: newItem.porcentajeAvance || 0,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          responsable: newItem.responsable,
          estado: newItem.estado || "Pendiente",
          prioridad: newItem.prioridad || "Media",
          comentarios: newItem.comentarios || "",
          usuario_id: userData.user?.id,
        }

        // Insertar en Supabase
        const { data, error } = await supabase.from("plan_accion").insert(insertData).select().single()

        if (error) {
          console.error("Error al añadir plan de acción:", error)
          throw new Error(`Error al añadir plan de acción: ${error.message}`)
        }

        console.log("Plan de acción añadido con éxito:", data)

        // Actualizar estado local
        await loadPlanesAccion()

        toast({
          title: "Plan de acción añadido",
          description: "El plan de acción se ha añadido correctamente",
        })

        return data
      } catch (err: any) {
        console.error("Error en addPlanAccion:", err)
        setError(err instanceof Error ? err : new Error(err.message || "Error desconocido"))
        toast({
          title: "Error al añadir plan de acción",
          description: err.message || "Ocurrió un error al añadir el plan de acción",
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [areaId, loadPlanesAccion, supabase],
  )

  // Actualizar un plan de acción existente
  const updatePlanAccion = useCallback(
    async (id: string, updatedItem: Partial<PlanAccionItem>) => {
      try {
        setIsLoading(true)
        console.log("Actualizando plan de acción:", id, updatedItem)

        // Preparar datos para actualización
        const updateData: any = {}

        // Mapear campos de camelCase a snake_case
        if (updatedItem.programa !== undefined) updateData.programa = updatedItem.programa
        if (updatedItem.objetivo !== undefined) updateData.objetivo = updatedItem.objetivo
        if (updatedItem.meta !== undefined) updateData.meta = updatedItem.meta
        if (updatedItem.presupuesto !== undefined) updateData.presupuesto = updatedItem.presupuesto
        if (updatedItem.acciones !== undefined) updateData.acciones = updatedItem.acciones
        if (updatedItem.indicadores !== undefined) updateData.indicadores = updatedItem.indicadores
        if (updatedItem.porcentajeAvance !== undefined) updateData.porcentaje_avance = updatedItem.porcentajeAvance
        if (updatedItem.fechaInicio !== undefined) updateData.fecha_inicio = ensureValidDate(updatedItem.fechaInicio)
        if (updatedItem.fechaFin !== undefined) updateData.fecha_fin = ensureValidDate(updatedItem.fechaFin)
        if (updatedItem.responsable !== undefined) updateData.responsable = updatedItem.responsable
        if (updatedItem.estado !== undefined) updateData.estado = updatedItem.estado
        if (updatedItem.prioridad !== undefined) updateData.prioridad = updatedItem.prioridad
        if (updatedItem.comentarios !== undefined) updateData.comentarios = updatedItem.comentarios

        // Actualizar en Supabase
        const { data, error } = await supabase.from("plan_accion").update(updateData).eq("id", id).select().single()

        if (error) {
          console.error("Error al actualizar plan de acción:", error)
          throw new Error(`Error al actualizar plan de acción: ${error.message}`)
        }

        console.log("Plan de acción actualizado con éxito:", data)

        // Actualizar estado local
        await loadPlanesAccion()

        toast({
          title: "Plan de acción actualizado",
          description: "El plan de acción se ha actualizado correctamente",
        })

        return data
      } catch (err: any) {
        console.error("Error en updatePlanAccion:", err)
        setError(err instanceof Error ? err : new Error(err.message || "Error desconocido"))
        toast({
          title: "Error al actualizar plan de acción",
          description: err.message || "Ocurrió un error al actualizar el plan de acción",
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [loadPlanesAccion, supabase],
  )

  // Eliminar un plan de acción
  const deletePlanAccion = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true)
        console.log("Eliminando plan de acción:", id)

        // Eliminar de Supabase
        const { error } = await supabase.from("plan_accion").delete().eq("id", id)

        if (error) {
          console.error("Error al eliminar plan de acción:", error)
          throw new Error(`Error al eliminar plan de acción: ${error.message}`)
        }

        console.log("Plan de acción eliminado con éxito")

        // Actualizar estado local
        await loadPlanesAccion()

        toast({
          title: "Plan de acción eliminado",
          description: "El plan de acción se ha eliminado correctamente",
        })

        return true
      } catch (err: any) {
        console.error("Error en deletePlanAccion:", err)
        setError(err instanceof Error ? err : new Error(err.message || "Error desconocido"))
        toast({
          title: "Error al eliminar plan de acción",
          description: err.message || "Ocurrió un error al eliminar el plan de acción",
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [loadPlanesAccion, supabase],
  )

  return {
    items,
    isLoading,
    error,
    areaId,
    areaName,
    loadPlanesAccion,
    addPlanAccion,
    updatePlanAccion,
    deletePlanAccion,
  }
}
