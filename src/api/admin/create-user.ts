import { api } from '@/lib/axios'

export async function createUser(formData: FormData) {
  const response = await api.post('/user', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  })
  return response
}
