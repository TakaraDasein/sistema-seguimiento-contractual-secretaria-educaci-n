"use client"

import { useState, useCallback, lazy } from "react"
import { RoleGuard } from "@/components/auth/role-guard"
import { FileSpreadsheet, FileCheck, Clock, FolderOpen } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMatrizSeguimiento } from "@/hooks/use-matriz-seguimiento"
import { useMatrizFilters } from "@/hooks/use-matriz-filters"

// Lazy load de componentes pesados
const TimelineView = lazy(() =>
  import("@/components/dashboard/timeline-view").then((mod) => ({ default: mod.TimelineView })),
)
const ChecklistReal = lazy(() =>
  import("@/components/dashboard/checklist-real").then((mod) => ({ default: mod.ChecklistReal })),
)
const DocumentosReport = lazy(() =>
  import("@/components/dashboard/documentos-report").then((mod) => ({ default: mod.DocumentosReport })),
)

import { MatrizGeneralTab } from "./matriz-general-tab"
import { ChecklistTab } from "./checklist-tab"
import { TimelineTab } from "./timeline-tab"
import { DocumentosTab } from "./documentos-tab"

// Componente de carga para Suspense
const LoadingFallback = () => (
  <div className="flex justify-center items-center py-20" aria-live="polite" aria-busy="true">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" role="status"></div>
    <span className="sr-only">Cargando...</span>
  </div>
)

export default function MatrizSeguimientoPage() {
  const [activeTab, setActiveTab] = useState("matriz")
  const [searchTerm, setSearchTerm] = useState("")
  const [areaFilter, setAreaFilter] = useState("todas")
  const [estadoFilter, setEstadoFilter] = useState("todos")

  const { data: matrizData, isLoading, isError, error, refetch } = useMatrizSeguimiento()

  const { filteredData, dataByArea } = useMatrizFilters({
    matrizData,
    searchTerm,
    areaFilter,
    estadoFilter,
  })

  const handleClearFilters = useCallback(() => {
    setSearchTerm("")
    setAreaFilter("todas")
    setEstadoFilter("todos")
  }, [])

  return (
    <RoleGuard allowedRoles={["ADMIN", "PLANEACION"]}>
      <main className="min-h-screen" style={{ background: "linear-gradient(to bottom, hsl(220 14% 96%), hsl(220 14% 98%))" }}>
        <div className="container mx-auto p-4 md:p-8">
          <Tabs
            defaultValue="matriz"
            className="w-full relative z-10"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4 sticky top-[4rem] bg-background/95 backdrop-blur z-20 w-full overflow-x-auto flex-nowrap">
                <TabsTrigger value="matriz" className="flex items-center">
                  <FileSpreadsheet className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>Matriz General</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center">
                  <FileCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>Lista de Chequeo</span>
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>Línea de Tiempo</span>
                </TabsTrigger>
                <TabsTrigger value="documentos" className="flex items-center">
                  <FolderOpen className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>Reporte de Documentos</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="matriz">
                <MatrizGeneralTab
                  data={filteredData}
                  isLoading={isLoading}
                  isError={isError}
                  refetch={refetch}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  areaFilter={areaFilter}
                  setAreaFilter={setAreaFilter}
                  estadoFilter={estadoFilter}
                  setEstadoFilter={setEstadoFilter}
                  handleClearFilters={handleClearFilters}
                />
              </TabsContent>

              <TabsContent value="analytics">
                <ChecklistTab />
              </TabsContent>

              <TabsContent value="timeline">
                <TimelineTab projects={filteredData} />
              </TabsContent>

              <TabsContent value="documentos">
                <DocumentosTab />
              </TabsContent>
            </Tabs>        </div>      </main>
    </RoleGuard>
  )
}
