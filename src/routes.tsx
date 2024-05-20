import { createBrowserRouter } from 'react-router-dom'

import { AdminLayout } from './pages/admin/_layouts/admin'
import { AdminAuthLayout } from './pages/admin/_layouts/admin-auth'
import { AdminSignIn } from './pages/admin/auth/sign-in'
import { Products } from './pages/admin/products/products'
import { NotFound } from './pages/app/404'
import { Error } from './pages/app/error'

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <Error />,
    children: [{ path: 'products', element: <Products /> }],
  },
  {
    path: '/admin',
    element: <AdminAuthLayout />,
    children: [{ path: 'sign-in', element: <AdminSignIn /> }],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
