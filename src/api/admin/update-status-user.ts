import nookies from 'nookies'

import { api } from '@/lib/axios'

export interface UpdateUserStatusBody {
  userId: string
  status: 'S' | 'N'
}

export async function updateUserStatus({
  userId,
  status,
}: UpdateUserStatusBody) {
  const token = nookies.get(null).token_admin

  const response = await api.put(
    '/user/status',
    { userId, status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response
}
