import nookies from 'nookies'

import { api } from '@/lib/axios'

export async function updateProduct(formData: FormData) {
  const token = nookies.get(null).token_admin

  const response = await api.put('/product', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
  return response
}
