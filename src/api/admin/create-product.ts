import nookies from 'nookies'

import { api } from '@/lib/axios'

export async function createProduct(formData: FormData) {
  const token = nookies.get(null).token_admin

  const response = await api.post('/product', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
  return response
}
