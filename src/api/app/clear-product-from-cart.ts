import nookies from 'nookies'

import { api } from '@/lib/axios'

export interface ClearProductFromCartBody {
  productId: string
}

export async function clearProductFromCart({
  productId,
}: ClearProductFromCartBody) {
  const token = nookies.get(null).token

  const response = await api.post(
    '/store/cart/product/clear',
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}
