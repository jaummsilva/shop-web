import nookies from 'nookies'

import { api } from '@/lib/axios'

export interface FetchOrdersByUserResponse {
  orders: {
    id: string
    totalPrice: number
    userId: string | null
    userName: string | null
    createdAt: Date
    orderItems: {
      id: string
      productId?: string
      orderId?: string
      quantity: number
      productPrice: number
      productName: string
      productImageUrl?: string
      totalPrice: number
    }[]
  }[]
}

export async function fetchOrdersByUser() {
  const token = nookies.get(null).token

  const response = await api.get<FetchOrdersByUserResponse>('/store/orders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
