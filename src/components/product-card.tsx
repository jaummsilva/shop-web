import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { addToCart } from '@/api/app/add-to-cart'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { env } from '@/env'
import { useAuth } from '@/hooks/use-auth'
import { queryClient } from '@/lib/react-query'
import type { Product } from '@/type/product'
import { formatPrice } from '@/utils/format-price'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [selectedPhotoPrincipal, setSelectedPhotoPrincipal] = useState<{
    file: File
    previewUrl: string
  }>({
    file: new File([], ''),
    previewUrl: '',
  })

  const incrementQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  async function handleAddToCart() {
    try {
      const response = await addToCart({
        productId: product.id,
        quantity,
      })

      if (response.status === 204) {
        toast.success('Item adicionado ao carrinho!')

        await queryClient.invalidateQueries({
          queryKey: ['cart'],
        })
      }
    } catch {
      toast.error('Erro ao colocar item no carrinho!')
    }
  }

  useEffect(() => {
    if (product.productImages.length > 0) {
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
    <Card className="mt-4 w-full max-w-xs rounded-xl border">
      <div className="grid gap-4 p-4">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-xl">
          <Link to={`/product/${product.id}`}>
            <img
              alt="Product image"
              className="aspect-[4/5] w-full border object-cover"
              src={selectedPhotoPrincipal.previewUrl}
            />
          </Link>
        </div>
        <div className="grid gap-4">
          <h3 className="text-sm font-semibold md:text-base">{product.name}</h3>
          <p className="text-sm font-semibold md:text-base">
            {formatPrice(product.price)}
          </p>
          <p className="text-sm md:text-base">{product.description ?? ''}</p>
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
        {isAuthenticated() ? (
          <Button size="sm" className="mt-2 w-full" onClick={handleAddToCart}>
            Adicione ao carrinho
          </Button>
        ) : (
          <p className="mt-2 w-full text-center text-sm text-gray-600">
            Faça login para adicionar ao carrinho
          </p>
        )}
      </div>
    </Card>
  )
}
