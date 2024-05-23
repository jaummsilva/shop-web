import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ProductCard() {
  const [quantity, setQuantity] = useState(1)

  const incrementQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <Card className="mt-4 w-full max-w-xs rounded-xl border">
      <div className="grid gap-4 p-4">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-xl">
          <img
            alt="Product image"
            className="aspect-[4/5] w-full border object-cover"
            src="public/Capa-E-COMMERCE-1170x700.jpg"
          />
        </div>
        <div className="grid gap-4">
          <h3 className="text-sm font-semibold md:text-base">
            Acme Circles T-Shirt
          </h3>
          <p className="text-sm font-semibold md:text-base">RS 22,90</p>
          <p className="text-sm md:text-base">PRODUTO TESTE</p>
        </div>
        <div className="flex items-center justify-center gap-1">
          <Button size="sm" onClick={decrementQuantity}>
            -
          </Button>
          <input
            type="text"
            value={quantity}
            className="size-9 w-12 rounded border text-center text-black"
            readOnly
          />
          <Button size="sm" onClick={incrementQuantity}>
            +
          </Button>
        </div>
        <Button size="sm" className="mt-2 w-full">
          Adicione ao carrinho
        </Button>
      </div>
    </Card>
  )
}
