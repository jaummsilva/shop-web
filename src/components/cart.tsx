import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'

import ProductCart from './product-cart'
import { Button } from './ui/button'
import { Dialog } from './ui/dialog'
import { Sheet, SheetContent } from './ui/sheet'

export function Cart({ itemCount = 0 }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const toggleSheet = () => {
    setIsSheetOpen(!isSheetOpen)
  }

  const handleFinalizePurchase = () => {
    // Lógica para finalizar a compra
    console.log('Compra finalizada!')
    // Aqui você pode adicionar a lógica para fechar o sheet, se necessário
    setIsSheetOpen(false)
  }

  return (
    <div className="relative">
      <Button type="button" variant="ghost" onClick={toggleSheet}>
        <ShoppingCart className="h-6 w-6" />
      </Button>
      <span className="absolute right-0 top-1 inline-flex -translate-y-1/2 translate-x-1/4 transform items-center justify-center rounded-full bg-blue-600 px-2 py-1 text-xs font-bold leading-none text-red-100">
        {itemCount}
      </span>

      {/* Renderizar o Sheet quando isSheetOpen for true */}
      {isSheetOpen && (
        <Dialog>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent className="overflow-auto">
              {/* Conteúdo do Sheet */}
              <div className="">
                <h2 className="text-s mb-4 text-xl font-bold">
                  Seu carrinho de compras
                </h2>
                <ProductCart />
                <ProductCart />
                <ProductCart />
                <ProductCart />
              </div>

              {/* Adicionando z-index à div com o botão Finalizar Compra */}
              <div className="fixed bottom-0 z-50 mb-8 bg-black">
                <div className="flex justify-center">
                  <Button
                    onClick={handleFinalizePurchase}
                    variant="success"
                    className="w-[320px]"
                  >
                    Finalizar Compra
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </Dialog>
      )}
    </div>
  )
}
