import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'

import {
  getStoreProducts,
  type GetStoreProductsResponse,
} from '@/api/app/get-store-products'
import ProductCard from '@/components/product-card'
import type { Product } from '@/type/product'

export function Home() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query') ?? ''

  const { data: result, isLoading: isLoadingProducts } =
    useQuery<GetStoreProductsResponse>({
      queryKey: ['store-products', query],
      queryFn: () => getStoreProducts({ query }),
    })

  let content

  if (isLoadingProducts) {
    content = <p>Loading...</p>
  } else if (result?.products?.length === 0) {
    content = (
      <div className="relative mb-24 mt-20 flex justify-start">
        <p className="text-justify text-2xl">
          Desculpe, não encontramos o item procurado...
        </p>
      </div>
    )
  } else {
    content = (
      <div className="relative mb-24 mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {result?.products?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )
  }

  return (
    <>
      {' '}
      <Helmet>Home</Helmet> {content}
    </>
  )
}