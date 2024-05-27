// hooks/useAuth.ts
import nookies from 'nookies'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(
    nookies.get(undefined).token ?? null,
  )

  const login = (token: string) => {
    setToken(token)
    nookies.set(undefined, 'token', token, {
      maxAge: 60 * 60, // 1 hour
      path: '/',
    })
    navigate('/')
  }

  const logout = () => {
    setToken(null)
    nookies.destroy(undefined, 'token')
    window.location.reload() // Reload the entire page
  }

  const isAuthenticated = () => {
    return token !== null
  }

  return {
    token,
    login,
    logout,
    isAuthenticated,
  }
}
