import nookies from 'nookies'

import { api } from '@/lib/axios'

export type GetCartResponse = {
  id: string
  status: 'ABERTO' | 'FECHADO'
  totalItems: number
  totalPrice: number
  cartItems: {
    cartId: string
    productId: string
    quantity: number
  }[]
}

export async function getCart() {
  const token = nookies.get(null).token

  const response = await api.get<GetCartResponse>('/store/cart', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
