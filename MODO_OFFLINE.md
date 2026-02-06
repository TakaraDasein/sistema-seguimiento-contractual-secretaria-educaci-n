# Sistema Educativo - Modo Offline con Datos de Demostración

## 📋 Descripción

Este sistema ahora puede funcionar **con o sin conexión a Supabase**. La configuración es simple y permite trabajar en modo offline usando **datos de prueba completos** que dan un panorama real del sistema.

## 🔑 Credenciales de Demostración

Para acceder al sistema en modo offline, utiliza estas credenciales:

```
Usuario: demostracion
Contraseña: demo2026
```

**O también:**

```
Email: demostracion@sistema.edu
Contraseña: demo2026
```

⚡ **¡Credenciales PRECARGADAS!**  
Los campos de login ya contienen estas credenciales por defecto. Solo presiona "Iniciar Sesión".

> ⚠️ **Importante**: Estas credenciales solo funcionan cuando `USE_SUPABASE = false`

## 🔧 Configuración

### Activar/Desactivar Supabase

Edita el archivo `lib/config.ts`:

```typescript
// Cambiar USE_SUPABASE a false para trabajar sin conexión a Supabase
export const USE_SUPABASE = false  // ← Cambiar aquí
```

### Opciones:

- **`USE_SUPABASE = true`**: Conecta a Supabase (requiere credenciales válidas)
- **`USE_SUPABASE = false`**: Modo offline con datos mock locales **(configuración actual)**

## 🎯 Modo Offline

Cuando `USE_SUPABASE = false`, el sistema:

### ✅ Funcionalidades Disponibles

1. **Autenticación con Validación**
   - Usuario: `demostracion`
   - Contraseña: `demo2026`
   - Rol: ADMIN
   - Validación de credenciales activa

2. **Datos de Prueba Completos**
   - ✅ **10 Planes de Acción** distribuidos en todas las áreas
   - ✅ **6 Carpetas** organizadas por área
   - ✅ **6 Documentos** de ejemplo (PDF, Excel, Word)
   - ✅ **5 Categorías de Chequeo** con sus items
   - ✅ **4 Respuestas de Lista de Chequeo**
   - ✅ **4 Registros de Matriz de Seguimiento**
   - ✅ **3 Registros Fotográficos**
   - ✅ **6 Áreas Educativas** con toda su información

3. **Datos Realistas por Área**

  Los cambios NO se guardan de forma permanente (solo en memoria durante la sesión)
- No hay sincronización en tiempo real
- Los datos son de ejemplo predefinidos en `lib/datos-prueba.ts`
- No se pueden cargar archivos reales
- Las operaciones CRUD simulan éxito pero no persisten

## 👤 Usuario de Demostración

**Credenciales obligatorias:**
```
Usuario: demostracion
Contraseña: demo2026
```

**Perfil del usuario:**
- **Nombre**: Usuario Demostración
- **Email**: demostracion@sistema.edu
- **Rol**: ADMIN
- **ID**: mock-user-id

> 💡 **Nota**: En modo offline, las credenciales se validan. Si ingresas datos incorrectos, recibirás un error con las credenciales correctas.e capacitaciones

   **Planeación:**
   - 1 plan de acción (Plan Educativo Municipal)

   **Despacho:**
   - 1 plan de acción (Gestión Administrativa)

4. **Estadísticas Calculadas**
   - Presupuesto total: $180,500,000
   - Avance promedio: 53%
   - Estados: En progreso (8), Pendiente (1), Completado (1)
   - Total documentos: 6
   - Total carpetas: 6

5. **Interfaz Completa**
   - Dashboard principal con estadísticas reales
   - Navegación entre áreas funcionando
   - Visualización de todos los módulos
   - Gráficos con datos de ejemplo
   - Componentes UI totalmente activos

### ⚠️ Limitaciones en Modo Offline

- No se guardan cambios de forma permanente
- No hay sincronización en tiempo real
- Datos de ejemplo predefinidos
- No se pueden agregar/editar documentos reales

## 👤 Usuario Mock Predefinido

Cuando estás en modo offline, puedes usar cualquier credencial:

```
Email: cualquier@correo.com
Contraseña: cualquier-contraseña
```

El sistema te autenticará automáticamente como:
- **Nombre**: Usuario Demo
- **Email**: demo@sistema.edu
- **Rol**: ADMIN

## 🗂️ Áreas Mock Disponibles

1. **Calidad Educativa** (código: calidad-educativa)
2. **Inspección y Vigilancia** (código: inspeccion-vigilancia)
3. **Cobertura e Infraestructura** (código: cobertura-infraestructura)
4. **Talento Humano** (código: talento-humano)
5. **Planeación** (código: planeacion)
6. **Despacho** (código: despacho)

## 🔄 Reconectar a Supabase

Para volver a usar Supabase:

1. Edita `lib/config.ts`
2. Cambia `USE_SUPABASE = true`
3. Asegúrate de tener las variables de entorno configuradas:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📝 Archivos Modificados
 y Datos
- `lib/config.ts` - Configuración principal y credenciales
- `lib/datos-prueba.ts` - **NUEVO** - Datos completos de demostración
- `lib/mock-supabase-client.ts` - Cliente mock con soporte para todas las tablas
- `lib/supabase-client.ts` - Cliente con soporte offline

### Datos Incluidos en `lib/datos-prueba.ts`
- ✅ 10 Planes de Acción con presupuestos reales
- ✅ 6 Carpetas categorizadas
- ✅ 6 Documentos (simulados)
- ✅ 5 Categorías de lista de chequeo
- ✅ 5 Items de chequeo
- ✅ 4 Respuestas de chequeo
- ✅ 4 Actividades de matriz de seguimiento
- ✅ 3 Registros fotográficos
- ✅ Función de cálculo de estadísticas

### Contexto y Auth
- `context/auth-context.tsx` - Autenticación con modo offline

### Hooks
- `hooks/use-areas.ts`
- `hooks/use-filtered-matriz.ts`
- `hooks/use-lista-chequeo-store.ts`
- `hooks/use-lista-chequeo-real.ts`
- `hooks/use-lista-chequeo-consolidado.ts`
- `hooks/use-matriz-seguimiento.ts`

### Componentes
- `components/auth/login-form.tsx` - Login con validación

### Componentes
- `components/auth/login-form.tsx` - Login con soporte offline
 del navegador
2. **Datos Iniciales**: Los datos de prueba están definidos en `lib/datos-prueba.ts`
3. **Extensiones**: Puedes agregar más datos mock según necesites
4. **Testing**: Perfecto para pruebas sin necesidad de conexión a internet
5. **Credenciales**: Las credenciales se validan en modo offline
6. **Eliminación**: El archivo `lib/datos-prueba.ts` puede eliminarse en producción

## 🗑️ Eliminar Datos de Prueba

Para eliminar los datos de prueba cuando ya no los necesites:

1. Elimina el archivo: `lib/datos-prueba.ts`
2. En `lib/mock-supabase-client.ts`, elimina las importaciones de datos de prueba
3. Actualiza el método `execute()` para retornar arrays vacíos
4. Opcionalmente, cambia `USE_SUPABASE = true` para usar Supabase real

## 📊 Ejemplo de Datos Incluidos

### Plan de Acción de Ejemplo:
```typescript
{
  programa: "Mejoramiento Académico",
  objetivo: "Incrementar el rendimiento académico estudiantil",
  meta: "Aumentar 15% en pruebas estandarizadas",
  presupuesto: "25000000",
  porcentajeAvance: 65,
  estado: "En progreso",
  responsable: "María González"
}
```

### Documento de Ejemplo:
```typescript
{
  name: "Plan de Mejoramiento Académico 2026.pdf",
  description: "Plan detallado de mejoramiento para el año 2026",
  fileType: "application/pdf",
  fileSize: 2456789
}
```
```typescript
export const USE_SUPABASE = false  // Desarrollo sin dependencias externas
```

### Para Producción
```typescript
export const USE_SUPABASE = true   // Producción con Supabase
```

## 💡 Notas Importantes

1. **Persistencia**: En modo offline, los cambios NO se guardan entre sesiones
2. **Datos Iniciales**: Los datos mock están definidos en `lib/config.ts`
3. **Extensiones**: Puedes agregar más datos mock según necesites
4. **Testing**: Útil para pruebas sin necesidad de conexión a internet

## 🔍 Debugging

Si encuentras problemas:

1. Verifica que `USE_SUPABASE` esté configurado correctamente
2. Revisa la consola del navegador para errores
3. Asegúrate de que todos los archivos estén actualizados
4. En modo Supabase, verifica las credenciales de conexión

## 📞 Soporte

Para más información o problemas, revisa:
- Código fuente en `lib/mock-supabase-client.ts`
- Configuración en `lib/config.ts`
- Implementación mock de operaciones CRUD
