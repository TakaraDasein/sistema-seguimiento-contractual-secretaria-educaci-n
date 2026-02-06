import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase-types"
import { USE_SUPABASE } from "./config"
import { createMockClient } from "./mock-supabase-client"

// Crear una instancia única del cliente de Supabase para reutilizarla
// Si USE_SUPABASE está en false, usa el cliente mock
export const supabaseClient = USE_SUPABASE
  ? createClientComponentClient<Database>()
  : (createMockClient() as any)
