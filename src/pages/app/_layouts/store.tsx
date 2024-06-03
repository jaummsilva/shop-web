import { Outlet } from 'react-router-dom'

import { StoreFooter } from '@/components/footer-store'
import { StoreHeader } from '@/components/header-store'

export function StoreLayout() {
  return (
    <div className="min-h-screen bg-white antialiased dark:bg-black">
      <StoreHeader />
      <div className="h-full gap-4 p-8 pt-6">
        <Outlet />
      </div>
      <StoreFooter />
    </div>
  )
}
