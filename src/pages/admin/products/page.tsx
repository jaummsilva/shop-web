import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getProducts } from '@/api/admin/get-products'
import { Pagination } from '@/components/pagination'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ProductSheetCreate } from './components/product-sheet-create'
import { ProductTableFilters } from './table/product-table-filters'
import { ProductTableRow } from './table/product-table-row'
import { UserTableSkeleton } from './table/product-table-skeleton'

export interface ProductsTableRowProps {
  product: {
    price: number
    id: string
    name: string
    createdAt: string
    updatedAt: string
    description?: string
  }
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const name = searchParams.get('name')
  const perPage = z.coerce.number().parse(searchParams.get('perPage') ?? '10')

  const basePageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const pageIndex = basePageIndex <= 0 ? 1 : basePageIndex

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', pageIndex, name, perPage],
    queryFn: () => getProducts({ pageIndex, name, perPage }),
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set('page', pageIndex.toString())
      return prev
    })
  }

  useEffect(() => {
    const pageIndex = basePageIndex <= 0 ? 1 : basePageIndex
    const perPage = searchParams.get('perPage') ?? '10'

    const validPerPageValues = ['10', '25', '50', '100']

    if (!validPerPageValues.includes(perPage)) {
      setSearchParams((prev) => {
        prev.set('perPage', '10')
        return prev
      })
    }

    setSearchParams((prev) => {
      prev.set('page', pageIndex.toString())
      return prev
    })

    const meta = products && products.meta

    if (meta && pageIndex > Math.ceil(meta.totalCount / meta.perPage)) {
      setSearchParams((prev) => {
        prev.set('page', '1')
        return prev
      })
    }
  }, [products, basePageIndex, pageIndex, setSearchParams, searchParams])

  return (
    <div>
      <Helmet>
        <title>Produtos</title>
      </Helmet>
      <div className="mb-5 flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
      </div>
      <Separator />
      <div className="mt-4 space-y-2.5">
        <div className="flex flex-row justify-between gap-2">
          <div>
            <ProductTableFilters />
          </div>
          <div>
            <ProductSheetCreate />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identificador</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Data de Atualização</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody style={{ height: '100%' }}>
              {isLoadingProducts ? (
                <UserTableSkeleton />
              ) : (
                products &&
                products.products.map((product) => (
                  <ProductTableRow key={product.id} product={product} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination
          onChangePage={handlePaginate}
          pageIndex={
            products && products.meta.pageIndex !== undefined
              ? products.meta.pageIndex
              : 0
          }
          perPage={
            products && products.meta.perPage !== undefined
              ? products.meta.perPage
              : 10
          } // Or whatever default value you want
          totalCount={
            products && products.meta.totalCount !== undefined
              ? products.meta.totalCount
              : 0
          }
        />
      </div>
    </div>
  )
}
