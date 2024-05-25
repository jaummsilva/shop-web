import { api } from '@/lib/axios'

export async function updateProduct(formData: FormData) {
  const response = await api.put('/product', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  })
  return response
}
