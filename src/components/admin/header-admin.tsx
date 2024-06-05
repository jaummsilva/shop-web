import { Home, ListChecks, User, UtensilsCrossed } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useWindowSize } from '@/hooks/use-window-size'

import { NavLink } from '../nav-link'
import { ThemeToggle } from '../theme/theme-toggle'
import { Separator } from '../ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { AdminAccountMenu } from './admin-account-menu'

const navLinks = [
  { to: '/admin', icon: <Home className="h-6 w-6" />, text: 'Início' },
  {
    to: '/admin/products',
    icon: <UtensilsCrossed className="h-6 w-6" />,
    text: 'Produtos',
  },
  {
    to: '/admin/orders',
    icon: <ListChecks className="h-6 w-6" />,
    text: 'Pedidos',
  },
  { to: '/admin/users', icon: <User className="h-6 w-6" />, text: 'Usuários' },
]

export function AdminHeader() {
  const [isSheetOpen, setIsSheetOpen] = useState(false) // State to control sheet open/close
  const windowSize = useWindowSize()

  useEffect(() => {
    if (windowSize.width > 1024) {
      setIsSheetOpen(false)
    }
  }, [windowSize.width])

  const toggleSidebar = () => {
    setIsSheetOpen(!isSheetOpen)
  }

  return (
    <div className="border-bottom">
      <div className="flex h-16 items-center gap-2 px-6">
        <button className="mr-4 lg:hidden" onClick={toggleSidebar}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isSheetOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
        <p className="hidden text-2xl text-blue-700 lg:block">ADMIN</p>
        <Separator orientation="vertical" className="h-6" />

        <nav className="ml-2 hidden items-center space-x-4 lg:flex lg:space-x-6">
          {navLinks.map((link, index) => (
            <NavLink key={index} to={link.to}>
              {link.icon} {link.text}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex cursor-pointer items-center gap-2">
          <ThemeToggle />
          <AdminAccountMenu />
        </div>
      </div>

      {/* Sidebar */}
      {isSheetOpen && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-5 flex flex-col gap-2">
              <NavLink to="/admin">
                <Home className="h-6 w-6" /> Início
              </NavLink>
              <Separator />
              <NavLink to="/admin/products">
                <UtensilsCrossed className="h-6 w-6" /> Produtos
              </NavLink>
              <Separator />
              <NavLink to="/admin/users">
                <User className="h-6 w-6" /> Usuários
              </NavLink>
            </nav>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
