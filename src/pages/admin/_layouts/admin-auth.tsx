import { ShoppingCart } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export function AdminAuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-2 antialiased">
      <div className="border-right flex h-full flex-col justify-between border-foreground/5 bg-muted p-10 text-muted-foreground">
        <div className="flex items-center gap-3 text-lg font-medium text-foreground">
          <ShoppingCart className="h-5 w-5" />
          <span className="fnt-semibold">shop</span>
        </div>
        <footer className="text-sm">
          Painel do parceiro &copy; shop - {new Date().getFullYear()}
        </footer>
      </div>
      <div className="relative flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
