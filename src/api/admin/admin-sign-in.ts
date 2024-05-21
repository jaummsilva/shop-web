import { api } from '@/lib/axios'

export interface SignInBody {
  email: string
  password: string
}

export async function adminSignIn({ email, password }: SignInBody) {
  const response = await api.post(
    '/admin/session',
    { email, password },
    {
      withCredentials: true,
    },
  )
  return response
}
