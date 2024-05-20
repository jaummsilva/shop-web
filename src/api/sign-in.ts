import { api } from '@/lib/axios'

export interface SignInBody {
  email: string
  password: string
}

export async function signIn({ email, password }: SignInBody) {
  await api.post(
    '/session',
    { email, password },
    {
      withCredentials: true,
    },
  )
}
