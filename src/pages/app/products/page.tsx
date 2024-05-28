import { useQuery } from '@tanstack/react-query'

import {
  getStoreProducts,
  type GetStoreProductsResponse,
} from '@/api/app/get-store-products'
import ProductCard from '@/components/product-card'
import type { Product } from '@/type/product'

export function StoreProducts() {
  const query = ''

  const { data: result, isLoading: isLoadingProducts } =
    useQuery<GetStoreProductsResponse>({
      queryKey: ['store-products', query],
      queryFn: () => getStoreProducts({ query }),
    })

  return (
    <div className="mb-24 mt-20 flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoadingProducts ? (
          <p>Loading...</p>
        ) : (
          result?.products?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  )
}
