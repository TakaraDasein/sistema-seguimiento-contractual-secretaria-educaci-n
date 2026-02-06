# 📊 Datos de Demostración - Guía Rápida

## 🔑 Acceso Rápido

```
Usuario: demostracion
Contraseña: demo2026
```

⚡ **¡PRECARGADAS automáticamente!**  
Solo abre el navegador y presiona "Iniciar Sesión"

## 📦 ¿Qué incluye?

Este sistema cuenta con datos de prueba completos que permiten ver el sistema funcionando con información realista:

### Contenido por Módulo:

| Módulo | Cantidad | Descripción |
|--------|----------|-------------|
| **Planes de Acción** | 10 items | Distribuidos en todas las áreas educativas |
| **Documentos** | 6 archivos | PDFs, Excel, Word de ejemplo |
| **Carpetas** | 6 carpetas | Organizadas por categoría y área |
| **Lista de Chequeo** | 9 items | Categorías y respuestas de verificación |
| **Matriz de Seguimiento** | 4 actividades | Con fechas y responsables |
| **Registros Fotográficos** | 3 registros | Eventos documentados |
| **Áreas** | 6 áreas | Todas las áreas del sistema |

### Estadísticas Disponibles:

- 💰 **Presupuesto Total**: $180,500,000 COP
- 📈 **Avance Promedio**: 53%
- ✅ **Estados**: 8 en progreso, 1 pendiente, 1 completado
- 📁 **Total Archivos**: 6 documentos en 6 carpetas

## 🎯 Áreas con Datos

### 1️⃣ Calidad Educativa (Orange)
- Mejoramiento Académico (65% avance)
- Evaluación Curricular (40% avance)
- 2 carpetas de documentos
- 1 registro fotográfico

### 2️⃣ Inspección y Vigilancia (Blue)
- Supervisión Institucional (32% avance)
- Control Documental (78% avance)
- 2 carpetas (Informes, Licencias)
- 1 registro fotográfico

### 3️⃣ Cobertura e Infraestructura (Green)
- Ampliación Cobertura Rural (55% avance)
- Mantenimiento Infraestructura (20% avance)
- 1 carpeta de proyectos
- 1 registro fotográfico

### 4️⃣ Talento Humano (Purple)
- Capacitación Docente (85% avance)
- Bienestar Laboral (45% avance)
- 1 carpeta de capacitaciones

### 5️⃣ Planeación (Gray)
- Plan Educativo Municipal (60% avance)

### 6️⃣ Despacho (Red)
- Gestión Administrativa (50% avance)

## 🚀 Cómo Usar

1. **Abrir el sistema** en http://localhost:3000
2. **Las credenciales están PRECARGADAS** - Solo presionar "Iniciar Sesión"
3. **Explorar el dashboard** para ver estadísticas generales
4. **Navegar por áreas** para ver datos específicos
5. **Revisar planes de acción** con presupuestos y avances
6. **Consultar documentos** organizados en carpetas
7. **Ver listas de chequeo** con items verificados

## 📝 Ejemplos de Datos

### Plan de Acción Completo:
```
Programa: Mejoramiento Académico
Objetivo: Incrementar el rendimiento académico estudiantil
Meta: Aumentar 15% en pruebas estandarizadas
Presupuesto: $25,000,000
Acciones: Capacitación docente, tutorías, material didáctico
Avance: 65%
Estado: En progreso
Responsable: María González
Fechas: 15/01/2026 - 30/06/2026
```

### Documento Ejemplo:
```
Nombre: Plan de Mejoramiento Académico 2026.pdf
Descripción: Plan detallado de mejoramiento para el año 2026
Tipo: PDF
Tamaño: 2.4 MB
Carpeta: Proyectos Académicos 2026
```

### Actividad Matriz:
```
Actividad: Jornada pedagógica docentes primaria
Meta: 100% docentes primaria capacitados
Responsable: María González
Avance: 100% - Completado
Observaciones: Jornada exitosa, alta participación
```

## 🔧 Configuración Actual

El sistema está configurado para usar datos de prueba:
- ✅ `USE_SUPABASE = false` en `lib/config.ts`
- ✅ Validación de credenciales activa
- ✅ Datos completos cargados en `lib/datos-prueba.ts`

## 🗑️ Eliminar Datos de Prueba

Cuando quieras usar el sistema en producción:

### Opción 1: Mantener estructura, limpiar datos
```typescript
// En lib/datos-prueba.ts
export const MOCK_PLAN_ACCION = []
export const MOCK_FOLDERS = []
export const MOCK_DOCUMENTS = []
// ... etc
```

### Opción 2: Eliminar completamente
1. Elimina `lib/datos-prueba.ts`
2. En `lib/mock-supabase-client.ts`:
   ```typescript
   // Eliminar: import { ... } from "./datos-prueba"
   // Actualizar método execute() para retornar []
   ```
3. Cambia a `USE_SUPABASE = true`

### Opción 3: Usar Supabase real
```typescript
// En lib/config.ts
export const USE_SUPABASE = true
```

## 💡 Tips

- **Desarrollo**: Usa datos de prueba para desarrollo rápido sin BD
- **Testing**: Prueba funcionalidades sin afectar datos reales
- **Demostración**: Muestra el sistema a stakeholders con datos realistas
- **Capacitación**: Entrena usuarios con ejemplos concretos

## 📍 Ubicación de Archivos

```
lib/
├── config.ts              # Configuración y credenciales
├── datos-prueba.ts        # ← TODOS LOS DATOS DE PRUEBA
└── mock-supabase-client.ts # Cliente que usa los datos
```

## ⚠️ Importante

- Los datos NO se guardan entre sesiones
- Los cambios son solo en memoria
- Ideal para demostración y desarrollo
- Eliminar antes de producción

## 🎓 Datos Educativos Realistas

Todos los datos están basados en:
- ✅ Normatividad educativa colombiana
- ✅ Procesos reales de secretarías de educación
- ✅ Métricas y KPIs comunes del sector
- ✅ Presupuestos representativos
- ✅ Fechas y cronogramas lógicos

---

**¿Necesitas más datos de ejemplo?**  
Edita `lib/datos-prueba.ts` y agrega nuevos items siguiendo la estructura existente.
