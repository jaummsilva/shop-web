import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getProduct, type GetProductResponse } from '@/api/app/get-product'
import ProductDetailCard from '@/components/product-detail-card'

export default function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()

  const { data: product, isLoading } = useQuery<GetProductResponse>({
    queryKey: ['store-products', productId || ''],
    queryFn: () => getProduct({ productId: productId || '' }),
    enabled: !!productId, // Ensure the query only runs if productId is truthy
  })

  useEffect(() => {
    async function fetchData() {
      if (!productId || isLoading) return // Wait until productId is available and product is loaded

      try {
        await getProduct({ productId })
      } catch (error) {
        navigate('/')
      }
    }

    fetchData()
  }, [productId, isLoading, navigate])

  if (!productId || isLoading) return null // Or render a loading indicator

  return (
    <div className="mb-24 mt-10 flex justify-center">
      {product && <ProductDetailCard key={1} product={product} />}
    </div>
  )
}
