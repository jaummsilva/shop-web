import Autoplay from 'embla-carousel-autoplay'
import { Minus, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { addToCart } from '@/api/app/add-to-cart'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { env } from '@/env'
import { useAuth } from '@/hooks/use-auth'
import { queryClient } from '@/lib/react-query'
import type { Product } from '@/type/product'
import { formatPrice } from '@/utils/format-price'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel'
import { Separator } from '../ui/separator'

interface ProductCardProps {
  product: Product
}

type ImageFile = {
  file: File
  previewUrl: string
}

export default function ProductDetailCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth()
  const [quantity, setQuantity] = useState(1)

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  )

  const [selectedPhotoPrincipal, setSelectedPhotoPrincipal] = useState<{
    file: File
    previewUrl: string
  }>({
    file: new File([], ''),
    previewUrl: '',
  })
  const [selectedPhotos, setSelectedPhotos] = useState<ImageFile[]>([])

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

      const otherImages = product.productImages.filter(
        (img) => !img.isPrincipal,
      )
      if (otherImages.length > 0) {
        const files = otherImages.map((img) => ({
          file: new File([], ''),
          previewUrl: env.VITE_API_URL.concat(img.imageUrl),
        }))
        setSelectedPhotos(files)
      }
    }
  }, [product])

  return (
    <Card className="mt-4 w-full rounded-xl border dark:bg-black">
      <div className="flex w-full flex-col items-center gap-4 p-10 lg:flex-row lg:gap-24">
        <div className="flex w-full items-center justify-center px-10">
          <Carousel
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              <CarouselItem>
                <div className="mt-2 flex h-52 justify-center lg:h-96">
                  <img
                    src={selectedPhotoPrincipal.previewUrl}
                    alt="Foto Principal"
                    className="rounded"
                    style={{ maxWidth: '100%' }}
                  />
                </div>
              </CarouselItem>
              {selectedPhotos.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="mt-2 flex h-52 justify-center overflow-auto lg:h-96">
                    <img
                      alt={`Product image ${index + 2}`}
                      className="rounded object-cover"
                      style={{ maxWidth: '100%' }}
                      src={image.previewUrl}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <Separator
          orientation="vertical"
          className="hidden h-[400px] bg-zinc-400 font-semibold lg:block"
        />
        <div className="flex w-full flex-col space-y-10">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-tighter md:text-xl">
              {product.name}
            </h3>
            <p className="text-sm font-bold tracking-tighter text-blue-600 md:text-2xl">
              {formatPrice(product.price)}
            </p>
            <p className="text-sm tracking-tighter text-muted-foreground md:text-lg">
              {product.description}
            </p>
          </div>
          <div className="flex items-start justify-start gap-1">
            <Button size="sm" variant="default" onClick={decrementQuantity}>
              <Minus className="size-4" />
            </Button>
            <input
              type="text"
              value={quantity}
              className="text-bold size-9 w-12 bg-transparent text-center text-lg text-black dark:text-white"
              readOnly
            />
            <Button size="sm" variant="default" onClick={incrementQuantity}>
              <Plus className="size-4" />
            </Button>
          </div>
          {isAuthenticated() ? (
            <Button
              size="lg"
              variant="blue"
              className="mt-2 w-56 tracking-tighter"
              onClick={handleAddToCart}
            >
              Adicione ao carrinho
            </Button>
          ) : (
            <p className="mt-2 w-full text-start text-sm tracking-tighter text-gray-600">
              Faça login para adicionar ao carrinho
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
