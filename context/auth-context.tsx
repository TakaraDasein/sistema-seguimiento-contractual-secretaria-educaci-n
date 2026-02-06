"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase-types"
import { USE_SUPABASE, MOCK_USER } from "@/lib/config"
import { createMockClient } from "@/lib/mock-supabase-client"

// Tipos
interface User {
  id: string
  name: string
  role: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Proveedor de autenticación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = USE_SUPABASE ? createClientComponentClient<Database>() : (createMockClient() as any)

  // Verificar si hay un usuario en la sesión de Supabase al cargar
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Si estamos en modo offline, usar usuario mock
        if (!USE_SUPABASE) {
          setUser(MOCK_USER)
          setLoading(false)
          return
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          setLoading(false)
          return
        }

        if (session?.user) {
          const authUser = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.email?.split("@")[0] || "Usuario",
            role: "USER",
          }

          try {
            const { data: userData, error: userError } = await supabase
              .from("usuarios")
              .select("nombre, rol")
              .eq("uuid", session.user.id)
              .single()

            if (!userError && userData) {
              authUser.name = userData.nombre || authUser.name
              if (userData.rol) {
                authUser.role = userData.rol
              }
            }
          } catch (error) {
            // Continuamos con los datos básicos del usuario
          }

          setUser(authUser)
        }

        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    // Suscribirse a cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Si estamos en modo offline, usar usuario mock
      if (!USE_SUPABASE && session?.user) {
        setUser(MOCK_USER)
        setLoading(false)
        return
      }

      if (session?.user && USE_SUPABASE) {
        const authUser = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.email?.split("@")[0] || "Usuario",
          role: "USER",
        }

        try {
          const { data: userData, error: userError } = await supabase
            .from("usuarios")
            .select("nombre, rol")
            .eq("uuid", session.user.id)
            .single()

          if (!userError && userData) {
            authUser.name = userData.nombre || authUser.name
            if (userData.rol) {
              authUser.role = userData.rol
            }
          }
        } catch (error) {
          // Continuamos con los datos básicos del usuario
        }

        setUser(authUser)
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    fetchUser()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Función de login con Supabase
  const login = async (email: string, password: string) => {
    // Si estamos en modo offline, simular login exitoso
    if (!USE_SUPABASE) {
      setUser(MOCK_USER)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }
  }

  // Función de logout con Supabase
  const logout = async () => {
    if (!USE_SUPABASE) {
      setUser(null)
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      // Error silencioso
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
