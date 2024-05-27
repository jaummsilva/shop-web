import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getProduct, type GetProductResponse } from '@/api/app/get-product'
import ProductDetailCard from '@/components/product-detail-card'

export default function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()

  const { data: product } = useQuery<GetProductResponse>({
    queryKey: ['store-products', productId || ''],
    queryFn: () => getProduct({ productId: productId || '' }),
  })

  useEffect(() => {
    if (!productId || !product) {
      navigate('/')
    }
  }, [productId, navigate, product])

  return (
    <div className="mb-24 mt-10 flex justify-center">
      {product && <ProductDetailCard key={1} product={product} />}
    </div>
  )
}
