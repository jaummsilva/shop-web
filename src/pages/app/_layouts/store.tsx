import { Outlet } from 'react-router-dom'

import { StoreFooter } from '@/components/footer-store'
import { StoreHeader } from '@/components/header-store'

export function StoreLayout() {
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
