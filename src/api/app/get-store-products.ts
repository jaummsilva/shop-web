import { api } from '@/lib/axios'

export interface GetStoreProductsQuery {
  query?: string | null
}

export interface GetStoreProductsResponse {
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
}

export async function getStoreProducts({ query }: GetStoreProductsQuery) {
  const response = await api.get<GetStoreProductsResponse>('/store/products', {
    params: {
      query,
    },
  })

  return response.data
}
