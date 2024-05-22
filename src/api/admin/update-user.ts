import { api } from '@/lib/axios'

export async function updateUser(formData: FormData) {
  const response = await api.put('/user', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  })
  return response
}
