"use client"

// components/plan-accion/plan-accion-add-dialog.tsx
import { useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Save } from "lucide-react"
import { PlanAccionEstado, type PlanAccionItem } from "@/types/plan-accion"
import { usePlanAccionForm } from "@/hooks/use-plan-accion-form"
import { DatePicker } from "@/components/ui/date-picker"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PlanAccionAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (item: PlanAccionItem) => void
  isSubmitting: boolean
}

export function PlanAccionAddDialog({ open, onOpenChange, onSubmit, isSubmitting }: PlanAccionAddDialogProps) {
  const {
    item,
    errors,
    fechaInicioDate,
    fechaFinDate,
    updateField,
    setFechaInicioDate,
    setFechaFinDate,
    handleSubmit,
    resetForm,
  } = usePlanAccionForm(onSubmit)

  // Resetear formulario al cerrar
  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open, resetForm])

  // Manejar cierre del diálogo
  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Elemento</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid gap-8 py-8 md:grid-cols-2 px-4">
            <div>
              <label htmlFor="programa" className="block text-sm font-medium mb-1">
                Programa <span className="text-red-500">*</span>
              </label>
              <Input
                id="programa"
                value={item.programa}
                onChange={(e) => updateField("programa", e.target.value)}
                placeholder="Nombre del programa"
                className={`w-full ${errors.programa ? "border-red-500" : ""}`}
                aria-invalid={!!errors.programa}
                aria-describedby={errors.programa ? "programa-error" : undefined}
              />
              {errors.programa && (
                <p id="programa-error" className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.programa}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="objetivo" className="block text-sm font-medium mb-1">
                Objetivo <span className="text-red-500">*</span>
              </label>
              <Input
                id="objetivo"
                value={item.objetivo}
                onChange={(e) => updateField("objetivo", e.target.value)}
                placeholder="Objetivo del programa"
                className={`w-full ${errors.objetivo ? "border-red-500" : ""}`}
                aria-invalid={!!errors.objetivo}
                aria-describedby={errors.objetivo ? "objetivo-error" : undefined}
              />
              {errors.objetivo && (
                <p id="objetivo-error" className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.objetivo}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="meta" className="block text-sm font-medium mb-1">
                Meta <span className="text-red-500">*</span>
              </label>
              <Input
                id="meta"
                value={item.meta}
                onChange={(e) => updateField("meta", e.target.value)}
                placeholder="Meta a alcanzar"
                className={`w-full ${errors.meta ? "border-red-500" : ""}`}
                aria-invalid={!!errors.meta}
                aria-describedby={errors.meta ? "meta-error" : undefined}
              />
              {errors.meta && (
                <p id="meta-error" className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.meta}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="presupuesto" className="block text-sm font-medium mb-1">
                Presupuesto <span className="text-red-500">*</span>
              </label>
              <Input
                id="presupuesto"
                value={item.presupuesto}
                onChange={(e) => updateField("presupuesto", e.target.value)}
                placeholder="Ej: $100,000,000"
                className={`w-full ${errors.presupuesto ? "border-red-500" : ""}`}
                aria-invalid={!!errors.presupuesto}
                aria-describedby={errors.presupuesto ? "presupuesto-error" : undefined}
              />
              {errors.presupuesto && (
                <p id="presupuesto-error" className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.presupuesto}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="acciones" className="block text-sm font-medium mb-1">
                Acciones realizadas <span className="text-red-500">*</span>
              </label>
              <Input
                id="acciones"
                value={item.acciones}
                onChange={(e) => updateField("acciones", e.target.value)}
                placeholder="Acciones separadas por comas"
                className={`w-full ${errors.acciones ? "border-red-500" : ""}`}
                aria-invalid={!!errors.acciones}
                aria-describedby={errors.acciones ? "acciones-error" : undefined}
              />
              {errors.acciones && (
                <p id="acciones-error" className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.acciones}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="indicadores" className="block text-sm font-medium mb-1">
                Indicadores Alcanzados <span className="text-red-500">*</span>
              </label>
              <Input
                id="indicadores"
                value={item.indicadores}
                onChange={(e) => updateField("indicadores", e.target.value)}
                placeholder="Indicadores de avance"
                className={`w-full ${errors.indicadores ? "border-red-500" : ""}`}
                aria-invalid={!!errors.indicadores}
                aria-describedby={errors.indicadores ? "indicadores-error" : undefined}
              />
              {errors.indicadores && (
                <p id="indicadores-error" className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.indicadores}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="porcentajeAvance" className="block text-sm font-medium mb-1">
                Porcentaje de Avance <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id="porcentajeAvance"
                  min="0"
                  max="100"
                  step="5"
                  value={item.porcentajeAvance}
                  onChange={(e) => updateField("porcentajeAvance", Number(e.target.value))}
                  className={`flex-1 ${errors.porcentajeAvance ? "border-red-500" : ""}`}
                  aria-label="Ajustar porcentaje de avance"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={item.porcentajeAvance}
                />
                <div className="flex items-center gap-2 w-24">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={item.porcentajeAvance}
                    onChange={(e) => updateField("porcentajeAvance", Number(e.target.value))}
                    className={`w-16 ${errors.porcentajeAvance ? "border-red-500" : ""}`}
                    aria-label="Porcentaje de avance"
                  />
                  <span>%</span>
                </div>
              </div>
              {errors.porcentajeAvance && (
                <p id="porcentajeAvance-error" className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.porcentajeAvance}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="estado" className="block text-sm font-medium mb-1">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                id="estado"
                value={item.estado}
                onChange={(e) => updateField("estado", e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Estado del elemento"
              >
                <option value={PlanAccionEstado.PENDIENTE}>{PlanAccionEstado.PENDIENTE}</option>
                <option value={PlanAccionEstado.EN_PROGRESO}>{PlanAccionEstado.EN_PROGRESO}</option>
                <option value={PlanAccionEstado.COMPLETADO}>{PlanAccionEstado.COMPLETADO}</option>
                <option value={PlanAccionEstado.RETRASADO}>{PlanAccionEstado.RETRASADO}</option>
              </select>
            </div>
            <div>
              <label htmlFor="responsable" className="block text-sm font-medium mb-1">
                Responsable <span className="text-red-500">*</span>
              </label>
              <Input
                id="responsable"
                value={item.responsable}
                onChange={(e) => updateField("responsable", e.target.value)}
                placeholder="Nombre del responsable"
                className={`w-full ${errors.responsable ? "border-red-500" : ""}`}
                aria-invalid={!!errors.responsable}
                aria-describedby={errors.responsable ? "responsable-error" : undefined}
              />
              {errors.responsable && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.responsable}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="fechaInicio" className="block text-sm font-medium mb-1">
                Fecha Inicio <span className="text-red-500">*</span>
              </label>
              <DatePicker
                value={fechaInicioDate}
                onChange={(date) => {
                  if (date) {
                    setFechaInicioDate(date)
                    updateField(
                      "fechaInicio",
                      date
                        .toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
                        .replace(/\//g, "/"),
                    )
                  }
                }}
                error={errors.fechaInicio}
                placeholder="Seleccionar fecha de inicio"
                aria-label="Fecha de inicio"
                aria-describedby={errors.fechaInicio ? "fechaInicio-error" : undefined}
              />
              {errors.fechaInicio && (
                <p id="fechaInicio-error" className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.fechaInicio}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="fechaFin" className="block text-sm font-medium mb-1">
                Fecha Fin <span className="text-red-500">*</span>
              </label>
              <DatePicker
                value={fechaFinDate}
                onChange={(date) => {
                  if (date) {
                    setFechaFinDate(date)
                    updateField(
                      "fechaFin",
                      date
                        .toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
                        .replace(/\//g, "/"),
                    )
                  }
                }}
                minDate={fechaInicioDate || undefined}
                error={errors.fechaFin}
                placeholder="Seleccionar fecha de fin"
                aria-label="Fecha de fin"
                aria-describedby={errors.fechaFin ? "fechaFin-error" : undefined}
              />
              {errors.fechaFin && (
                <p id="fechaFin-error" className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.fechaFin}
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} aria-label="Cancelar">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} aria-label="Guardar elemento" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
