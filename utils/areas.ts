// Mapeo de IDs de área a slugs
export const AREA_SLUGS: Record<string, string> = {
  "ce7f1e0a-4eb6-4a0e-8c5a-c4da4f4e6b0a": "calidad-educativa",
  "d8b9e3c1-5a7b-4c8d-9f6e-8d7a9b0c5d4e": "inspeccion-vigilancia",
  "f6c8d7e6-5a4b-3c2d-1e0f-9a8b7c6d5e4f": "cobertura-infraestructura",
  "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d": "talento-humano",
  "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e": "planeacion",
  "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f": "despacho",
}

// Mapeo de slugs a IDs de área
export const SLUG_TO_AREA_IDS: Record<string, string> = {
  "calidad-educativa": "ce7f1e0a-4eb6-4a0e-8c5a-c4da4f4e6b0a",
  "inspeccion-vigilancia": "d8b9e3c1-5a7b-4c8d-9f6e-8d7a9b0c5d4e",
  "cobertura-infraestructura": "f6c8d7e6-5a4b-3c2d-1e0f-9a8b7c6d5e4f",
  "talento-humano": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  planeacion: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
  despacho: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f",
}

// Función para obtener el slug de un área por su ID
export function getAreaSlug(areaId: string): string {
  return AREA_SLUGS[areaId] || "area-desconocida"
}

// Función para obtener el ID de un área por su slug
export function getAreaIdFromSlug(slug: string): string | null {
  return SLUG_TO_AREA_IDS[slug] || null
}

// Función para obtener el color de clase basado en el color
export function getColorClass(color: string): string {
  switch (color) {
    case "orange":
      return "bg-orange-500"
    case "blue":
      return "bg-blue-500"
    case "green":
      return "bg-green-500"
    case "purple":
      return "bg-purple-500"
    case "yellow":
      return "bg-yellow-500"
    case "red":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}
