// Cliente mock de Supabase para modo offline
// Este archivo simula las operaciones de Supabase usando datos locales

import { MOCK_USER, MOCK_AREAS, DEMO_CREDENTIALS } from "./config"
import {
  MOCK_PLAN_ACCION,
  MOCK_FOLDERS,
  MOCK_DOCUMENTS,
  MOCK_CHECKLIST_CATEGORIAS,
  MOCK_CHECKLIST_ITEMS,
  MOCK_CHECKLIST_RESPUESTAS,
  MOCK_MATRIZ_SEGUIMIENTO,
  MOCK_PHOTO_RECORDS,
} from "./datos-prueba"

// Simulación de storage local
const mockStorage = {
  data: new Map<string, any>(),
}

// Helper para simular delay de red
const delay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock de QueryBuilder
class MockQueryBuilder {
  private table: string
  private selectFields: string = "*"
  private filters: Array<{ field: string; op: string; value: any }> = []
  private orderField: string | null = null
  private isSingle: boolean = false

  constructor(table: string) {
    this.table = table
  }

  select(fields: string = "*") {
    this.selectFields = fields
    return this
  }

  eq(field: string, value: any) {
    this.filters.push({ field, op: "eq", value })
    return this
  }

  order(field: string) {
    this.orderField = field
    return this
  }

  single() {
    this.isSingle = true
    return this
  }

  async insert(data: any) {
    await delay()
    const key = `${this.table}_${Date.now()}`
    mockStorage.data.set(key, { ...data, id: key })

    return { data: { ...data, id: key }, error: null }
  }

  async update(data: any) {
    await delay()
    return { data, error: null }
  }

  async delete() {
    await delay()
    return { data: null, error: null }
  }

  async execute() {
    await delay()

    // Función helper para aplicar filtros
    const applyFilters = (results: any[]) => {
      let filtered = results
      this.filters.forEach((filter) => {
        if (filter.op === "eq") {
          filtered = filtered.filter((item: any) => item[filter.field] === filter.value)
        }
      })
      return filtered
    }

    // Simular consultas según la tabla
    if (this.table === "areas") {
      let results = [...MOCK_AREAS]
      results = applyFilters(results)

      if (this.orderField) {
        results.sort((a: any, b: any) => {
          return a[this.orderField!] > b[this.orderField!] ? 1 : -1
        })
      }

      if (this.isSingle) {
        return { data: results[0] || null, error: null }
      }

      return { data: results, error: null }
    }

    if (this.table === "usuarios") {
      const users = [MOCK_USER]
      let results = applyFilters(users)

      if (this.isSingle) {
        return { data: results[0] || null, error: null }
      }

      return { data: results, error: null }
    }

    // Plan de Acción
    if (this.table === "plan_accion") {
      let results = [...MOCK_PLAN_ACCION]
      results = applyFilters(results)

      if (this.orderField) {
        results.sort((a: any, b: any) => {
          return a[this.orderField!] > b[this.orderField!] ? 1 : -1
        })
      }

      if (this.isSingle) {
        return { data: results[0] || null, error: null }
      }

      return { data: results, error: null }
    }

    // Carpetas (Folders)
    if (this.table === "carpetas") {
      let results = [...MOCK_FOLDERS]
      results = applyFilters(results)

      if (this.isSingle) {
        return { data: results[0] || null, error: null }
      }

      return { data: results, error: null }
    }

    // Documentos
    if (this.table === "documentos") {
      let results = [...MOCK_DOCUMENTS]
      results = applyFilters(results)

      if (this.isSingle) {
        return { data: results[0] || null, error: null }
      }

      return { data: results, error: null }
    }

    // Lista de Chequeo - Categorías
    if (this.table === "lista_chequeo_categorias") {
      let results = [...MOCK_CHECKLIST_CATEGORIAS]
      results = applyFilters(results)

      if (this.isSingle) {
        return { data: results[0] || null, error: null }
      }

      return { data: results, error: null }
    }

    // Lista de Chequeo - Items
    if (this.table === "lista_chequeo_items") {
      let results = [...MOCK_CHECKLIST_ITEMS]
      results = applyFilters(results)

      if (this.isSingle) {
        return { data: results[0] || null, error: null }
      }

      return { data: results, error: null }
    }

    // Lista de Chequeo - Respuestas
    if (this.table === "lista_chequeo_respuestas") {
      let results = [...MOCK_CHECKLIST_RESPUESTAS]
      results = applyFilters(results)

      if (this.isSingle) {
        return { data: results[0] || null, error: null }
      }

      return { data: results, error: null }
    }

    // Matriz de Seguimiento
    if (this.table === "matriz_seguimiento") {
      let results = [...MOCK_MATRIZ_SEGUIMIENTO]
      results = applyFilters(results)

      if (this.orderField) {
        results.sort((a: any, b: any) => {
          return a[this.orderField!] > b[this.orderField!] ? 1 : -1
        })
      }

      if (this.isSingle) {
        return { data: results[0] || null, error: null }
      }

      return { data: results, error: null }
    }

    // Registros Fotográficos
    if (this.table === "registros_fotograficos" || this.table === "photo_records") {
      let results = [...MOCK_PHOTO_RECORDS]
      results = applyFilters(results)

      if (this.isSingle) {
        return { data: results[0] || null, error: null }
      }

      return { data: results, error: null }
    }

    // Para otras tablas, retornar array vacío
    console.warn(`Tabla mock no implementada: ${this.table}`)
    return { data: this.isSingle ? null : [], error: null }
  }

  // Alias de execute para compatibilidad
  then(resolve: any, reject?: any) {
    return this.execute().then(resolve, reject)
  }
}

// Mock de AuthBuilder
class MockAuthBuilder {
  async getSession() {
    await delay()
    return {
      data: {
        session: {
          user: {
            id: MOCK_USER.id,
            email: MOCK_USER.email,
          },
        },
      },
      error: null,
    }
  }

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    await delay()

    // Validar credenciales de demostración
    // En modo demo, aceptamos el email
    const isValidEmail = email === DEMO_CREDENTIALS.email
    const isValidPassword = password === DEMO_CREDENTIALS.password

    if (!isValidEmail || !isValidPassword) {
      return {
        data: {
          user: null,
          session: null,
        },
        error: {
          message: "Credenciales inválidas. Email: 'demostracion@sistema.edu', Contraseña: 'demo2026'",
          status: 400,
        },
      }
    }

    // Login exitoso
    return {
      data: {
        user: {
          id: MOCK_USER.id,
          email: MOCK_USER.email,
        },
        session: {
          access_token: "mock-token",
        },
      },
      error: null,
    }
  }

  async signOut() {
    await delay()
    return { error: null }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Simular autenticación inicial
    setTimeout(() => {
      callback("SIGNED_IN", {
        user: {
          id: MOCK_USER.id,
          email: MOCK_USER.email,
        },
      })
    }, 100)

    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }
  }
}

// Mock de Channel
class MockChannel {
  on(...args: any[]) {
    return this
  }

  subscribe() {
    return this
  }

  unsubscribe() {
    // En modo mock, no hay nada que desuscribir
    return Promise.resolve()
  }
}

// Mock del cliente de Supabase
export class MockSupabaseClient {
  auth: MockAuthBuilder

  constructor() {
    this.auth = new MockAuthBuilder()
  }

  from(table: string) {
    return new MockQueryBuilder(table)
  }

  channel(name: string) {
    return new MockChannel()
  }

  removeChannel(channel: any) {
    // No hacer nada
  }
}

// Crear instancia del cliente mock
export const createMockClient = () => {
  return new MockSupabaseClient()
}
