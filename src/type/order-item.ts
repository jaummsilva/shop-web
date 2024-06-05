export type OrderItem = {
  id: string
  productId?: string
  orderId?: string
  quantity: number
  productPrice: number
  productName: string
  productImageUrl?: string
  totalPrice: number
}
