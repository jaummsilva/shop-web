import { api } from '@/lib/axios'

export interface UpdateUserStatusBody {
  userId: string
}

export async function deleteUser({ userId }: UpdateUserStatusBody) {
  const response = await api.delete(`/user/${userId}`, {
    withCredentials: true,
  })
  return response
}
