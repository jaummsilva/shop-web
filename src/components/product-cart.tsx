import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { clearProductFromCart } from '@/api/app/clear-product-from-cart'
import { getProduct, type GetProductResponse } from '@/api/app/get-product'
import { updateProductQuantityInCart } from '@/api/app/update-product-quantity-in-cart'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { env } from '@/env'
import { queryClient } from '@/lib/react-query'
import { formatPrice } from '@/utils/format-price'

interface CartItemProps {
  cartItem: { cartId: string; productId: string; quantity: number }
}

export default function ProductCart({ cartItem }: CartItemProps) {
  const [quantity, setQuantity] = useState(cartItem.quantity)

  const { data: product } = useQuery<GetProductResponse>({
    queryKey: ['store-products', cartItem.productId || ''],
    queryFn: () => getProduct({ productId: cartItem.productId || '' }),
  })

  const incrementQuantity = async () => {
    try {
      const response = await updateProductQuantityInCart({
        productId: cartItem.productId || '',
        type: 'INCREMENT',
      })

      if (response.status === 204) {
        await queryClient.invalidateQueries({
          queryKey: ['cart'],
        })
        setQuantity(quantity + 1)
      }
    } catch {}
  }

  const decrementQuantity = async () => {
    if (quantity > 1) {
      try {
        const response = await updateProductQuantityInCart({
          productId: cartItem.productId || '',
          type: 'DECREMENT',
        })

        if (response.status === 204) {
          await queryClient.invalidateQueries({
            queryKey: ['cart'],
          })
          setQuantity(quantity - 1)
        }
      } catch {}
    }
  }

  const [selectedPhotoPrincipal, setSelectedPhotoPrincipal] = useState<{
    file: File
    previewUrl: string
  }>({
    file: new File([], ''),
    previewUrl: '',
  })

  const handleClearProductFromCart = async () => {
    try {
      const response = await clearProductFromCart({
        productId: cartItem.productId || '',
      })

      if (response.status === 200) {
        await queryClient.invalidateQueries({
          queryKey: ['cart'],
        })
      }
    } catch {}
  }

  useEffect(() => {
    if (product && product.productImages.length > 0) {
      const principalImage = product.productImages.find(
        (img) => img.isPrincipal,
      )
      if (principalImage) {
        const imageUrl = principalImage.imageUrl
        setSelectedPhotoPrincipal({
          file: new File([], ''),
          previewUrl: env.VITE_API_URL.concat(imageUrl),
        })
      }
    }
  }, [product])

  return (
    <Card className="mb-4 w-full max-w-sm rounded-xl border">
      <div className="grid gap-4 p-4">
        <div className="flex justify-between">
          <div className="mt-2 flex h-40 justify-center overflow-auto">
            <img
              src={selectedPhotoPrincipal.previewUrl}
              alt="Foto Principal"
              className="rounded object-cover"
              style={{ maxWidth: '100%' }}
            />
          </div>
          <Button
            size="lg"
            variant="ghost"
            onClick={handleClearProductFromCart}
          >
            <X className="size-5"></X>
          </Button>
        </div>
        <div className="grid gap-2">
          <h3 className="text-sm font-semibold md:text-base">
            {product && product.name}
          </h3>
          <p className="text-sm font-semibold md:text-base">
            {product && formatPrice(product.price)}
          </p>
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
      </div>
    </Card>
  )
}
