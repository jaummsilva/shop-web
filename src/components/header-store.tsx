import { BaggageClaim, Store } from 'lucide-react'

import { AccountMenu } from './account-menu'
import { NavLink } from './nav-link'
import { ThemeToggle } from './theme/theme-toggle'
import { Input } from './ui/input'
import { Separator } from './ui/separator'

export function StoreHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-gray-200 bg-white dark:bg-black">
      <div className="flex h-full flex-row items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <NavLink to="/">
              <Store className="h-6 w-6" />
            </NavLink>
            <Separator orientation="vertical" className="h-6" />
            <NavLink to="/products">
              <BaggageClaim className="h-6 w-6" /> Produtos
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center justify-center text-start">
          <Input
            type="text"
            placeholder="Pesquise por produtos"
            className="border-gray-950 px-20 text-start text-gray-950 dark:border-white"
          />
        </div>
        <div className="flex cursor-pointer items-center gap-4">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </header>
  )
}
