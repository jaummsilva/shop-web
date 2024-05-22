import nookies from 'nookies'

import { api } from '@/lib/axios'

export interface GetUsersQuery {
  userId: string
}

export async function getUserImage({ userId }: GetUsersQuery) {
  const token = nookies.get(null).token

  const response = await api.get('/user/get-image', {
    params: {
      userId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
