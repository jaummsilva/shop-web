import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'

export function AdminAuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-2 antialiased">
      <Helmet>
        <title>Admin</title>
      </Helmet>
      <div className="border-right flex h-full flex-col justify-between border-foreground/5 bg-muted text-muted-foreground">
        <img
          src="/imagem_admin_login.jpg"
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
