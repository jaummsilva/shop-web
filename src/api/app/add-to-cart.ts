import nookies from 'nookies'

import { api } from '@/lib/axios'

export interface AddToCartBody {
  productId: string
  quantity: number
}

export async function addToCart({ productId, quantity }: AddToCartBody) {
  const token = nookies.get(null).token

  const response = await api.post(
    '/store/cart',
    { productId, quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    },
  )

  return response
}
