import nookies from 'nookies'

import { api } from '@/lib/axios'

export async function clearItemsFromCart() {
  const token = nookies.get(null).token

  const response = await api.post('/store/cart/clear', {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response
}
