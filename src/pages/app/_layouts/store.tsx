import { Outlet } from 'react-router-dom'

import { StoreHeader } from '@/components/header-store'

export function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <StoreHeader />
      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
        <Outlet />
      </div>
    </div>
  )
}
