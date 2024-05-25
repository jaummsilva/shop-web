import { api } from '@/lib/axios'

export interface UpdateProductStatusBody {
  productId: string
}

export async function deleteProduct({ productId }: UpdateProductStatusBody) {
  const response = await api.delete(`/product/${productId}`, {
    withCredentials: true,
  })
  return response
}
