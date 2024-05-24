import { api } from '@/lib/axios'

export async function createProduct(formData: FormData) {
  const response = await api.post('/product', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  })
  return response
}
