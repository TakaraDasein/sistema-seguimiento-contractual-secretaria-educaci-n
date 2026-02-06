****# Arquitectura de Datos del Sistema Educativo

## 📋 Resumen Ejecutivo

Este documento describe la arquitectura completa de datos del sistema de documentación y seguimiento educativo, incluyendo la estructura de base de datos, flujos de información y visualización de datos.

## 🏗️ Estructura General

El sistema está organizado por **6 áreas funcionales**:

1. **Calidad Educativa** (`CALIDAD_EDUCATIVA`)
2. **Inspección y Vigilancia** (`INSPECCION_VIGILANCIA`)
3. **Cobertura e Infraestructura** (`COBERTURA_INFRAESTRUCTURA`)
4. **Talento Humano** (`TALENTO_HUMANO`)
5. **Planeación** (`PLANEACION`)
6. **Despacho** (`DESPACHO`)

Cada área tiene su propio código único (UUID) y gestiona diferentes tipos de información.

## 📊 Módulos de Datos

### 1. Plan de Acción
**Ubicación**: `plan_accion` (tabla) / `MOCK_PLAN_ACCION` (datos demo)

**Estructura**:
```typescript
{
  id: string
  area_id: UUID
  programa: string
  objetivo: string
  meta: string
  presupuesto: string
  acciones: string
  indicadores: string
  porcentajeAvance: number
  fechaInicio: string
  fechaFin: string
  responsable: string
  estado: "Pendiente" | "En progreso" | "Completado" | "Cancelado"
  prioridad: "Alta" | "Media" | "Baja"
}
```

**Datos de Demostración**: 10 programas distribuidos entre las áreas
- 3 de Calidad Educativa
- 2 de Inspección y Vigilancia
- 3 de Cobertura e Infraestructura
- 2 de Talento Humano

**Visualización**: 
- Dashboard principal (tarjetas de estadísticas)
- Vista por área individual
- Gráficos de avance y presupuesto

---

### 2. Gestión Documental
**Ubicación**: `carpetas` + `documentos` (tablas) / `MOCK_FOLDERS` + `MOCK_DOCUMENTS` (datos demo)

**Estructura de Carpetas**:
```typescript
{
  id: string
  nombre: string
  area_id: UUID
  descripcion?: string
  color: string
  created_at: string
}
```

**Estructura de Documentos**:
```typescript
{
  id: string
  nombre: string
  descripcion: string
  fileUrl: string
  mimeType: string
  fileSize: number
  folderId: string
  created_at: string
}
```

**Datos de Demostración**: 
- 6 carpetas (una por área)
- 6 documentos (distribuidos en diferentes carpetas)

**Visualización**:
- Listado de carpetas por área
- Visor de documentos
- Reporte de documentos en Matriz de Seguimiento

---

### 3. Lista de Chequeo
**Ubicación**: `lista_chequeo_categorias` + `lista_chequeo_items` + `lista_chequeo_respuestas`

**Arquitectura de 3 capas**:

#### Capa 1: Categorías (Etapas)
```typescript
{
  id: string
  nombre: string
  area_id: UUID
  orden: number
}
```

**Datos de Demostración**: 8 categorías (2 por cada área principal)
- Calidad Educativa: "Documentación Institucional", "Gestión Académica"
- Inspección y Vigilancia: "Normatividad y Cumplimiento", "Control y Seguimiento"
- Cobertura e Infraestructura: "Infraestructura Física", "Acceso y Cobertura"
- Talento Humano: "Gestión Docente", "Capacitación y Desarrollo"

#### Capa 2: Items (Documentos)
```typescript
{
  id: string
  categoria_id: string
  nombre_documento: string
  descripcion: string
  orden: number
}
```

**Datos de Demostración**: 24 items (3 por categoría)
- Ejemplos: PEI, Manual de Convivencia, Licencia de Funcionamiento, Plan de Estudios, etc.

#### Capa 3: Respuestas (Verificaciones)
```typescript
{
  id: string
  item_id: string
  area_id: UUID
  respuesta: "SI" | "NO" | "NO_APLICA"
  observaciones: string
  fecha_verificacion: string
}
```

**Datos de Demostración**: 24 respuestas (una por cada item de las 4 áreas principales)
- Distribución: SI (70%), NO (20%), NO_APLICA (10%)

**Flujo de Consolidación**:
1. Se obtienen todas las categorías (8)
2. Se obtienen todos los items (24)
3. Para cada área:
   - Se busca el UUID del área usando su código
   - Se obtienen las respuestas filtradas por `area_id`
   - Se consolida la información por categoría > item > respuesta
4. Se visualiza en formato de etapas con documentos anidados

**Visualización**:
- Lista de Chequeo Consolidada (tab en Matriz de Seguimiento)
- Gráficos de cumplimiento por área
- Tabla de observaciones

---

### 4. Matriz de Seguimiento
**Ubicación**: `matriz_seguimiento` (tabla) / `MOCK_MATRIZ_SEGUIMIENTO` (datos demo)

**Estructura**:
```typescript
{
  id: string
  area_id: UUID
  actividad: string
  meta: string
  responsable: string
  fecha_inicio: string
  fecha_fin: string
  estado: "Pendiente" | "En progreso" | "Completado"
  avance: number (0-100)
  observaciones: string
  created_at: string
}
```

**Datos de Demostración**: 14 actividades distribuidas así:
- Calidad Educativa: 3 actividades
- Inspección y Vigilancia: 3 actividades
- Cobertura e Infraestructura: 4 actividades
- Talento Humano: 4 actividades

**Visualización**:
- Tabla general de seguimiento (tab principal)
- Línea de tiempo de actividades
- Filtros por área, estado, responsable

---

### 5. Registros Fotográficos
**Ubicación**: `photo_records` (tabla) / `MOCK_PHOTO_RECORDS` (datos demo)

**Estructura**:
```typescript
{
  id: string
  area_id: UUID
  categoria: string
  titulo: string
  descripcion: string
  fecha: string
  ubicacion: string
  participantes: number
  imageUrl: string
  created_at: string
}
```

**Datos de Demostración**: 10 registros con categorías variadas:
- Calidad Educativa: Capacitación, Evaluación
- Inspección y Vigilancia: Inspección, Verificación
- Cobertura e Infraestructura: Infraestructura, Mantenimiento, Matrícula
- Talento Humano: Capacitación, Reconocimiento, Inducción

**Visualización**:
- Galería de fotos por área
- Timeline de eventos con imágenes
- Filtros por categoría y fecha

---

## 🔄 Flujos de Datos

### Flujo 1: Dashboard Principal
```
1. Usuario accede a /dashboard
2. Sistema carga estadísticas de todas las áreas:
   - Total de programas del Plan de Acción
   - Presupuesto consolidado
   - Avance promedio
   - Distribución por estado
3. Renderiza tarjetas (StatsCards)
4. Muestra módulos de acceso rápido
5. Presenta vistas previas (analytics, reportes, timeline)
```

### Flujo 2: Matriz de Seguimiento Consolidada
```
1. Usuario accede a /dashboard/planeacion/matriz-seguimiento
2. Sistema carga 4 tabs:
   
   TAB 1 - Matriz General:
   - Consulta tabla matriz_seguimiento
   - Filtra por todas las áreas
   - Renderiza tabla con filtros interactivos
   
   TAB 2 - Lista de Chequeo:
   - Hook: useListaChequeoReal()
   - Paso 1: Consulta lista_chequeo_categorias
   - Paso 2: Consulta lista_chequeo_items
   - Paso 3: Para cada área (4 áreas):
     * Obtiene UUID del área desde tabla areas usando código
     * Consulta lista_chequeo_respuestas filtradas por area_id
     * Mapea respuestas a items
   - Paso 4: Consolida en estructura: etapas > documentos > respuestas
   - Renderiza con gráficos y filtros
   
   TAB 3 - Línea de Tiempo:
   - Consulta matriz_seguimiento ordenada por fecha
   - Renderiza timeline visual
   
   TAB 4 - Reporte de Documentos:
   - Consulta carpetas y documentos
   - Genera reporte consolidado
```

### Flujo 3: Vista Individual de Área
```
1. Usuario accede a /dashboard/[areaId]
2. Sistema identifica el área por su slug (ej: calidad-educativa)
3. Busca UUID del área en tabla areas usando código CALIDAD_EDUCATIVA
4. Filtra todos los datos por area_id:
   - Plan de acción
   - Documentos
   - Registros fotográficos
   - Actividades de matriz
5. Renderiza vista específica del área
```

---

## 🗂️ Mapeo de Códigos de Área

**Importante**: El sistema usa dos formatos de códigos:

### Formato en Base de Datos (campo `codigo`)
- `CALIDAD_EDUCATIVA`
- `INSPECCION_VIGILANCIA`
- `COBERTURA_INFRAESTRUCTURA`
- `TALENTO_HUMANO`
- `PLANEACION`
- `DESPACHO`

### Formato en URLs (slugs)
- `calidad-educativa`
- `inspeccion-vigilancia`
- `cobertura-infraestructura`
- `talento-humano`
- `planeacion`
- `despacho`

**Conversión**: Los hooks tienen un mapeo `areaCodeToName` que convierte el slug a código de BD antes de hacer consultas.

---

## 📈 Visualizaciones Principales

### 1. Dashboard Modular
- **Stats Cards**: Tarjetas con métricas clave
- **Module Cards**: Acceso rápido a cada área
- **Charts**: Gráficos de avance y distribución
- **Timeline Preview**: Vista previa de actividades

### 2. Matriz de Seguimiento
- **Tabla interactiva**: Con filtros, búsqueda y ordenamiento
- **Lista de Chequeo Consolidada**: 
  - Accordion por etapas (categorías)
  - Tabs de gráficos y observaciones
  - Indicadores visuales de cumplimiento (SI/NO/NO_APLICA)
- **Línea de Tiempo**: Timeline visual de actividades
- **Reporte de Documentos**: Listado de archivos por carpeta

### 3. Vistas por Área
- **Header del área**: Nombre, descripción, color
- **Navegación por tabs**: Plan de acción, documentos, fotos, matriz
- **Métricas específicas**: Estadísticas del área

---

## 🔧 Modo Offline (Demostración)

**Activación**: `USE_SUPABASE = false` en `lib/config.ts`

**Funcionamiento**:
1. Todos los datos provienen de `lib/datos-prueba.ts`
2. El cliente mock (`lib/mock-supabase-client.ts`) simula Supabase
3. Las consultas se resuelven filtrando arrays en memoria
4. No requiere conexión a base de datos
5. Ideal para demostraciones y desarrollo

**Datos Incluidos en Modo Demo**:
- 6 áreas completas con UUIDs
- 10 programas de plan de acción
- 6 carpetas y 6 documentos
- 8 categorías de checklist
- 24 items de checklist  
- 24 respuestas de checklist
- 14 actividades de matriz de seguimiento
- 10 registros fotográficos

---

## 📝 Convenciones y Mejores Prácticas

### IDs y Referencias
- **UUIDs**: Usados para `id`, `area_id`, `folder_id`, etc.
- **Códigos**: Formato `MAYUSCULAS_CON_GUION_BAJO` para códigos de área
- **Slugs**: Formato `minusculas-con-guion` para URLs

### Fechas
- **Formato**: ISO 8601 (`YYYY-MM-DD` o `YYYY-MM-DDTHH:mm:ssZ`)
- **Campos**: `created_at`, `fecha_inicio`, `fecha_fin`, `fecha_verificacion`

### Estados Estándar
- **Plan de Acción**: Pendiente, En progreso, Completado, Cancelado
- **Matriz**: Pendiente, En progreso, Completado
- **Checklist**: SI, NO, NO_APLICA

### Colores por Área
- Calidad Educativa: `orange`
- Inspección y Vigilancia: `blue`
- Cobertura e Infraestructura: `green`
- Talento Humano: `purple`
- Planeación: `gray`
- Despacho: `red`

---

## 🚀 Cómo Extender el Sistema

### Agregar un Nuevo Módulo de Datos

1. **Crear tipos TypeScript** en `types/`
2. **Agregar datos mock** en `lib/datos-prueba.ts`
3. **Actualizar mock client** en `lib/mock-supabase-client.ts`
4. **Crear hook personalizado** en `hooks/`
5. **Implementar componente de visualización** en `components/`
6. **Integrar en páginas** correspondientes en `app/`

### Agregar Datos de Demostración

1. Abrir `lib/datos-prueba.ts`
2. Agregar datos siguiendo la estructura existente
3. Asegurar UUIDs de área correctos
4. Mantener coherencia con fechas y relaciones
5. Incluir observaciones descriptivas

### Cambiar a Modo Producción

1. Configurar variables de entorno de Supabase
2. Cambiar `USE_SUPABASE = true` en `lib/config.ts`
3. Verificar tablas en base de datos
4. Migrar datos de demostración si es necesario
5. Probar todos los flujos de datos

---

## 📞 Soporte

Para más información sobre la arquitectura del sistema, consultar:
- `README.md` - Guía general del proyecto
- `MODO_OFFLINE.md` - Detalles del modo de demostración
- `DATOS_PRUEBA.md` - Documentación de datos mock
- Código fuente en `lib/`, `hooks/`, `components/`

---

**Fecha de Creación**: 5 de febrero de 2026  
**Versión del Sistema**: Demo Offline v1.0  
**Autor**: Sistema de Documentación Educativa
