import { api } from '@/lib/axios'

export interface SignInBody {
  email: string
  password: string
  name: string
  phone: string
  birthdate: Date
  photoPath: File
  role: 'ADMIN' | 'MEMBER'
}

export async function createUser({
  email,
  password,
  name,
  birthdate,
  phone,
  photoPath,
  role,
}: SignInBody) {
  const response = await api.post(
    '/user',
    { email, password, name, phone, birthdate, photoPath, role },
    {
      withCredentials: true,
    },
  )
  return response
}
