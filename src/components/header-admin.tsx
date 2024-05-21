import { Home, Pizza, User, UtensilsCrossed } from 'lucide-react'

import { AccountMenu } from './account-menu'
import { NavLink } from './nav-link'
import { ThemeToggle } from './theme/theme-toggle'
import { Separator } from './ui/separator'

export function AdminHeader() {
  return (
    <div className="border-bottom">
      <div className="flex h-16 items-center gap-6 px-6">
        <p className="text-2xl text-rose-700">ADMIN</p>
        <Pizza className="h-6 w-6" />

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/admin">
            <Home className="h-6 w-6" /> Inicio
          </NavLink>
          <NavLink to="/admin/products">
            <UtensilsCrossed className="h-6 w-6" /> Produtos
          </NavLink>
          <NavLink to="/admin/users">
            <User className="h-6 w-6" /> Usuarios
          </NavLink>
        </nav>
        <div className="ml-auto flex cursor-pointer items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}
