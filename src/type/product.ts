export type Product = {
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
}
