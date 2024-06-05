import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'

import {
  getStoreProducts,
  type GetStoreProductsResponse,
} from '@/api/app/get-store-products'
import ProductCard from '@/components/app/product-card'
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
      <div className="mb-24 mt-20 flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Home</h1>
        <div className="relative mt-11 flex justify-start">
          <p className="text-justify text-2xl">
            Desculpe, não encontramos o item procurado...
          </p>
        </div>
      </div>
    )
  } else {
    content = (
      <div className="mb-24 mt-20 flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Home</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {result?.products?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
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
