import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SidebarNav from '@/components/sidebar-nav'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/use-auth'

import OrdersPage from './orders/page'
import ProfilePage from './profile/page'

const sidebarNavItems = [
  {
    title: 'Perfil',
    href: '/config/profile',
  },
  {
    title: 'Meus Pedidos',
    href: '/config/orders',
  },
]

export default function ConfigLayout() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [activeItem, setActiveItem] = useState<string>('/config/profile')

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleItemClick = (itemHref: string) => {
    setActiveItem(itemHref)
  }

  return (
    <div className="mb-24 mt-20 flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      <p className="text-muted-foreground">
        Organize suas configurações de conta e visualize seus pedidos
      </p>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav
            className=""
            items={sidebarNavItems}
            activeItem={activeItem}
            onItemClick={handleItemClick}
          />
        </aside>
        <div className="flex-1">
          {activeItem === '/config/profile' && <ProfilePage />}
          {activeItem === '/config/orders' && <OrdersPage />}
        </div>
      </div>
    </div>
  )
}
