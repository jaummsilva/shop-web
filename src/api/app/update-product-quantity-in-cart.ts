import nookies from 'nookies'

import { api } from '@/lib/axios'

export interface UpdateProductQuantityInCartBody {
  productId: string
  type: 'INCREMENT' | 'DECREMENT'
}

export async function updateProductQuantityInCart({
  productId,
  type,
}: UpdateProductQuantityInCartBody) {
  const token = nookies.get(null).token

  const response = await api.put(
    '/store/cart',
    { type, productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}
