import nookies from 'nookies'

import { api } from '@/lib/axios'

export interface GetOrdersQuery {
  pageIndex?: number | null
  query?: string | null
  perPage?: number | null
}

export interface GetOrdersResponse {
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
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function fetchOrders({
  query,
  pageIndex: page,
  perPage,
}: GetOrdersQuery) {
  const token = nookies.get(null).token_admin

  const response = await api.get<GetOrdersResponse>('/orders', {
    params: {
      page,
      query,
      perPage,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
