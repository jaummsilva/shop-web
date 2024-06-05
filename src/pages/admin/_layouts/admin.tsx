import { isAxiosError } from 'axios'
import { jwtDecode } from 'jwt-decode'
import nookies from 'nookies'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { AdminHeader } from '@/components/admin/header-admin'
import { api } from '@/lib/axios'

interface DecodedToken {
  role: string
}

export function AdminLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = nookies.get(null).token_admin
    const decodedToken = jwtDecode<DecodedToken>(token)
    if (decodedToken.role !== 'ADMIN') {
      navigate('/admin/sign-in')
    }
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status

          if (status === 401) {
            nookies.destroy(undefined, 'token_admin')
            navigate('/admin/sign-in')
          }
        }
      },
    )

    return () => {
      api.interceptors.response.eject(interceptorId)
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen w-full flex-col bg-white antialiased dark:bg-black">
      <AdminHeader />
      <div className="flex w-full flex-1 flex-col gap-4 p-8 pt-6">
        <Outlet />
      </div>
    </div>
  )
}
