"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase-types"
import type { AreaId } from "./use-lista-chequeo-store"
import { USE_SUPABASE } from "@/lib/config"
import { createMockClient } from "@/lib/mock-supabase-client"
import { supabaseClient } from "@/lib/supabase-client"

// Tipos para la estructura de datos consolidada
export type EtapaConsolidada = {
  nombre: string
  documentos: DocumentoConsolidado[]
}

export type DocumentoConsolidado = {
  nombre: string
  descripcion: string
  respuestas: {
    si: number
    no: number
    noAplica: number
  }
  observaciones: string[]
  area: string
  areaId: AreaId
}

export type DatosConsolidados = {
  titulo: string
  etapas: EtapaConsolidada[]
  isLoading: boolean
}

// Hook para consolidar datos de listas de chequeo de todas las áreas
export function useListaChequeoReal() {
  const [datosConsolidados, setDatosConsolidados] = useState<DatosConsolidados>({
    titulo: "Lista de Chequeo Consolidada",
    etapas: [],
    isLoading: true,
  })
  const supabase = supabaseClient

  // Áreas disponibles
  const areas: AreaId[] = ["calidad-educativa", "inspeccion-vigilancia", "cobertura-infraestructura", "talento-humano"]

  // Nombres de las áreas para mostrar
  const areaNombres: Record<AreaId, string> = {
    "calidad-educativa": "Calidad Educativa",
    "inspeccion-vigilancia": "Inspección y Vigilancia",
    "cobertura-infraestructura": "Cobertura e Infraestructura",
    "talento-humano": "Talento Humano",
  }

  // Mapeo de códigos de área a sus nombres para la consulta
  const areaCodeToName: Record<string, string> = {
    "calidad-educativa": "CALIDAD_EDUCATIVA",
    "inspeccion-vigilancia": "INSPECCION_VIGILANCIA",
    "cobertura-infraestructura": "COBERTURA_INFRAESTRUCTURA",
    "talento-humano": "TALENTO_HUMANO",
    planeacion: "PLANEACION",
    despacho: "DESPACHO",
  }

  useEffect(() => {
    const cargarDatosConsolidados = async () => {
      try {
        console.log("Cargando datos de Supabase para la lista de chequeo real...")
        // Estructura para almacenar datos consolidados
        const etapasMap = new Map<string, EtapaConsolidada>()

        // 1. Obtener todas las categorías (etapas)
        const { data: categorias, error: categoriasError } = await supabase
          .from("lista_chequeo_categorias")
          .select("id, nombre, area_id")
          .order("orden", { ascending: true })

        if (categoriasError) {
          console.error("Error al cargar categorías:", categoriasError)
          throw categoriasError
        }

        console.log("Categorías cargadas:", categorias)

        // Inicializar el mapa de etapas
        // No lo inicializamos aquí para que cada área tenga sus propias etapas o solo las pertinentes

        // 2. Obtener todos los ítems de la lista de chequeo
        const { data: items, error: itemsError } = await supabase
          .from("lista_chequeo_items")
          .select("id, categoria_id, nombre_documento, descripcion")
          .order("orden", { ascending: true })

        if (itemsError) {
          console.error("Error al cargar ítems:", itemsError)
          throw itemsError
        }

        console.log("Ítems cargados:", items)

        // 3. Obtener todas las áreas para mapear correctamente
        const { data: allAreasData, error: allAreasError } = await supabase.from("areas").select("id, codigo")
        if (allAreasError) throw allAreasError

        const areaIdToUuid = new Map()
        areas.forEach((aId) => {
          const expectedCode = areaCodeToName[aId]
          const match = allAreasData?.find(
            (a) => a.codigo?.toUpperCase() === expectedCode?.toUpperCase() || a.id === aId,
          )
          if (match) areaIdToUuid.set(aId, match.id)
        })

        // 4. Para cada área, obtener las respuestas y consolidar los datos
        for (const areaId of areas) {
          try {
            const areaUuid = areaIdToUuid.get(areaId)
            if (!areaUuid) {
              console.warn(`No se encontró UUID para área: ${areaId}`)
              continue
            }

            console.log(`Procesando área ${areaId} (${areaUuid})`)

            // Obtener las respuestas para esta área
            const { data: respuestas, error: respuestasError } = await supabase
              .from("lista_chequeo_respuestas")
              .select("*")
              .eq("area_id", areaUuid)

            if (respuestasError) {
              console.error(`Error al cargar respuestas para ${areaId}:`, respuestasError)
              continue
            }

            // Mapear respuestas por item_id
            const respuestasMap = new Map()
            respuestas?.forEach((resp) => {
              respuestasMap.set(resp.item_id, resp)
            })

            // Procesar los ítems para esta área
            items?.forEach((item) => {
              const categoriaId = item.categoria_id
              const categoria = categorias?.find((cat) => cat.id === categoriaId)

              if (!categoria) return

              // Si la categoría tiene un area_id definido, solo agregarla si coincide con el área actual
              // Si no tiene area_id, se asume que es una categoría global/compartida
              if (categoria.area_id && categoria.area_id !== areaUuid) return

              const etapaNombre = categoria.nombre
              let etapa = etapasMap.get(etapaNombre)

              if (!etapa) {
                etapa = { nombre: etapaNombre, documentos: [] }
                etapasMap.set(etapaNombre, etapa)
              }

              const respuesta = respuestasMap.get(item.id)

              // Calcular porcentajes para las respuestas
              let si = 0,
                no = 0,
                noAplica = 0
              const observaciones: string[] = []

              if (respuesta) {
                if (respuesta.respuesta === "SI") si = 100
                else if (respuesta.respuesta === "NO") no = 100
                else if (respuesta.respuesta === "NO_APLICA") noAplica = 100

                if (respuesta.observaciones) {
                  observaciones.push(respuesta.observaciones)
                }
              }

              // Añadir el documento a la etapa
              etapa.documentos.push({
                nombre: item.nombre_documento || item.descripcion || "Documento sin nombre",
                descripcion: item.descripcion || "",
                respuestas: { si, no, noAplica },
                observaciones,
                area: areaNombres[areaId] || areaId,
                areaId,
              })
            })
          } catch (error) {
            console.error(`Error procesando área ${areaId}:`, error)
          }
        }

        // Convertir el mapa a un array para el estado
        const etapasConsolidadas = Array.from(etapasMap.values())
        console.log("Etapas consolidadas:", etapasConsolidadas)

        setDatosConsolidados({
          titulo: "Lista de Chequeo Consolidada",
          etapas: etapasConsolidadas,
          isLoading: false,
        })
      } catch (error) {
        console.error("Error al consolidar datos de listas de chequeo:", error)

        // Fallback a localStorage o datos estáticos si hay un error
        try {
          const datosLocales = await cargarDatosLocales()
          setDatosConsolidados(datosLocales)
        } catch (fallbackError) {
          console.error("Error en fallback a datos locales:", fallbackError)
          setDatosConsolidados((prev) => ({ ...prev, isLoading: false }))
        }
      }
    }

    cargarDatosConsolidados()

    // Suscribirse a cambios en la tabla lista_chequeo_respuestas
    const subscription = supabase
      .channel("lista_chequeo_real_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lista_chequeo_respuestas",
        },
        () => {
          console.log("Cambios detectados en lista_chequeo_respuestas, recargando datos...")
          cargarDatosConsolidados()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Función para cargar datos locales (fallback)
  const cargarDatosLocales = async (): Promise<DatosConsolidados> => {
    try {
      console.log("Cargando datos locales como fallback...")
      // Estructura para almacenar datos consolidados
      const etapasMap = new Map<string, EtapaConsolidada>()

      // Cargar datos de cada área
      for (const areaId of areas) {
        // Intentar cargar desde localStorage primero
        const storedData = localStorage.getItem(`${areaId}-lista-chequeo-data`)
        let datosArea

        if (storedData) {
          datosArea = JSON.parse(storedData)
        } else {
          // Si no hay datos en localStorage, cargar datos por defecto
          const defaultData = await import("@/data/lista-chequeo-data.json")
          datosArea = defaultData.default
        }

        // Si no hay datos para esta área, continuar con la siguiente
        if (!datosArea || !Array.isArray(datosArea.etapas)) continue

        // Procesar cada etapa del área
        datosArea.etapas.forEach((etapa: any) => {
          const nombreEtapa = etapa.nombre || "Sin nombre"

          // Obtener o crear la etapa en el mapa consolidado
          if (!etapasMap.has(nombreEtapa)) {
            etapasMap.set(nombreEtapa, {
              nombre: nombreEtapa,
              documentos: [],
            })
          }

          // Añadir documentos de esta área a la etapa consolidada
          if (Array.isArray(etapa.documentos)) {
            const etapaConsolidada = etapasMap.get(nombreEtapa)!

            etapa.documentos.forEach((doc: any) => {
              // Añadir información del área al documento
              etapaConsolidada.documentos.push({
                ...doc,
                area: areaNombres[areaId],
                areaId: areaId,
              })
            })
          }
        })
      }

      // Convertir el mapa a un array para el estado
      const etapasConsolidadas = Array.from(etapasMap.values())
      console.log("Datos locales cargados:", etapasConsolidadas)

      return {
        titulo: "Lista de Chequeo Consolidada",
        etapas: etapasConsolidadas,
        isLoading: false,
      }
    } catch (error) {
      console.error("Error al cargar datos locales:", error)
      return {
        titulo: "Lista de Chequeo Consolidada",
        etapas: [],
        isLoading: false,
      }
    }
  }

  return datosConsolidados
}
