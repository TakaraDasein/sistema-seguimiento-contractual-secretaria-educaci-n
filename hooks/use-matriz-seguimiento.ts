"use client"

import { useState, useEffect, useCallback } from "react"
import { supabaseClient } from "@/lib/supabase-client"
import type { Database } from "@/types/supabase-types"
import type { MatrizSeguimientoItem } from "@/types/plan-accion"

// Mapa de colores predeterminados para áreas
const defaultAreaColors: Record<string, string> = {
  CALIDAD_EDUCATIVA: "orange",
  INSPECCION_VIGILANCIA: "blue",
  COBERTURA_INFRAESTRUCTURA: "green",
  TALENTO_HUMANO: "purple",
  PLANEACION: "yellow",
  DESPACHO: "red",
}

export function useMatrizSeguimiento() {
  const [data, setData] = useState<MatrizSeguimientoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<any>(null)

  // Cargar datos de todas las áreas
  const loadData = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)

    try {
      console.log("Cargando datos para matriz de seguimiento...")

      // Obtener todas las áreas de la base de datos
      const { data: areasData, error: areasError } = await supabaseClient.from("areas").select("id, codigo, nombre")

      if (areasError) {
        console.error("Error cargando áreas:", areasError)
        throw areasError
      }

      // Mapear áreas de la base de datos
      const areasMap = new Map()
      areasData?.forEach((area) => {
        // Usar colores predeterminados o un color por defecto
        const areaCode = area.codigo || ""
        areasMap.set(area.id, {
          id: area.id,
          name: area.nombre,
          code: area.codigo,
          color: defaultAreaColors[areaCode] || "gray",
        })
      })

      // Obtener todos los datos de matriz de seguimiento
      const { data: matrizData, error: matrizError } = await supabaseClient
        .from("matriz_seguimiento")
        .select("*")
        .order("created_at", { ascending: false })

      if (matrizError) {
        console.error("Error cargando datos de matriz de seguimiento:", matrizError)
        throw matrizError
      }

      console.log(`Encontrados ${matrizData?.length || 0} registros de matriz de seguimiento`)

      // Transformar los datos para la matriz
      const combinedData: MatrizSeguimientoItem[] = []

      matrizData?.forEach((item) => {
        const areaId = item.area_id
        const areaInfo = areasMap.get(areaId) || {
          id: areaId,
          name: "Área Desconocida",
          code: "UNKNOWN",
          color: "gray",
        }

        combinedData.push({
          id: item.id,
          area: areaInfo.name,
          areaId: areaInfo.id,
          color: areaInfo.color,
          programa: item.actividad || "",
          objetivo: item.meta || "",
          meta: item.meta || "",
          presupuesto: item.presupuesto || "0",
          acciones: item.observaciones || "",
          indicadores: "",
          avance: item.avance || 0,
          fechaInicio: formatDate(item.fecha_inicio),
          fechaFin: formatDate(item.fecha_fin),
          responsable: item.responsable || "",
          estado: item.estado || "Pendiente",
          prioridad: "Media",
          descripcion: item.observaciones || "",
        })
      })

      setData(combinedData)
      console.log("Datos de matriz de seguimiento cargados correctamente:", combinedData)
    } catch (error: any) {
      console.error("Error loading matriz de seguimiento data:", error)
      setIsError(true)
      setError(error)
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()

    // Suscribirse a cambios en la tabla matriz_seguimiento
    const subscription = supabaseClient
      .channel("matriz_seguimiento_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "matriz_seguimiento" }, () => {
        loadData()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [loadData])

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: loadData,
  }
}

// Función auxiliar para formatear fechas
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
    return dateString || ""
  }
}
