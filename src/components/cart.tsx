import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { clearItemsFromCart } from '@/api/app/clear-items-from-cart'
import { queryClient } from '@/lib/react-query'
import type { Cart } from '@/type/cart'
import { formatPrice } from '@/utils/format-price'

import ProductCart from './product-cart'
import { Button } from './ui/button'
import { Dialog } from './ui/dialog'
import { Sheet, SheetContent, SheetFooter } from './ui/sheet'

interface CartProps {
  cart: Cart | null
  itemCount: number
  priceTotal: number
}

export function Cart({ cart, itemCount, priceTotal }: CartProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const toggleSheet = () => {
    setIsSheetOpen(!isSheetOpen)
  }

  const handleFinalizePurchase = () => {
    console.log('Compra finalizada!')
    setIsSheetOpen(false)
  }

  async function handleClearItemsFromCart() {
    try {
      const response = await clearItemsFromCart()

      if (response.status === 200) {
        toast.success('Itens removidos com sucesso!')

        await queryClient.invalidateQueries({
          queryKey: ['cart'],
        })
      }
    } catch {
      toast.error('Erro ao remover itens do carrinho!')
    }
  }

  return (
    <div className="relative">
      <Button type="button" variant="ghost" onClick={toggleSheet}>
        <ShoppingCart className="h-6 w-6" />
      </Button>

      <span className="absolute right-0 top-1 inline-flex -translate-y-1/2 translate-x-1/4 transform items-center justify-center rounded-full bg-blue-600 px-2 py-1 text-xs font-bold leading-none text-red-100">
        {itemCount ?? 0}
      </span>

      {isSheetOpen && (
        <Dialog>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent className="flex flex-col">
              <div className="flex-grow overflow-auto">
                <h2 className="text-s mb-4 text-xl font-bold">
                  Seu carrinho de compras
                </h2>
                {cart && cart.cartItems.length > 0 ? (
                  cart.cartItems.map((cartItem, index) => (
                    <ProductCart cartItem={cartItem} key={index} />
                  ))
                ) : (
                  <p className="text-gray-500">Seu carrinho está vazio.</p>
                )}
              </div>
              <SheetFooter className="sticky bottom-0 border-t border-muted bg-transparent">
                {cart && cart.cartItems.length > 0 && (
                  <div className="flex flex-col justify-center gap-5 p-4">
                    <div className="flex items-start justify-between">
                      <p className="text-xl font-semibold text-muted-foreground">
                        Preço Total:
                      </p>
                      <p className="text-xl font-semibold text-muted-foreground">
                        {formatPrice(priceTotal)}
                      </p>
                    </div>
                    <div className="flex gap-5">
                      <Button
                        onClick={handleFinalizePurchase}
                        variant="success"
                        className="w-full"
                      >
                        Finalizar Compra
                      </Button>
                      <Button
                        onClick={handleClearItemsFromCart}
                        variant="destructive"
                        className="w-full"
                      >
                        Limpar Carrinho
                      </Button>
                    </div>
                  </div>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Dialog>
      )}
    </div>
  )
}
