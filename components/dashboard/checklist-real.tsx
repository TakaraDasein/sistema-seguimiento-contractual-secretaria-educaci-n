"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, FileCheck } from "lucide-react"
import dynamic from "next/dynamic"
import { useListaChequeoReal } from "@/hooks/use-lista-chequeo-real"

// Importar ApexCharts de forma dinámica para evitar problemas de SSR
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export function ChecklistReal() {
  const [activeTab, setActiveTab] = useState("grafico")
  const [mounted, setMounted] = useState(false)
  const [selectedEtapa, setSelectedEtapa] = useState<string>("todas")
  const [selectedDocumento, setSelectedDocumento] = useState<string>("todos")
  const [selectedArea, setSelectedArea] = useState<string>("todas")
  const [documentosFiltrados, setDocumentosFiltrados] = useState<any[]>([])
  const [documentosDisponibles, setDocumentosDisponibles] = useState<any[]>([])

  // Obtener datos consolidados de todas las áreas
  const datosConsolidados = useListaChequeoReal()
  const etapas = datosConsolidados.etapas || []
  const isLoading = datosConsolidados.isLoading

  // Obtener áreas únicas de los documentos
  const areasUnicas = useMemo(() => {
    return Array.from(new Set(etapas.flatMap((etapa) => etapa.documentos).map((doc) => doc.areaId)))
  }, [etapas])

  // Mapeo de IDs de área a nombres legibles
  const areaNombres: Record<string, string> = {
    "calidad-educativa": "Calidad Educativa",
    "inspeccion-vigilancia": "Inspección y Vigilancia",
    "cobertura-infraestructura": "Cobertura e Infraestructura",
    "talento-humano": "Talento Humano",
  }

  // Efecto para filtrar documentos según la etapa y área seleccionadas
  useEffect(() => {
    let documentosFiltradosPorEtapa: any[] = []

    if (selectedEtapa === "todas") {
      // Si se selecciona "todas", obtener todos los documentos de todas las etapas
      documentosFiltradosPorEtapa = etapas.flatMap((etapa) => etapa.documentos || [])
    } else {
      // Filtrar por la etapa seleccionada
      const etapaSeleccionada = etapas.find((etapa) => etapa.nombre === selectedEtapa)
      if (etapaSeleccionada && Array.isArray(etapaSeleccionada.documentos)) {
        documentosFiltradosPorEtapa = etapaSeleccionada.documentos
      }
    }

    // Aplicar filtro por área
    let documentosFiltradosPorArea = documentosFiltradosPorEtapa
    if (selectedArea !== "todas") {
      documentosFiltradosPorArea = documentosFiltradosPorEtapa.filter((doc) => doc.areaId === selectedArea)
    }

    setDocumentosDisponibles(documentosFiltradosPorArea)
    setDocumentosFiltrados(documentosFiltradosPorArea)

    // Solo resetear si el documento actual ya no está disponible en el nuevo filtro
    if (selectedDocumento !== "todos") {
      const existeAun = documentosFiltradosPorArea.some(doc => doc.nombre === selectedDocumento)
      if (!existeAun) {
        setSelectedDocumento("todos")
      }
    }
  }, [selectedEtapa, selectedArea, etapas, selectedDocumento])

  // Efecto para filtrar por documento específico
  useEffect(() => {
    if (selectedDocumento === "todos") {
      // Si se selecciona "todos", mostrar todos los documentos disponibles según la etapa y área
      setDocumentosFiltrados(documentosDisponibles)
    } else {
      // Filtrar por el documento seleccionado
      const documentoFiltrado = documentosDisponibles.filter((doc) => doc.nombre === selectedDocumento)
      setDocumentosFiltrados(documentoFiltrado)
    }
  }, [selectedDocumento, documentosDisponibles])

  // Preparar datos para el gráfico
  const chartData = useMemo(() => {
    // Si no hay documentos filtrados, devolver datos vacíos
    if (!documentosFiltrados || documentosFiltrados.length === 0) return { categories: [], series: [] }

    // Si es un documento específico
    if (selectedDocumento !== "todos" && documentosFiltrados.length > 0) {
      const documento = documentosFiltrados[0]
      // Verificar que documento.respuestas existe
      if (!documento.respuestas) {
        return { categories: [], series: [] }
      }

      return {
        categories: [documento.nombre],
        series: [
          {
            name: "Sí",
            data: [documento.respuestas.si || 0],
          },
          {
            name: "No",
            data: [documento.respuestas.no || 0],
          },
          {
            name: "No Aplica",
            data: [documento.respuestas.noAplica || 0],
          },
        ],
      }
    }

    // Si estamos viendo todas las etapas y no se ha seleccionado una etapa específica,
    // mostrar el consolidado por etapas
    if (selectedEtapa === "todas" && selectedArea === "todas") {
      // Verificar que etapas es un array
      if (!Array.isArray(etapas) || etapas.length === 0) {
        return { categories: [], series: [] }
      }

      // Calcular promedios por etapa
      const promediosPorEtapa = etapas.map((etapa) => {
        // Verificar que etapa.documentos existe y es un array
        const docs = Array.isArray(etapa.documentos) ? etapa.documentos : []
        const total = docs.length

        if (total === 0) return { nombre: etapa.nombre || "Sin nombre", si: 0, no: 0, noAplica: 0 }

        const sumatorias = docs.reduce(
          (acc, doc) => {
            // Verificar que doc.respuestas existe
            if (doc.respuestas) {
              acc.si += doc.respuestas.si || 0
              acc.no += doc.respuestas.no || 0
              acc.noAplica += doc.respuestas.noAplica || 0
            }
            return acc
          },
          { si: 0, no: 0, noAplica: 0 },
        )

        return {
          nombre: etapa.nombre || "Sin nombre",
          si: Number.parseFloat((sumatorias.si / total).toFixed(1)),
          no: Number.parseFloat((sumatorias.no / total).toFixed(1)),
          noAplica: Number.parseFloat((sumatorias.noAplica / total).toFixed(1)),
        }
      })

      // Verificar que promediosPorEtapa es un array
      if (!Array.isArray(promediosPorEtapa) || promediosPorEtapa.length === 0) {
        return { categories: [], series: [] }
      }

      return {
        categories: promediosPorEtapa.map((etapa) => etapa.nombre),
        series: [
          {
            name: "Sí",
            data: promediosPorEtapa.map((etapa) => etapa.si),
          },
          {
            name: "No",
            data: promediosPorEtapa.map((etapa) => etapa.no),
          },
          {
            name: "No Aplica",
            data: promediosPorEtapa.map((etapa) => etapa.noAplica),
          },
        ],
      }
    }

    // Si se ha seleccionado una etapa específica o un área específica, mostrar los documentos filtrados
    // Verificar que documentosFiltrados es un array
    if (!Array.isArray(documentosFiltrados) || documentosFiltrados.length === 0) {
      return { categories: [], series: [] }
    }

    // Si hay muchos documentos, agrupar por área para mejor visualización
    if (documentosFiltrados.length > 10 && selectedArea === "todas") {
      // Agrupar por área
      const documentosPorArea = documentosFiltrados.reduce(
        (acc, doc) => {
          const areaId = doc.areaId || "sin-area"
          if (!acc[areaId]) {
            acc[areaId] = {
              nombre: areaNombres[areaId] || areaId,
              documentos: [],
              respuestas: { si: 0, no: 0, noAplica: 0 },
              total: 0,
            }
          }
          acc[areaId].documentos.push(doc)
          if (doc.respuestas) {
            acc[areaId].respuestas.si += doc.respuestas.si || 0
            acc[areaId].respuestas.no += doc.respuestas.no || 0
            acc[areaId].respuestas.noAplica += doc.respuestas.noAplica || 0
            acc[areaId].total += 1
          }
          return acc
        },
        {} as Record<string, any>,
      )

      // Calcular promedios por área
      const areas = Object.values(documentosPorArea).map((area) => {
        return {
          nombre: area.nombre,
          si: area.total > 0 ? Number.parseFloat((area.respuestas.si / area.total).toFixed(1)) : 0,
          no: area.total > 0 ? Number.parseFloat((area.respuestas.no / area.total).toFixed(1)) : 0,
          noAplica: area.total > 0 ? Number.parseFloat((area.respuestas.noAplica / area.total).toFixed(1)) : 0,
        }
      })

      return {
        categories: areas.map((area) => area.nombre),
        series: [
          {
            name: "Sí",
            data: areas.map((area) => area.si),
          },
          {
            name: "No",
            data: areas.map((area) => area.no),
          },
          {
            name: "No Aplica",
            data: areas.map((area) => area.noAplica),
          },
        ],
      }
    }

    // Mostrar todos los documentos filtrados
    return {
      categories: documentosFiltrados.map((doc) => {
        // Añadir el área al nombre para mejor identificación
        const areaAbrev = doc.area ? `[${doc.area.substring(0, 3)}] ` : ""
        return areaAbrev + (doc.nombre || "Sin nombre")
      }),
      series: [
        {
          name: "Sí",
          data: documentosFiltrados.map((doc) => (doc.respuestas ? doc.respuestas.si || 0 : 0)),
        },
        {
          name: "No",
          data: documentosFiltrados.map((doc) => (doc.respuestas ? doc.respuestas.no || 0 : 0)),
        },
        {
          name: "No Aplica",
          data: documentosFiltrados.map((doc) => (doc.respuestas ? doc.respuestas.noAplica || 0 : 0)),
        },
      ],
    }
  }, [documentosFiltrados, selectedDocumento, selectedEtapa, selectedArea, etapas])

  // Calcular promedios para los documentos filtrados
  const promedios = useMemo(() => {
    if (!Array.isArray(documentosFiltrados) || documentosFiltrados.length === 0) {
      return { si: 0, no: 0, noAplica: 0 }
    }

    const totales = documentosFiltrados.reduce(
      (acc, doc) => {
        // Verificar que doc.respuestas existe
        if (doc.respuestas) {
          acc.si += doc.respuestas.si || 0
          acc.no += doc.respuestas.no || 0
          acc.noAplica += doc.respuestas.noAplica || 0
        }
        return acc
      },
      { si: 0, no: 0, noAplica: 0 },
    )

    return {
      si: Number.parseFloat((totales.si / documentosFiltrados.length).toFixed(1)),
      no: Number.parseFloat((totales.no / documentosFiltrados.length).toFixed(1)),
      noAplica: Number.parseFloat((totales.noAplica / documentosFiltrados.length).toFixed(1)),
    }
  }, [documentosFiltrados])

  // Opciones para el gráfico radial
  const radarChartOptions = {
    chart: {
      type: "radar",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      background: "transparent",
    },
    colors: ["#22c55e", "#ef4444", "#f59e0b"],
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.2,
    },
    markers: {
      size: 4,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: Array(chartData.categories.length).fill("#9ca3af"),
          fontSize: "12px",
        },
        // Ajustar el formato de las etiquetas para que se muestren mejor cuando hay muchas
        formatter: (val) => {
          // Si la etiqueta es muy larga, truncarla
          if (val && val.length > 20 && chartData.categories.length > 5) {
            return val.substring(0, 20) + "..."
          }
          return val || ""
        },
      },
    },
    yaxis: {
      show: false,
      max: 100,
    },
    legend: {
      position: "bottom",
      fontSize: "12px",
      labels: {
        colors: "#9ca3af",
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => (val || 0) + "%",
      },
      // Añadir el nombre completo en el tooltip para etiquetas truncadas
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const category = w.globals.labels[dataPointIndex] || "Sin nombre"
        const value = series[seriesIndex][dataPointIndex] || 0
        const seriesName = w.globals.seriesNames[seriesIndex] || "Sin nombre"

        return `<div class="p-2">
          <div class="font-medium">${category}</div>
          <div>${seriesName}: ${value}%</div>
        </div>`
      },
    },
    grid: {
      borderColor: "rgba(163, 163, 163, 0.1)",
      strokeDashArray: 5,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 350,
          },
          legend: {
            position: "bottom",
            offsetY: 0,
          },
        },
      },
    ],
  }

  // Efecto para manejar el montaje del componente
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card className="dashboard-card col-span-full">
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-[400px] mx-auto">
            <TabsTrigger value="grafico">Gráfico Radar</TabsTrigger>
            <TabsTrigger value="observaciones">Observaciones Detalladas</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Columna Principal: Gráfico u Observaciones */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              {/* Mensaje informativo cuando no hay datos */}
              {documentosFiltrados.length === 0 && !isLoading && (
                <Alert className="mb-6 bg-blue-50/50 border-blue-100">
                  <InfoIcon className="h-4 w-4 text-blue-500" />
                  <AlertTitle className="text-blue-700 font-semibold">No hay datos disponibles</AlertTitle>
                  <AlertDescription className="text-blue-600/80">
                    No se encontraron registros de listas de chequeo para los filtros seleccionados. 
                    Intente cambiar los parámetros de búsqueda o complete nuevas listas en el módulo correspondiente.
                  </AlertDescription>
                </Alert>
              )}

              <TabsContent value="grafico" className="mt-0 outline-none">
                <div className="bg-white/50 backdrop-blur-sm border rounded-2xl p-4 shadow-sm h-[550px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-4 left-6 z-10">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1">
                      Visualización de Desempeño
                    </Badge>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex flex-col justify-center items-center gap-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      <span className="text-sm font-medium text-muted-foreground animate-pulse">Analizando datos...</span>
                    </div>
                  ) : mounted && chartData.categories.length > 0 ? (
                    <div className="w-full h-full pt-8">
                       <ReactApexChart options={radarChartOptions} series={chartData.series} type="radar" height={500} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-8">
                      <div className="bg-muted/30 p-4 rounded-full mb-4">
                        <FileCheck className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-muted-foreground font-medium max-w-[250px]">
                        No hay datos consolidables para esta selección
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="observaciones" className="mt-0 outline-none">
                <ScrollArea className="h-[550px] pr-4">
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    ) : Array.isArray(documentosFiltrados) && documentosFiltrados.length > 0 ? (
                      documentosFiltrados.map((documento, docIndex) => (
                        <div key={docIndex} className="bg-white border rounded-xl p-5 shadow-sm transition-all hover:shadow-md border-muted/60">
                          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg text-slate-800">
                                  {documento.nombre || `Documento ${docIndex + 1}`}
                                </h3>
                                {documento.area && (
                                  <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">
                                    {documento.area}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-500 leading-relaxed font-normal">
                                {documento.descripcion || "Sin descripción proporcionada para este registro del sistema."}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <div className="flex flex-col items-end">
                                <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Puntuación</span>
                                <div className="flex gap-1.5">
                                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100 font-bold px-2.5">
                                    Sí: {documento.respuestas ? documento.respuestas.si || 0 : 0}%
                                  </Badge>
                                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-100 font-bold px-2.5">
                                    No: {documento.respuestas ? documento.respuestas.no || 0 : 0}%
                                  </Badge>
                                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-100 font-bold px-2.5">
                                    N/A: {documento.respuestas ? documento.respuestas.noAplica || 0 : 0}%
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-100">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Observaciones y Hallazgos</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {Array.isArray(documento.observaciones) && documento.observaciones.length > 0 ? (
                                documento.observaciones.map((obs: string, obsIndex: number) => (
                                  <div key={obsIndex} className="text-sm bg-slate-50 border border-slate-100 p-3 rounded-lg text-slate-600 flex items-start gap-2">
                                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                                    {obs}
                                  </div>
                                ))
                              ) : (
                                <div className="text-sm italic text-slate-400 bg-slate-50/50 p-3 rounded-lg border border-dashed border-slate-200 text-center">
                                  No se registraron observaciones adicionales para este documento.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[400px] text-center p-8 bg-muted/20 rounded-2xl border border-dashed">
                        <InfoIcon className="h-10 w-10 text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground font-medium">No hay observaciones disponibles</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>

            {/* Columna Lateral: Filtros y Estadísticas */}
            <div className="lg:col-span-1 order-1 lg:order-2 space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-6 sticky top-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="h-1 w-3 bg-primary rounded-full" />
                    Filtros de Análisis
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Etapa de Proceso</label>
                      <Select value={selectedEtapa} onValueChange={setSelectedEtapa}>
                        <SelectTrigger className="w-full bg-white border-slate-200 hover:border-primary/50 transition-colors rounded-xl shadow-sm">
                          <SelectValue placeholder="Seleccionar etapa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas las etapas</SelectItem>
                          {etapas.map((etapa, index) => (
                            <SelectItem key={index} value={etapa.nombre || `etapa-${index}`}>
                              {etapa.nombre || `Etapa ${index + 1}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Área Técnica</label>
                      <Select value={selectedArea} onValueChange={setSelectedArea}>
                        <SelectTrigger className="w-full bg-white border-slate-200 hover:border-primary/50 transition-colors rounded-xl shadow-sm">
                          <SelectValue placeholder="Seleccionar área" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas las áreas</SelectItem>
                          {areasUnicas.map((areaId, index) => (
                            <SelectItem key={index} value={areaId}>
                              {areaNombres[areaId] || areaId}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Instrumento Específico</label>
                      <Select
                        value={selectedDocumento}
                        onValueChange={setSelectedDocumento}
                        disabled={documentosDisponibles.length === 0}
                      >
                        <SelectTrigger className="w-full bg-white border-slate-200 hover:border-primary/50 transition-colors rounded-xl shadow-sm">
                          <SelectValue placeholder="Seleccionar documento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos los documentos</SelectItem>
                          {documentosDisponibles.map((doc, index) => (
                            <SelectItem key={index} value={doc.nombre || `doc-${index}`}>
                              {doc.nombre || `Documento ${index + 1}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <div className="h-1 w-3 bg-primary rounded-full" />
                    Cumplimiento Promedio
                  </h3>
                  
                  {documentosFiltrados.length > 0 ? (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-medium text-slate-600">Positivo (Sí)</span>
                          <span className="text-lg font-bold text-green-600 leading-none">{promedios.si}%</span>
                        </div>
                        <Progress value={promedios.si} className="h-2 bg-slate-200" indicatorColor="bg-green-500" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-medium text-slate-600">Negativo (No)</span>
                          <span className="text-lg font-bold text-red-600 leading-none">{promedios.no}%</span>
                        </div>
                        <Progress value={promedios.no} className="h-2 bg-slate-200" indicatorColor="bg-red-500" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-medium text-slate-600">No aplica</span>
                          <span className="text-lg font-bold text-amber-600 leading-none">{promedios.noAplica}%</span>
                        </div>
                        <Progress value={promedios.noAplica} className="h-2 bg-slate-200" indicatorColor="bg-amber-500" />
                      </div>

                      <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase italic">
                           ⚡ Insight Rápido
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                          {promedios.si > 70 
                            ? "El nivel de cumplimiento es óptimo. Se recomienda mantener las prácticas actuales."
                            : promedios.si > 40 
                            ? "Cumplimiento moderado. Se identifican áreas críticas que requieren intervención inmediata."
                            : "Nivel de cumplimiento bajo. Es prioritario realizar un plan de mejoramiento académico."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-400 text-xs italic">Cargue datos para ver estadísticas</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
