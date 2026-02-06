"use client"

import { useState, useEffect } from "react"
import type { Folder, Document } from "@/types/documents"
import type { AreaId, ModuleType } from "@/hooks/use-document-store-generic"
import { USE_SUPABASE } from "@/lib/config"
import { MOCK_FOLDERS, MOCK_DOCUMENTS } from "@/lib/datos-prueba"

export interface DocumentStats {
  areaId: AreaId
  areaName: string
  moduleType: ModuleType
  moduleName: string
  totalFolders: number
  totalDocuments: number
  documentsByCategory: Record<string, number>
  foldersByCategory: Record<string, number>
  totalSize: number
  lastUpdated: string | null
}

export interface DocumentsReport {
  stats: DocumentStats[]
  totalDocuments: number
  totalFolders: number
  totalSize: number
  byArea: Record<
    AreaId,
    {
      totalDocuments: number
      totalFolders: number
      totalSize: number
    }
  >
  byModule: Record<
    ModuleType,
    {
      totalDocuments: number
      totalFolders: number
      totalSize: number
    }
  >
}

const areaMapping: Record<AreaId, string> = {
  "calidad-educativa": "Calidad Educativa",
  "inspeccion-vigilancia": "Inspección y Vigilancia",
  "cobertura-infraestructura": "Cobertura e Infraestructura",
  "talento-humano": "Talento Humano",
}

const moduleMapping: Record<ModuleType, string> = {
  proveedores: "Proveedores",
  "prestacion-servicio": "Prestación de Servicio",
}

export function useDocumentosReport() {
  const [isLoading, setIsLoading] = useState(true)
  const [report, setReport] = useState<DocumentsReport>({
    stats: [],
    totalDocuments: 0,
    totalFolders: 0,
    totalSize: 0,
    byArea: {
      "calidad-educativa": { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
      "inspeccion-vigilancia": { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
      "cobertura-infraestructura": { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
      "talento-humano": { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
    },
    byModule: {
      proveedores: { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
      "prestacion-servicio": { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
    },
  })

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true)

      try {
        // En modo offline, usar datos mock
        if (!USE_SUPABASE) {
          const stats: DocumentStats[] = []
          let totalDocuments = MOCK_DOCUMENTS.length
          let totalFolders = MOCK_FOLDERS.length
          let totalSize = MOCK_DOCUMENTS.reduce((sum, doc) => sum + (doc.fileSize || 0), 0)

          const byArea: Record<AreaId, { totalDocuments: number; totalFolders: number; totalSize: number }> = {
            "calidad-educativa": { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
            "inspeccion-vigilancia": { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
            "cobertura-infraestructura": { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
            "talento-humano": { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
          }

          const byModule: Record<ModuleType, { totalDocuments: number; totalFolders: number; totalSize: number }> = {
            proveedores: { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
            "prestacion-servicio": { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
          }

          // Mapeo de UUIDs a AreaIds
          const uuidToAreaId: Record<string, AreaId> = {
            "e28654eb-216c-49cd-9a96-42366c097f12": "calidad-educativa",
            "502d6c5d-0a1e-43fa-85b7-ae91f7743f0d": "inspeccion-vigilancia",
            "2d8bf8a1-0557-4974-8212-a2f4a93a4fb2": "cobertura-infraestructura",
            "15bb34b0-25eb-407f-9ce7-f781fcd04ecc": "talento-humano",
          }

          // Procesar cada área
          Object.entries(uuidToAreaId).forEach(([uuid, areaId]) => {
            const areaFolders = MOCK_FOLDERS.filter((f) => f.area_id === uuid)
            const areaDocuments = MOCK_DOCUMENTS.filter((d) => areaFolders.some((f) => f.id === d.folderId))

            const areaSize = areaDocuments.reduce((sum, doc) => sum + (doc.fileSize || 0), 0)

            byArea[areaId] = {
              totalDocuments: areaDocuments.length,
              totalFolders: areaFolders.length,
              totalSize: areaSize,
            }

            // Crear stats por categoría de documento
            const documentsByCategory: Record<string, number> = {}
            const foldersByCategory: Record<string, number> = {}

            areaFolders.forEach((folder) => {
              const category = folder.category || "general"
              foldersByCategory[category] = (foldersByCategory[category] || 0) + 1
            })

            areaDocuments.forEach((doc) => {
              const folder = areaFolders.find((f) => f.id === doc.folderId)
              if (folder) {
                const category = folder.category || "general"
                documentsByCategory[category] = (documentsByCategory[category] || 0) + 1
              }
            })

            // Encontrar última actualización
            let lastUpdated: string | null = null
            if (areaDocuments.length > 0) {
              const dates = areaDocuments.map((doc) => doc.created_at).filter(Boolean) as string[]
              if (dates.length > 0) {
                lastUpdated = new Date(Math.max(...dates.map((date) => new Date(date).getTime()))).toISOString()
              }
            }

            // Agregar stats para proveedores (categoría: preContractual, execution)
            stats.push({
              areaId,
              areaName: areaMapping[areaId],
              moduleType: "proveedores",
              moduleName: moduleMapping["proveedores"],
              totalFolders: areaFolders.filter((f) => ["preContractual", "execution"].includes(f.category || ""))
                .length,
              totalDocuments: areaDocuments.filter((d) =>
                areaFolders.some(
                  (f) => f.id === d.folderId && ["preContractual", "execution"].includes(f.category || ""),
                ),
              ).length,
              documentsByCategory,
              foldersByCategory,
              totalSize: areaSize / 2, // Dividir aproximadamente
              lastUpdated,
            })

            // Agregar stats para prestación de servicio (categoría: closure, otros)
            stats.push({
              areaId,
              areaName: areaMapping[areaId],
              moduleType: "prestacion-servicio",
              moduleName: moduleMapping["prestacion-servicio"],
              totalFolders: areaFolders.filter((f) => !["preContractual", "execution"].includes(f.category || ""))
                .length,
              totalDocuments: areaDocuments.filter((d) =>
                areaFolders.some(
                  (f) => f.id === d.folderId && !["preContractual", "execution"].includes(f.category || ""),
                ),
              ).length,
              documentsByCategory,
              foldersByCategory,
              totalSize: areaSize / 2, // Dividir aproximadamente
              lastUpdated,
            })

            // Actualizar totales por módulo
            byModule.proveedores.totalDocuments += Math.floor(areaDocuments.length / 2)
            byModule.proveedores.totalFolders += Math.floor(areaFolders.length / 2)
            byModule.proveedores.totalSize += areaSize / 2

            byModule["prestacion-servicio"].totalDocuments += Math.ceil(areaDocuments.length / 2)
            byModule["prestacion-servicio"].totalFolders += Math.ceil(areaFolders.length / 2)
            byModule["prestacion-servicio"].totalSize += areaSize / 2
          })

          setReport({
            stats,
            totalDocuments,
            totalFolders,
            totalSize,
            byArea,
            byModule,
          })
          setIsLoading(false)
          return
        }

        // Código original para modo online con Supabase...
        const areas: AreaId[] = [
          "calidad-educativa",
          "inspeccion-vigilancia",
          "cobertura-infraestructura",
          "talento-humano",
        ]

        const modules: ModuleType[] = ["proveedores", "prestacion-servicio"]

        const stats: DocumentStats[] = []
        let totalDocuments = 0
        let totalFolders = 0
        let totalSize = 0

        const byArea: Record<AreaId, { totalDocuments: number; totalFolders: number; totalSize: number }> = {
          "calidad-educativa": { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
          "inspeccion-vigilancia": { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
          "cobertura-infraestructura": { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
          "talento-humano": { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
        }

        const byModule: Record<ModuleType, { totalDocuments: number; totalFolders: number; totalSize: number }> = {
          proveedores: { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
          "prestacion-servicio": { totalDocuments: 0, totalFolders: 0, totalSize: 0 },
        }

        // Recopilar datos para cada combinación de área y módulo
        areas.forEach((areaId) => {
          modules.forEach((moduleType) => {
            const foldersKey = `${areaId}-${moduleType}-folders`
            const documentsKey = `${areaId}-${moduleType}-documents`

            let folders: Folder[] = []
            let documents: Document[] = []

            // Obtener carpetas
            const storedFolders = localStorage.getItem(foldersKey)
            if (storedFolders) {
              try {
                folders = JSON.parse(storedFolders)
              } catch (error) {
                console.error(`Error parsing folders for ${areaId}-${moduleType}:`, error)
              }
            }

            // Obtener documentos
            const storedDocuments = localStorage.getItem(documentsKey)
            if (storedDocuments) {
              try {
                documents = JSON.parse(storedDocuments)
              } catch (error) {
                console.error(`Error parsing documents for ${areaId}-${moduleType}:`, error)
              }
            }

            // Calcular estadísticas
            const documentsByCategory: Record<string, number> = {}
            const foldersByCategory: Record<string, number> = {}

            folders.forEach((folder) => {
              foldersByCategory[folder.category] = (foldersByCategory[folder.category] || 0) + 1
            })

            let moduleSize = 0
            documents.forEach((doc) => {
              const folder = folders.find((f) => f.id === doc.folderId)
              if (folder) {
                documentsByCategory[folder.category] = (documentsByCategory[folder.category] || 0) + 1
              }
              moduleSize += doc.fileSize || 0
            })

            // Encontrar la fecha de última actualización
            let lastUpdated: string | null = null
            if (documents.length > 0) {
              const dates = documents
                .map((doc) => doc.uploadDate || doc.createdAt || doc.updatedAt)
                .filter(Boolean) as string[]

              if (dates.length > 0) {
                lastUpdated = new Date(Math.max(...dates.map((date) => new Date(date).getTime()))).toISOString()
              }
            }

            // Agregar estadísticas para esta combinación
            stats.push({
              areaId,
              areaName: areaMapping[areaId],
              moduleType,
              moduleName: moduleMapping[moduleType],
              totalFolders: folders.length,
              totalDocuments: documents.length,
              documentsByCategory,
              foldersByCategory,
              totalSize: moduleSize,
              lastUpdated,
            })

            // Actualizar totales
            totalDocuments += documents.length
            totalFolders += folders.length
            totalSize += moduleSize

            // Actualizar totales por área
            byArea[areaId].totalDocuments += documents.length
            byArea[areaId].totalFolders += folders.length
            byArea[areaId].totalSize += moduleSize

            // Actualizar totales por módulo
            byModule[moduleType].totalDocuments += documents.length
            byModule[moduleType].totalFolders += folders.length
            byModule[moduleType].totalSize += moduleSize
          })
        })

        setReport({
          stats,
          totalDocuments,
          totalFolders,
          totalSize,
          byArea,
          byModule,
        })
      } catch (error) {
        console.error("Error loading document report data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Actualizar cuando cambie el localStorage
    const handleStorageChange = () => {
      loadData()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return {
    report,
    isLoading,
  }
}
