import { useQuery } from '@tanstack/react-query'
import { BaggageClaim, Home, Store, UtensilsCrossed } from 'lucide-react'
import { useEffect, useState } from 'react'

import { getProfile } from '@/api/get-profile'
import { useWindowSize } from '@/hooks/use-window-size'

import { AccountMenu } from './account-menu'
import { Cart } from './cart'
import { NavLink } from './nav-link'
import { ThemeToggle } from './theme/theme-toggle'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet'

export function StoreHeader() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    refetchOnWindowFocus: false,
  })

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
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-gray-200 bg-white dark:bg-black">
      <div className="lg-px-6 flex h-full flex-row items-center justify-between px-3">
        <div className="flex items-center gap-6">
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
          <nav className="ml-2 hidden items-center space-x-4 lg:flex lg:space-x-6">
            <NavLink to="/">
              <Store className=" h-6 w-6" />
            </NavLink>
            <Separator orientation="vertical" className="h-6" />
            <NavLink to="/products">
              <BaggageClaim className="h-6 w-6" /> Produtos
            </NavLink>
          </nav>
        </div>
        <div className="hidden items-center justify-center text-start lg:flex">
          <Input
            type="text"
            placeholder="Pesquise por produtos"
            className="border-gray-950 px-20 text-start text-gray-950 dark:border-white"
          />
        </div>
        <div className="flex cursor-pointer items-center gap-4">
          <ThemeToggle />
          {profile ? <Cart itemCount={0} /> : null}
          <AccountMenu />
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
              <NavLink to="/products">
                <UtensilsCrossed className="h-6 w-6" /> Produtos
              </NavLink>
              <Separator />
            </nav>
          </SheetContent>
        </Sheet>
      )}
    </header>
  )
}
