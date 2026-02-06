"use client"

import { CardDescription } from "@/components/ui/card"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen } from "lucide-react"
import { Suspense, lazy } from "react"

const DocumentosReport = lazy(() =>
  import("@/components/dashboard/documentos-report").then((mod) => ({ default: mod.DocumentosReport })),
)

const LoadingFallback = () => (
  <div className="flex justify-center items-center py-20" aria-live="polite" aria-busy="true">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" role="status"></div>
    <span className="sr-only">Cargando...</span>
  </div>
)

export function DocumentosTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FolderOpen className="mr-2 h-5 w-5" aria-hidden="true" />
          Reporte de Documentos
        </CardTitle>
        <CardDescription>Análisis y seguimiento de documentos y carpetas en todas las áreas y módulos.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<LoadingFallback />}>
          <DocumentosReport />
        </Suspense>
      </CardContent>
    </Card>
  )
}
