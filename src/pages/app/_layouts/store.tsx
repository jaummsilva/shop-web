import { isAxiosError } from 'axios'
import nookies from 'nookies'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { StoreFooter } from '@/components/footer-store'
import { StoreHeader } from '@/components/header-store'
import { api } from '@/lib/axios'

export function StoreLayout() {
  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status

          if (status === 404) {
            nookies.destroy(undefined, 'token')
            window.location.reload()
          }
        }
      },
    )

    return () => {
      api.interceptors.response.eject(interceptorId)
    }
  })

  return (
    <div className="relative  min-h-screen flex-col antialiased">
      <StoreHeader />
      <div className="relative flex flex-1 flex-col gap-4 p-8 pt-6">
        <Outlet />
      </div>
      <StoreFooter />
    </div>
  )
}
