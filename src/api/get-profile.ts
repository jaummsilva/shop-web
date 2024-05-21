import nookies from 'nookies'

import { api } from '@/lib/axios'

export async function getProfile() {
  const token = nookies.get(null).token

  const response = await api.get<{
    user: {
      name: string
      email: string
      role: 'ADMIN' | 'MEMBER'
    }
  }>('/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response
}
