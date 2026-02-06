// Configuración del sistema
// Cambiar USE_SUPABASE a false para trabajar sin conexión a Supabase
export const USE_SUPABASE = false

// Configuración de modo offline
export const OFFLINE_MODE = !USE_SUPABASE

// Usuario mock para modo offline (credenciales de demostración)
export const MOCK_USER = {
  id: "mock-user-id",
  name: "Usuario Demostración",
  role: "ADMIN",
  email: "demostracion@sistema.edu",
}

// Credenciales de acceso por defecto para demostración
export const DEMO_CREDENTIALS = {
  username: "demostracion@sistema.edu",
  password: "demo2026",
  email: "demostracion@sistema.edu",
}

// Áreas mock para modo offline
export const MOCK_AREAS = [
  {
    id: "e28654eb-216c-49cd-9a96-42366c097f12",
    codigo: "CALIDAD_EDUCATIVA",
    nombre: "Calidad Educativa",
    descripcion: "Gestión de calidad educativa",
    color: "orange",
  },
  {
    id: "502d6c5d-0a1e-43fa-85b7-ae91f7743f0d",
    codigo: "INSPECCION_VIGILANCIA",
    nombre: "Inspección y Vigilancia",
    descripcion: "Control y supervisión educativa",
    color: "blue",
  },
  {
    id: "2d8bf8a1-0557-4974-8212-a2f4a93a4fb2",
    codigo: "COBERTURA_INFRAESTRUCTURA",
    nombre: "Cobertura e Infraestructura",
    descripcion: "Infraestructura y cobertura",
    color: "green",
  },
  {
    id: "15bb34b0-25eb-407f-9ce7-f781fcd04ecc",
    codigo: "TALENTO_HUMANO",
    nombre: "Talento Humano",
    descripcion: "Gestión del talento humano",
    color: "purple",
  },
  {
    id: "05f3dac0-933e-46f8-aa80-f7c7c0a906c1",
    codigo: "PLANEACION",
    nombre: "Planeación",
    descripcion: "Planeación estratégica",
    color: "gray",
  },
  {
    id: "9850c4bd-119a-444d-831f-21410bbbaf8b",
    codigo: "DESPACHO",
    nombre: "Despacho",
    descripcion: "Gestión de despacho",
    color: "red",
  },
]
