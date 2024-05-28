import nookies from 'nookies'

import { api } from '@/lib/axios'

export interface UpdateProductStatusBody {
  productId: string
}

export async function deleteProduct({ productId }: UpdateProductStatusBody) {
  const token = nookies.get(null).token_admin
  const response = await api.delete(`/product/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response
}
