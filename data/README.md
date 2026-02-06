# 📁 Directorio de Datos del Sistema

Organización profesional de datos de demostración para el Sistema de Gestión Educativa.

## 📋 Estructura de Archivos

```
data/
├── 01-areas.ts                    # 6 Áreas funcionales
├── 02-plan-accion.ts              # 10 Programas y proyectos
├── 03-carpetas-documentos.ts      # 6 Carpetas + 6 Documentos
├── 04-checklist.ts                # 8 Categorías + 24 Ítems + 24 Respuestas
├── 05-matriz-seguimiento.ts       # 14 Actividades programadas
├── 06-registros-fotograficos.ts   # 10 Registros con evidencias
├── index.ts                       # Re-exportaciones centralizadas
└── README.md                      # Esta documentación
```

## 🎯 Uso de los Datos

### Importación Individual

```typescript
import { AREAS } from "@/data/01-areas"
import { PLAN_ACCION } from "@/data/02-plan-accion"
import { CHECKLIST_CATEGORIAS, CHECKLIST_ITEMS } from "@/data/04-checklist"
```

### Importación Centralizada

```typescript
import { 
  AREAS, 
  PLAN_ACCION, 
  MATRIZ_SEGUIMIENTO,
  PHOTO_RECORDS 
} from "@/data"
```

## 📊 Resumen de Datos

| Archivo | Exportaciones | Registros | Descripción |
|---------|--------------|-----------|-------------|
| `01-areas.ts` | AREAS | 6 | Áreas funcionales de la secretaría |
| `02-plan-accion.ts` | PLAN_ACCION | 10 | Programas distribuidos por área |
| `03-carpetas-documentos.ts` | FOLDERS, DOCUMENTS | 6 + 6 | Gestión documental por módulos |
| `04-checklist.ts` | CATEGORIAS, ITEMS, RESPUESTAS | 8 + 24 + 24 | Sistema evaluación 3 capas |
| `05-matriz-seguimiento.ts` | MATRIZ_SEGUIMIENTO | 14 | Actividades con seguimiento detallado |
| `06-registros-fotograficos.ts` | PHOTO_RECORDS | 10 | Evidencias fotográficas clasificadas |

**Total: 78 registros organizados**

## 🗂️ Distribución por Área

### 📚 Calidad Educativa
- Plan Acción: 3 programas
- Matriz: 4 actividades
- Checklist: 3 categorías asociadas
- Fotos: 3 registros

### 🔍 Inspección y Vigilancia
- Plan Acción: 2 programas
- Matriz: 3 actividades
- Checklist: 2 categorías asociadas
- Fotos: 2 registros

### 🏫 Cobertura e Infraestructura
- Plan Acción: 3 programas
- Matriz: 4 actividades
- Checklist: 1 categoría asociada
- Fotos: 2 registros

### 👥 Talento Humano
- Plan Acción: 2 programas
- Matriz: 3 actividades
- Checklist: 1 categoría asociada
- Fotos: 2 registros

## 🔗 Relaciones Entre Datos

### Arquitectura 3 Capas - Checklist
```
CATEGORIAS (8)
    ↓ categoria_id
ITEMS (24)
    ↓ item_id
RESPUESTAS (24)
```

### Jerarquía Documental
```
AREAS (6)
    ↓ area_id
FOLDERS (6)
    ↓ folder_id
DOCUMENTS (6)
```

### Seguimiento de Actividades
```
AREAS (6)
    ↓ area_id
PLAN_ACCION (10) ← Planificación estratégica
MATRIZ_SEGUIMIENTO (14) ← Ejecución y seguimiento
```

## 🎨 Códigos de Áreas

| Área | código | área_id (UUID) |
|------|--------|----------------|
| Calidad Educativa | `calidad-educativa` | e28654eb-216c-49cd-9a96-42366c097f12 |
| Inspección y Vigilancia | `inspeccion-vigilancia` | 502d6c5d-0a1e-43fa-85b7-ae91f7743f0d |
| Cobertura e Infraestructura | `cobertura-infraestructura` | 2d8bf8a1-0557-4974-8212-a2f4a93a4fb2 |
| Talento Humano | `talento-humano` | 15bb34b0-25eb-407f-9ce7-f781fcd04ecc |
| Planeación | `planeacion` | 5cc4bdc2-8c99-4ad3-a925-d9cbe91c4f24 |
| Despacho | `despacho` | d07c17e4-15f3-42c6-9f87-7cfca4d19ad9 |

## 🔄 Migración a Producción

Para usar estos datos en el sistema:

1. **Modo Offline (USE_SUPABASE=false)**
   - Los datos se importan desde `lib/datos-prueba.ts`
   - Mock client simula operaciones de base de datos
   - Ideal para desarrollo y demostración

2. **Migración a Supabase**
   - Usar script `scripts/migrate-data.ts`
   - Los datos se insertan en tablas reales
   - Sistema funciona 100% online

3. **Modo Híbrido**
   - Datos base en Supabase
   - Fallback a mock data si falla conexión
   - Mejor experiencia de usuario

## 📝 Convenciones

- **IDs**: Formato `[tipo]-[secuencial]` (ej: `pa-001`, `ms-014`)
- **Fechas**: ISO 8601 `YYYY-MM-DD` o `YYYY-MM-DDTHH:mm:ssZ`
- **UUIDs**: v4 para consistencia con Supabase
- **Códigos área**: kebab-case en URLs, SCREAMING_SNAKE_CASE en queries
- **Presupuestos**: String sin separadores (ej: `"12000000"`)
- **Porcentajes**: Número entero 0-100

## 🚀 Próximos Pasos

- [ ] Validar tipos TypeScript con interfaces
- [ ] Agregar más registros si se requiere
- [ ] Crear seeders para Supabase
- [ ] Documentar relaciones FK
- [ ] Tests de integridad de datos

---

**Última actualización**: Febrero 2026  
**Mantenedor**: Sistema de Gestión Educativa  
**Versión de datos**: 1.0.0
