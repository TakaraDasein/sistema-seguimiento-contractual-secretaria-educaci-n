# Sistema de Gestión Documental

## 📁 Visión General

El sistema de gestión documental permite organizar, almacenar y acceder a documentos institucionales organizados por áreas y carpetas. Este módulo es fundamental para centralizar la información de la Secretaría de Educación.

## 🏗️ Arquitectura de Carpetas y Documentos

### Estructura Database

```sql
-- Tabla: carpetas
CREATE TABLE carpetas (
  id UUID PRIMARY KEY,
  nombre VARCHAR,
  area_id UUID REFERENCES areas(id),
  descripcion TEXT,
  color VARCHAR,
  created_at TIMESTAMP
);

-- Tabla: documentos  
CREATE TABLE documentos (
  id UUID PRIMARY KEY,
  nombre VARCHAR,
  descripcion TEXT,
  fileUrl VARCHAR,
  mimeType VARCHAR,
  fileSize INTEGER,
  folderId UUID REFERENCES carpetas(id),
  created_at TIMESTAMP
);
```

### Relaciones

```
areas (1) ──→ (*) carpetas ──→ (*) documentos
```

- Un área puede tener **múltiples carpetas**
- Una carpeta contiene **múltiples documentos**
- Un documento pertenece a **una sola carpeta**

## 📂 Datos de Demostración

### Carpetas por Área

#### 1. Calidad Educativa
```javascript
{
  id: "folder-001",
  nombre: "Documentos PEI 2026",
  area_id: "e28654eb-216c-49cd-9a96-42366c097f12",
  descripcion: "Proyecto Educativo Institucional y documentos relacionados",
  color: "orange"
}
```

**Documentos incluidos**:
- PEI Institucional 2026.pdf
- Manual de Convivencia Actualizado 2026.pdf

#### 2. Inspección y Vigilancia
```javascript
{
  id: "folder-002",
  nombre: "Licencias y Permisos",
  area_id: "502d6c5d-0a1e-43fa-85b7-ae91f7743f0d",
  descripcion: "Documentos legales de funcionamiento",
  color: "blue"
}
```

**Documentos incluidos**:
- Resolución Licencia Funcionamiento 2026.pdf

#### 3. Cobertura e Infraestructura
```javascript
{
  id: "folder-003",
  nombre: "Proyectos Infraestructura",
  area_id: "2d8bf8a1-0557-4974-8212-a2f4a93a4fb2",
  descripcion: "Planos, presupuestos y avances de obras",
  color: "green"
}
```

**Documentos incluidos**:
- Proyecto Construcción Aulas Rurales.pdf
- Informe SIMAT Matrícula 2026.xlsx

#### 4. Talento Humano
```javascript
{
  id: "folder-004",
  nombre: "Formación Docente",
  area_id: "15bb34b0-25eb-407f-9ce7-f781fcd04ecc",
  descripcion: "Planes de capacitación y certificados",
  color: "purple"
}
```

**Documentos incluidos**:
- Plan de Capacitación Docente 2026.pdf

#### 5. Planeación
```javascript
{
  id: "folder-005",
  nombre: "Plan de Desarrollo",
  area_id: "05f3dac0-933e-46f8-aa80-f7c7c0a906c1",
  descripcion: "Documentos de planeación estratégica",
  color: "gray"
}
```

#### 6. Despacho
```javascript
{
  id: "folder-006",
  nombre: "Actas y Resoluciones",
  area_id: "9850c4bd-119a-444d-831f-21410bbbaf8b",
  descripcion: "Documentos oficiales de despacho",
  color: "red"
}
```

## 📄 Tipos de Documentos Soportados

### Documentos de Oficina
- **PDF**: `.pdf` (application/pdf)
- **Word**: `.doc`, `.docx` (application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document)
- **Excel**: `.xls`, `.xlsx` (application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
- **PowerPoint**: `.ppt`, `.pptx` (application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation)

### Imágenes
- **JPG/JPEG**: `.jpg`, `.jpeg` (image/jpeg)
- **PNG**: `.png` (image/png)
- **GIF**: `.gif` (image/gif)

### Otros
- **Texto**: `.txt` (text/plain)
- **CSV**: `.csv` (text/csv)
- **ZIP**: `.zip` (application/zip)

## 🔄 Flujo de Gestión Documental

### 1. Crear Carpeta

```typescript
// Componente que usa el hook
const { createFolder } = useDocuments(areaId)

// Datos de la nueva carpeta
const newFolder = {
  nombre: "Mi Nueva Carpeta",
  descripcion: "Descripción de la carpeta",
  area_id: areaId,
  color: "blue"
}

// Crear en la base de datos
await createFolder(newFolder)
```

### 2. Subir Documento

```typescript
// Paso 1: Usuario selecciona archivo
<input type="file" onChange={handleFileSelect} />

// Paso 2: Preparar metadata
const documentData = {
  nombre: file.name,
  descripcion: "Documento importante",
  fileUrl: uploadedUrl, // URL del archivo en storage
  mimeType: file.type,
  fileSize: file.size,
  folderId: selectedFolderId
}

// Paso 3: Guardar en base de datos
await createDocument(documentData)
```

### 3. Listar Documentos

```typescript
// Hook personalizado
const { documents, folders, loading } = useDocuments(areaId)

// Renderizar
{folders.map(folder => (
  <Folder key={folder.id} data={folder}>
    {documents
      .filter(doc => doc.folderId === folder.id)
      .map(doc => (
        <Document key={doc.id} data={doc} />
      ))
    }
  </Folder>
))}
```

### 4. Descargar/Ver Documento

```typescript
// Opción A: Descargar
<a href={document.fileUrl} download={document.nombre}>
  Descargar
</a>

// Opción B: Ver en modal (solo PDFs)
const handleView = (doc) => {
  if (doc.mimeType === 'application/pdf') {
    openPdfViewer(doc.fileUrl)
  } else {
    window.open(doc.fileUrl, '_blank')
  }
}
```

### 5. Eliminar Documento

```typescript
const { deleteDocument } = useDocuments(areaId)

const handleDelete = async (documentId) => {
  // Confirmar
  if (confirm('¿Eliminar documento?')) {
    // Eliminar de storage (si aplica)
    await deleteFromStorage(document.fileUrl)
    
    // Eliminar de base de datos
    await deleteDocument(documentId)
  }
}
```

## 📊 Visualización en Matriz de Seguimiento

### Tab de Reporte de Documentos

La Matriz de Seguimiento incluye un tab dedicado que consolida todos los documentos:

```typescript
// Componente: DocumentosReport
- Agrupa por área
- Lista carpetas con documentos
- Muestra metadatos: tamaño, fecha, tipo
- Permite filtrar y buscar
- Exporta reporte a PDF/Excel
```

**Información Mostrada**:
- Nombre del documento
- Carpeta contenedora
- Área responsable
- Tamaño del archivo (MB)
- Fecha de creación
- Tipo de archivo (ícono visual)
- Acciones: Ver, Descargar, Eliminar

## 🎨 Componentes de UI

### DocumentCard
```tsx
<DocumentCard
  title="PEI 2026.pdf"
  description="Documento maestro institucional"
  fileSize={3456789}
  mimeType="application/pdf"
  createdAt="2026-01-15"
  onView={() => {}}
  onDownload={() => {}}
  onDelete={() => {}}
/>
```

### FolderView
```tsx
<FolderView
  folder={folderData}
  documents={documentsInFolder}
  onAddDocument={() => {}}
  onDeleteFolder={() => {}}
/>
```

### DocumentGrid
```tsx
<DocumentGrid
  documents={documents}
  viewMode="grid" | "list"
  sortBy="name" | "date" | "size"
  filterBy="mimeType"
/>
```

## 🔐 Permisos y Seguridad

### Control de Acceso por Rol

```typescript
// Usuario ADMIN
- Crear, editar, eliminar carpetas
- Subir, modificar, eliminar documentos
- Acceso a todas las áreas

// Usuario COORDINADOR_AREA
- Acceso solo a su área asignada
- Subir y modificar documentos de su área
- No puede eliminar carpetas

// Usuario DOCENTE
- Solo lectura
- Descarga permitida
- No puede modificar
```

### Validaciones de Archivos

```typescript
// Tamaño máximo
MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

// Tipos permitidos
ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.ms-excel',
  'image/jpeg',
  'image/png'
]

// Validación
const validateFile = (file) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Archivo muy grande')
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Tipo no permitido')
  }
  return true
}
```

## 📈 Métricas y Reportes

### Estadísticas Documentales

```typescript
// Por área
{
  totalDocumentos: 6,
  totalCarpetas: 6,
  tamañoTotal: "18.5 MB",
  documentoReciente: "2026-02-01",
  tiposArchivos: {
    pdf: 4,
    xlsx: 1,
    docx: 1
  }
}

// Global
{
  totalDocumentos: 36,
  totalCarpetas: 24,
  tamañoTotal: "245.8 MB",
  porArea: {...}
}
```

### Generación de Reportes

```typescript
// Reporte PDF
const generatePDFReport = async (areaId?) => {
  // Obtener datos
  const data = await fetchDocumentsReport(areaId)
  
  // Generar PDF
  const pdf = await createPDF({
    title: "Reporte de Documentos",
    data: data,
    template: "documentos-template"
  })
  
  // Descargar
  pdf.download("reporte-documentos.pdf")
}

// Reporte Excel
const generateExcelReport = async () => {
  const workbook = createWorkbook()
  const sheet = workbook.addSheet("Documentos")
  
  // Agregar datos
  docs.forEach((doc, i) => {
    sheet.addRow([
      doc.nombre,
      doc.carpeta,
      doc.area,
      formatFileSize(doc.fileSize),
      formatDate(doc.created_at)
    ])
  })
  
  // Descargar
  workbook.download("documentos.xlsx")
}
```

## 🚀 Mejoras Futuras

### Funcionalidades Pendientes
- [ ] Versionado de documentos
- [ ] Historial de cambios
- [ ] Comentarios y anotaciones
- [ ] Compartir enlaces públicos temporales
- [ ] Búsqueda de texto completo (OCR)
- [ ] Previsualización de archivos Office
- [ ] Integración con firma digital
- [ ] Colaboración en tiempo real

### Optimizaciones
- [ ] Compresión automática de PDFs
- [ ] Miniaturas de documentos
- [ ] Caché de archivos frecuentes
- [ ] Carga lazy de documentos grandes
- [ ] CDN para distribución de archivos

## 📞 Integración con Otros Módulos

### Con Plan de Acción
- Adjuntar documentos de soporte a cada programa
- Referenciar evidencias documentales

### Con Lista de Chequeo
- Asociar documentos verificados
- Generar certificados de cumplimiento

### Con Registros Fotográficos
- Almacenar imágenes de alta resolución
- Organizar por evento/actividad

## 🛠️ Comandos Útiles

```bash
# Listar documentos en consola
pnpm db:list-documents

# Generar reporte de uso de storage
pnpm storage:report

# Limpiar documentos huérfanos
pnpm db:clean-orphans

# Sincronizar metadata de archivos
pnpm storage:sync
```

---

**Última Actualización**: 5 de febrero de 2026  
**Módulo**: Gestión Documental  
**Responsable**: Sistema de Documentación Educativa
