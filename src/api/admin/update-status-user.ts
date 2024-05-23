import { api } from '@/lib/axios'

export interface UpdateUserStatusBody {
  userId: string
  status: 'S' | 'N'
}

export async function updateUserStatus({
  userId,
  status,
}: UpdateUserStatusBody) {
  const response = await api.put(
    '/user/status',
    { userId, status },
    {
      withCredentials: true,
    },
  )
  return response
}
