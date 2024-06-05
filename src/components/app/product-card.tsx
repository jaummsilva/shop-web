import { Minus, Plus } from 'lucide-react'
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

import { Separator } from '../ui/separator'

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

  const MAX_DESCRIPTION_LENGTH = 50

  const truncatedDescription =
    product.description && product.description.length > MAX_DESCRIPTION_LENGTH
      ? product.description.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
      : product.description

  return (
    <Card className="mt-4 w-full max-w-xs rounded-xl border dark:bg-black">
      <div className="grid h-full grid-rows-[auto,1fr,auto] gap-4 p-6">
        <div className="flex items-center justify-center">
          <Link to={`/product/${product.id}`}>
            <div className="mt-2 flex h-24 justify-center overflow-auto">
              <img
                src={selectedPhotoPrincipal.previewUrl}
                alt="Foto Principal"
                className="rounded object-cover"
                style={{ maxWidth: '100%' }}
              />
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-start justify-between">
          <h3 className="text-sm font-semibold tracking-tighter md:text-base">
            <Link to={`/product/${product.id}`}>
              {product.name}
              <span className="text-sm text-muted-foreground">
                {truncatedDescription ? ` - ${truncatedDescription}` : ''}
              </span>
            </Link>
          </h3>
          <p className="mt-2 text-sm font-bold tracking-tighter text-blue-600 md:text-2xl">
            {formatPrice(product.price)}
          </p>
        </div>
        <Separator />
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-start gap-2">
            <Button size="xs" variant="default" onClick={decrementQuantity}>
              <Minus className="size-4" />
            </Button>
            <input
              type="text"
              value={quantity}
              className="text-md text-bold size-9 bg-transparent text-center text-black dark:text-white"
              readOnly
            />
            <Button size="xs" variant="default" onClick={incrementQuantity}>
              <Plus className="size-4" />
            </Button>
          </div>
          <div className="mt-2 flex justify-center">
            {isAuthenticated() ? (
              <Button
                variant="blue"
                size="sm"
                className="w-full tracking-tighter"
                onClick={handleAddToCart}
              >
                Adicionar ao carrinho
              </Button>
            ) : (
              <p className="w-full text-center text-sm tracking-tighter text-gray-600">
                Faça login para adicionar ao carrinho
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
