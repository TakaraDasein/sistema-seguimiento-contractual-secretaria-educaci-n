"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { v4 as uuidv4 } from "uuid"
import { toast } from "@/components/ui/use-toast"
import type { PlanAccionItem } from "@/types/plan-accion"
import { supabaseClient } from "@/lib/supabase-client"

export type AreaId = "calidad-educativa" | "inspeccion-vigilancia" | "cobertura-infraestructura" | "talento-humano"

export function usePlanAccionStore(areaSlug: AreaId) {
  const [items, setItems] = useState<PlanAccionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [areaId, setAreaId] = useState<string | null>(null)
  const supabase = supabaseClient

  // Obtener el ID del área desde Supabase
  useEffect(() => {
    async function fetchAreaId() {
      try {
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
        const { data, error } = await supabase.from("areas").select("id").ilike("nombre", `%${areaName}%`).limit(1)

        if (error) {
          console.error("Error al buscar el ID del área:", error)
          throw error
        }

        if (data && data.length > 0) {
          console.log(`ID del área encontrado: ${data[0].id}`)
          setAreaId(data[0].id)
        } else {
          // Si no encontramos por nombre, intentamos buscar por slug
          const { data: dataBySlug, error: errorBySlug } = await supabase
            .from("areas")
            .select("id")
            .ilike("codigo", `%${areaSlug}%`)
            .limit(1)

          if (errorBySlug) {
            console.error("Error al buscar el ID del área por slug:", errorBySlug)
            throw errorBySlug
          }

          if (dataBySlug && dataBySlug.length > 0) {
            console.log(`ID del área encontrado por slug: ${dataBySlug[0].id}`)
            setAreaId(dataBySlug[0].id)
          } else {
            console.error(`No se encontró ID para el área: ${areaName} (slug: ${areaSlug})`)
            setError(`No se encontró el área: ${areaName}`)
          }
        }
      } catch (err: any) {
        console.error("Error al obtener el ID del área:", err)
        setError(`Error al obtener el ID del área: ${err.message}`)
      }
    }

    fetchAreaId()
  }, [areaSlug, supabase])

  // Cargar datos de Supabase al iniciar
  useEffect(() => {
    // Solo cargar datos si tenemos el ID del área
    if (!areaId) return

    async function loadItems() {
      setLoading(true)
      setError(null)

      try {
        console.log(`Cargando planes de acción para área ID: ${areaId}`)

        // Verificar la conexión a Supabase
        const { data: connectionTest, error: connectionError } = await supabase
          .from("plan_accion")
          .select("count()", { count: "exact", head: true })

        if (connectionError) {
          console.error("Error de conexión a Supabase:", connectionError)
          setError(`Error de conexión: ${connectionError.message}`)
          toast({
            title: "Error de conexión",
            description: "No se pudo conectar a la base de datos. Verifica tu conexión a internet.",
            variant: "destructive",
          })
          return
        }

        console.log("Conexión a Supabase exitosa:", connectionTest)

        // Verificar autenticación
        const { data: authData, error: authError } = await supabase.auth.getUser()
        if (authError) {
          console.error("Error de autenticación:", authError)
          setError(`Error de autenticación: ${authError.message}`)
          toast({
            title: "Error de autenticación",
            description: "No se pudo verificar tu identidad. Por favor, inicia sesión de nuevo.",
            variant: "destructive",
          })
          return
        }

        console.log("Usuario autenticado:", authData?.user?.id)

        // Intentamos cargar desde Supabase
        const { data: supabaseItems, error } = await supabase
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
          console.error("Error cargando items desde Supabase:", error)
          setError(`Error cargando datos: ${error.message}`)
          toast({
            title: "Error al cargar datos",
            description: `No se pudieron cargar los planes de acción: ${error.message}`,
            variant: "destructive",
          })
          setItems([])
        } else if (supabaseItems && supabaseItems.length > 0) {
          console.log(`Encontrados ${supabaseItems.length} planes de acción en Supabase:`, supabaseItems)

          // Transformamos los datos de Supabase al formato que espera nuestra aplicación
          const formattedItems: PlanAccionItem[] = supabaseItems.map((item) => ({
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
        } else {
          console.log("No se encontraron planes de acción en Supabase")
          setItems([])
        }
      } catch (error: any) {
        console.error("Error en loadItems:", error)
        setError(`Error inesperado: ${error.message || "Desconocido"}`)
        toast({
          title: "Error inesperado",
          description: "Ocurrió un error al cargar los datos. Por favor, intenta de nuevo.",
          variant: "destructive",
        })
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    loadItems()

    // Suscribirse a cambios en la tabla plan_accion
    const subscription = supabase
      .channel("plan_accion_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "plan_accion",
          filter: `area_id=eq.${areaId}`,
        },
        (payload) => {
          console.log("Cambio detectado en plan_accion:", payload)
          loadItems()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [areaId, supabase])

  // Añadir un nuevo item al plan de acción
  const addItem = async (newItem: Omit<PlanAccionItem, "id">) => {
    setSubmitting(true)
    setError(null)

    try {
      if (!areaId) {
        const errorMsg = "No se ha podido determinar el ID del área. Por favor, intente de nuevo."
        setError(errorMsg)
        toast({
          title: "Error al guardar",
          description: errorMsg,
          variant: "destructive",
        })
        throw new Error(errorMsg)
      }

      console.log("Iniciando addItem con datos:", newItem)
      const id = uuidv4()
      console.log("ID generado:", id)

      // Verificar si hay campos requeridos vacíos
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
          const errorMsg = `El campo ${label} es requerido`
          console.error(`Error: ${errorMsg}`)
          setError(errorMsg)
          toast({
            title: "Error al guardar",
            description: errorMsg,
            variant: "destructive",
          })
          throw new Error(errorMsg)
        }
      }

      // Obtener el usuario actual
      const { data: userData, error: userError } = await supabase.auth.getUser()
      console.log("Usuario actual:", userData?.user)
      if (userError) {
        console.error("Error obteniendo usuario:", userError)
        setError(`Error de autenticación: ${userError.message}`)
        toast({
          title: "Error de autenticación",
          description: "No se pudo verificar tu identidad. Por favor, inicia sesión de nuevo.",
          variant: "destructive",
        })
        throw userError
      }

      // Convertir fechas al formato ISO
      const fechaInicio = parseDate(newItem.fechaInicio)
      const fechaFin = parseDate(newItem.fechaFin)
      console.log("Fechas convertidas:", { fechaInicio, fechaFin })

      // Preparar datos para Supabase
      const insertData = {
        id,
        area_id: areaId, // Usar el ID del área obtenido de la base de datos
        programa: newItem.programa || "",
        objetivo: newItem.objetivo || "",
        meta: newItem.meta || "",
        presupuesto: newItem.presupuesto || "",
        acciones: newItem.acciones || "",
        indicadores: newItem.indicadores || "",
        porcentaje_avance: newItem.porcentajeAvance || 0,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        responsable: newItem.responsable || "",
        estado: newItem.estado || "Pendiente",
        prioridad: newItem.prioridad || "Media",
        comentarios: newItem.comentarios || "",
        usuario_id: userData.user?.id,
      }
      console.log("Datos a insertar en Supabase:", insertData)

      // Insertar en Supabase
      const { data, error } = await supabase.from("plan_accion").insert(insertData).select()
      console.log("Respuesta de Supabase:", { data, error })

      if (error) {
        console.error("Error añadiendo item en Supabase:", error)
        setError(`Error al guardar: ${error.message}`)
        toast({
          title: "Error al guardar el plan de acción",
          description: error.message,
          variant: "destructive",
        })
        throw error
      }

      toast({
        title: "Plan de acción guardado",
        description: "El plan de acción se ha guardado correctamente en la base de datos.",
      })

      // Actualizar estado local
      const itemWithId = { ...newItem, id }
      setItems((prevItems) => [itemWithId, ...prevItems])
      console.log("Estado local actualizado con nuevo item")

      return itemWithId
    } catch (error: any) {
      console.error("Error en addItem:", error)
      setError(`Error: ${error.message || "Desconocido"}`)
      throw error
    } finally {
      setSubmitting(false)
    }
  }

  // Actualizar un item existente
  const updateItem = async (id: string, updatedFields: Partial<PlanAccionItem>) => {
    setSubmitting(true)
    setError(null)

    try {
      console.log("Iniciando updateItem para ID:", id, "con datos:", updatedFields)

      // Actualizar estado local inmediatamente para UI responsiva
      setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, ...updatedFields } : item)))

      // Preparar datos para Supabase (convertir de camelCase a snake_case)
      const supabaseData: any = {}
      if (updatedFields.programa !== undefined) supabaseData.programa = updatedFields.programa
      if (updatedFields.objetivo !== undefined) supabaseData.objetivo = updatedFields.objetivo
      if (updatedFields.meta !== undefined) supabaseData.meta = updatedFields.meta
      if (updatedFields.presupuesto !== undefined) supabaseData.presupuesto = updatedFields.presupuesto
      if (updatedFields.acciones !== undefined) supabaseData.acciones = updatedFields.acciones
      if (updatedFields.indicadores !== undefined) supabaseData.indicadores = updatedFields.indicadores
      if (updatedFields.porcentajeAvance !== undefined) supabaseData.porcentaje_avance = updatedFields.porcentajeAvance
      if (updatedFields.fechaInicio !== undefined) supabaseData.fecha_inicio = parseDate(updatedFields.fechaInicio)
      if (updatedFields.fechaFin !== undefined) supabaseData.fecha_fin = parseDate(updatedFields.fechaFin)
      if (updatedFields.responsable !== undefined) supabaseData.responsable = updatedFields.responsable
      if (updatedFields.estado !== undefined) supabaseData.estado = updatedFields.estado
      if (updatedFields.prioridad !== undefined) supabaseData.prioridad = updatedFields.prioridad
      if (updatedFields.comentarios !== undefined) supabaseData.comentarios = updatedFields.comentarios

      console.log("Datos a actualizar en Supabase:", supabaseData)

      // Actualizar en Supabase
      const { data, error } = await supabase.from("plan_accion").update(supabaseData).eq("id", id).select()
      console.log("Respuesta de Supabase:", { data, error })

      if (error) {
        console.error("Error actualizando item en Supabase:", error)
        setError(`Error al actualizar: ${error.message}`)
        toast({
          title: "Error al actualizar el plan de acción",
          description: error.message,
          variant: "destructive",
        })
        throw error
      } else {
        toast({
          title: "Plan de acción actualizado",
          description: "El plan de acción se ha actualizado correctamente en la base de datos.",
        })
      }
    } catch (error: any) {
      console.error("Error en updateItem:", error)
      setError(`Error: ${error.message || "Desconocido"}`)
      throw error
    } finally {
      setSubmitting(false)
    }
  }

  // Eliminar un item
  const deleteItem = async (id: string) => {
    setSubmitting(true)
    setError(null)

    try {
      console.log("Iniciando deleteItem para ID:", id)

      // Actualizar estado local inmediatamente
      setItems((prevItems) => prevItems.filter((item) => item.id !== id))

      // Eliminar de Supabase
      const { data, error } = await supabase.from("plan_accion").delete().eq("id", id).select()
      console.log("Respuesta de eliminación de Supabase:", { data, error })

      if (error) {
        console.error("Error eliminando item en Supabase:", error)
        setError(`Error al eliminar: ${error.message}`)
        toast({
          title: "Error al eliminar el plan de acción",
          description: error.message,
          variant: "destructive",
        })
        throw error
      } else {
        toast({
          title: "Plan de acción eliminado",
          description: "El plan de acción se ha eliminado correctamente de la base de datos.",
        })
      }
    } catch (error: any) {
      console.error("Error en deleteItem:", error)
      setError(`Error: ${error.message || "Desconocido"}`)
      throw error
    } finally {
      setSubmitting(false)
    }
  }

  // Función para probar la conexión a Supabase
  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from("plan_accion").select("count()", { count: "exact", head: true })

      if (error) {
        console.error("Error de conexión a Supabase:", error)
        toast({
          title: "Error de conexión",
          description: `No se pudo conectar a Supabase: ${error.message}`,
          variant: "destructive",
        })
        return false
      }

      console.log("Conexión a Supabase exitosa:", data)
      toast({
        title: "Conexión exitosa",
        description: "La conexión a Supabase funciona correctamente.",
      })
      return true
    } catch (error: any) {
      console.error("Error probando conexión:", error)
      toast({
        title: "Error de conexión",
        description: `Error inesperado: ${error.message || "Desconocido"}`,
        variant: "destructive",
      })
      return false
    }
  }

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    testConnection,
    loading,
    submitting,
    error,
    areaId,
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
    return dateString
  }
}

// Modificar la función parseDate para asegurar que nunca devuelva null para fechas requeridas
function parseDate(dateString: string): string {
  if (!dateString) return new Date().toISOString() // Valor por defecto si no hay fecha

  try {
    // Verificar si ya está en formato ISO
    if (dateString.includes("T")) {
      return dateString
    }

    // Asumiendo formato dd/mm/yyyy
    const parts = dateString.split("/")
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number)
      const date = new Date(year, month - 1, day)

      // Verificar si la fecha es válida
      if (!isNaN(date.getTime())) {
        return date.toISOString()
      }
    }

    // Si no se pudo parsear, devolver la fecha actual
    console.warn(`No se pudo parsear la fecha: ${dateString}, usando fecha actual como respaldo`)
    return new Date().toISOString()
  } catch (error) {
    console.error("Error parsing date:", dateString, error)
    return new Date().toISOString() // Valor por defecto en caso de error
  }
}
