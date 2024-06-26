import nookies from 'nookies'

import { api } from '@/lib/axios'

export interface UpdateUserStatusBody {
  userId: string
}

export async function deleteUser({ userId }: UpdateUserStatusBody) {
  const token = nookies.get(null).token_admin
  const response = await api.delete(`/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response
}
