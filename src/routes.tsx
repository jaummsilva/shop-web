import { createBrowserRouter } from 'react-router-dom'

import { AdminLayout } from './pages/admin/_layouts/admin'
import { AdminNotFound } from './pages/admin/404'
import { AdminAuthLayout } from './pages/admin/auth'
import { AdminSignIn } from './pages/admin/auth/sign-in'
import { Products } from './pages/admin/products/products'
import { UsersPage } from './pages/admin/users/page'
import { StoreLayout } from './pages/app/_layouts/store'
import { NotFound } from './pages/app/404'
import { AuthLayout } from './pages/app/auth'
import { SignIn } from './pages/app/auth/sign-in'
import { Error } from './pages/app/error'

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <Error />,
    children: [
      { path: 'products', element: <Products /> },
      { path: 'users', element: <UsersPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminAuthLayout />,
    errorElement: <Error />,
    children: [{ path: 'sign-in', element: <AdminSignIn /> }],
  },
  {
    path: '/',
    element: <StoreLayout />,
    errorElement: <Error />,
  },
  {
    path: '/sign-in',
    element: <AuthLayout />,
    children: [{ path: '', element: <SignIn /> }],
  },
  {
    path: '/admin/*',
    element: <AdminNotFound />,
  },
  {
    path: '/*',
    element: <NotFound />,
  },
])
