# 🎓 Sistema de Documentación y Seguimiento Educativo

Sistema integral para la gestión, documentación y seguimiento de actividades en secretarías de educación.

## 🚀 Inicio Rápido (Modo Demostración)

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Iniciar el sistema
```bash
pnpm dev
```

### 3. Acceder al sistema
```
URL: http://localhost:3000
Usuario: demostracion (PRECARGADO)
Contraseña: demo2026 (PRECARGADO)
```

⚡ **Las credenciales están precargadas** - Solo presiona "Iniciar Sesión"

¡Listo! El sistema funciona sin necesidad de configurar base de datos.

## 📋 Características

### Módulos Principales

- 📊 **Dashboard Ejecutivo**: Estadísticas y métricas en tiempo real
- 📝 **Plan de Acción**: Gestión de programas, objetivos y metas
- 📁 **Gestión Documental**: Organización de archivos por carpetas
- ✅ **Lista de Chequeo**: Verificación de cumplimiento normativo
- 📈 **Matriz de Seguimiento**: Tracking de actividades y avances
- 📸 **Registros Fotográficos**: Documentación visual de eventos
- 📑 **Reportes**: Generación de informes y exportación

### Áreas Educativas

1. **Calidad Educativa** (Orange)
2. **Inspección y Vigilancia** (Blue)
3. **Cobertura e Infraestructura** (Green)
4. **Talento Humano** (Purple)
5. **Planeación** (Gray)
6. **Despacho** (Red)

## 🎯 Modos de Operación

### Modo Demostración (Actual) ✅

- ✅ Sin base de datos
- ✅ Datos de prueba completos
- ✅ Login con validación
- ✅ 10 planes de acción de ejemplo
- ✅ 6 documentos y carpetas
- ✅ Todas las funcionalidades visuales

**Ideal para:**
- Desarrollo rápido
- Testing de interfaz
- Demostraciones a clientes
- Capacitación de usuarios

### Modo Producción (Supabase)

- 🔗 Conexión a Supabase
- 💾 Persistencia de datos
- 👥 Multi-usuario
- 🔄 Sincronización en tiempo real

## ⚙️ Configuración

### Cambiar entre modos

Edita `lib/config.ts`:

```typescript
// Modo Demostración (actual)
export const USE_SUPABASE = false

// Modo Producción
export const USE_SUPABASE = true
```

### Variables de Entorno (Solo para Producción)

Crea `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

## 📊 Datos de Demostración

El sistema incluye datos de prueba realistas:

| Tipo | Cantidad | Ubicación |
|------|----------|-----------|
| Planes de Acción | 10 | Todas las áreas |
| Documentos | 6 | 6 carpetas |
| Items de Chequeo | 9 | 5 categorías |
| Actividades Matriz | 4 | 4 áreas |
| Registros Fotográficos | 3 | 3 áreas |

**Presupuesto Total**: $180,500,000 COP  
**Avance Promedio**: 53%

Ver [DATOS_PRUEBA.md](DATOS_PRUEBA.md) para detalles completos.

## 🔑 Credenciales de Demostración

```
Usuario: demostracion
Contraseña: demo2026
```

⚡ **Las credenciales están PRECARGADAS en el formulario de login**  
Solo abre el navegador y presiona "Iniciar Sesión"

Estas credenciales funcionan **solo en modo demostración** (`USE_SUPABASE = false`).

## 📚 Documentación

- **[MODO_OFFLINE.md](MODO_OFFLINE.md)**: Guía completa del modo offline
- **[DATOS_PRUEBA.md](DATOS_PRUEBA.md)**: Detalle de datos de ejemplo
- **[lib/datos-prueba.ts](lib/datos-prueba.ts)**: Código fuente de datos

## 🛠️ Tecnologías

- **Framework**: Next.js 14 con App Router
- **UI**: React + TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Base de Datos**: Supabase (opcional)
- **Autenticación**: Supabase Auth (opcional)
- **Estado**: React Hooks
- **Gráficos**: Recharts
- **Exportación**: jsPDF

## 📁 Estructura del Proyecto

```
├── app/                    # Páginas y rutas de Next.js
│   ├── dashboard/         # Dashboard principal
│   ├── [areaId]/          # Páginas por área
│   └── api/               # API routes
├── components/            # Componentes React
│   ├── dashboard/        # Componentes del dashboard
│   ├── auth/             # Autenticación
│   └── ui/               # Componentes UI base
├── lib/                   # Utilidades y configuración
│   ├── config.ts         # ⚙️ Configuración principal
│   ├── datos-prueba.ts   # 📊 Datos de demostración
│   └── mock-supabase-client.ts # Cliente mock
├── hooks/                 # Custom React Hooks
├── types/                 # Definiciones TypeScript
├── constants/            # Constantes del sistema
└── context/              # Context providers
```

## 🔄 Flujo de Trabajo Recomendado

### Para Desarrollo

1. Usar modo demostración (`USE_SUPABASE = false`)
2. Desarrollar y probar UI
3. Usar datos de `lib/datos-prueba.ts`
4. No preocuparse por la base de datos

### Para Testing

1. Probar en modo demostración primero
2. Validar todas las funcionalidades
3. Verificar flujos de usuario
4. Luego probar con Supabase

### Para Producción

1. Cambiar a `USE_SUPABASE = true`
2. Configurar variables de entorno
3. Migrar datos si es necesario
4. Eliminar `lib/datos-prueba.ts`

## 🗑️ Limpiar Datos de Prueba

Cuando estés listo para producción:

```bash
# Eliminar archivo de datos de prueba
rm lib/datos-prueba.ts
```

Luego actualiza:
- `lib/config.ts`: `USE_SUPABASE = true`
- `lib/mock-supabase-client.ts`: Elimina imports de datos-prueba

## 🚦 Estados del Sistema

| Estado | Descripción | Configuración |
|--------|-------------|---------------|
| 🟢 Demostración | Sin BD, con datos de ejemplo | `USE_SUPABASE = false` |
| 🔵 Desarrollo | Con Supabase, datos de desarrollo | `USE_SUPABASE = true` |
| 🟣 Producción | Con Supabase, datos reales | `USE_SUPABASE = true` |

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Build de producción
pnpm build

# Iniciar producción
pnpm start

# Linting
pnpm lint

# Type checking
pnpm type-check
```

## 🎨 Personalización

### Agregar más datos de prueba

Edita `lib/datos-prueba.ts` y agrega nuevos items:

```typescript
export const MOCK_PLAN_ACCION = [
  ...existentes,
  {
    id: "pa-nuevo",
    programa: "Tu programa",
    // ... más campos
  }
]
```

### Agregar nuevas áreas

Edita `lib/config.ts`:

```typescript
export const MOCK_AREAS = [
  ...existentes,
  {
    id: "nueva-area-id",
    codigo: "nueva-area",
    nombre: "Nueva Área",
    color: "blue"
  }
]
```

## 🐛 Solución de Problemas

### Error: "Credenciales inválidas"

Verifica que estés usando:
- Usuario: `demostracion`
- Contraseña: `demo2026`

### No aparecen datos

Verifica que `USE_SUPABASE = false` en `lib/config.ts`

### Error de conexión a Supabase

Si `USE_SUPABASE = true`, verifica las variables de entorno

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Equipo

Desarrollado para Secretarías de Educación

---

**📌 Nota Importante**: Este sistema está configurado en modo demostración. Todos los datos son de ejemplo y NO se guardan permanentemente. Para uso en producción, configura Supabase según [MODO_OFFLINE.md](MODO_OFFLINE.md).

**🎯 Próximos Pasos**:
1. ✅ Explorar el sistema con datos de prueba
2. ✅ Familiarizarse con la interfaz
3. ⏭️ Decidir si usar Supabase o continuar offline
4. ⏭️ Configurar para producción cuando estés listo
