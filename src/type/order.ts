import type { OrderItem } from './order-item'

export type Order = {
  id: string
  totalPrice: number
  userId: string | null // Change this to null if necessary
  userName: string | null // Change this to null if necessary
  createdAt: Date
  orderItems: OrderItem[]
}
