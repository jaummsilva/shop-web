import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 antialiased lg:grid-cols-2">
      <div className="border-right hidden h-full flex-col justify-between border-foreground/5 bg-muted text-muted-foreground lg:flex">
        <img
          src="/Capa-E-COMMERCE-1170x700.jpg"
          alt="Admin Login"
          className="h-full w-full overflow-hidden object-cover"
        />
      </div>
      <div className="relative flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
