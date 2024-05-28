import nookies from 'nookies'

import { api } from '@/lib/axios'

export type GetOrderResponse = {
  orderId: string
}

export async function registerOrder() {
  const token = nookies.get(null).token
  console.log(token)

  const response = await api.post<GetOrderResponse>(
    '/store/order',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}
