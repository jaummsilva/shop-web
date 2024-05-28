import nookies from 'nookies'

import { api } from '@/lib/axios'

export interface GetProductsQuery {
  pageIndex?: number | null
  name?: string | null
  perPage?: number | null
}

export interface GetProductsResponse {
  products: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    description?: string
    price: number
    productImages: {
      imageUrl: string
      isPrincipal: boolean
    }[]
  }[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getProducts({
  name,
  pageIndex: page,
  perPage,
}: GetProductsQuery) {
  const token = nookies.get(null).token_admin

  const response = await api.get<GetProductsResponse>('/products', {
    params: {
      page,
      name,
      perPage,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
