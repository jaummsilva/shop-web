import nookies from 'nookies'

import { api } from '@/lib/axios'

export type GetProductResponse = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  description?: string
  price: number
  productImages: { imageUrl: string; isPrincipal: boolean }[]
}

export async function getProduct({ productId }: { productId: string }) {
  const token = nookies.get(null).token
  const response = await api.get<GetProductResponse>(
    `/store/product/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response.data
}
