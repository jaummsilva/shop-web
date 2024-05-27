import type { CartItem } from './cart-item'

export type Cart = {
  id: string
  status: 'ABERTO' | 'FECHADO'
  totalItems: number
  totalPrice: number
  cartItems: CartItem[]
}
