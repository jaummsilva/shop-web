import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchOrders } from '@/api/admin/fetch-orders'
import { Pagination } from '@/components/pagination'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Order } from '@/type/order'

import { OrderTableFilters } from './table/order-table-filters'
import { OrderTableRow } from './table/order-table-row'
import { OrderTableSkeleton } from './table/order-table-skeleton'

export interface OrdersTableRowProps {
  order: Order
}

export function OrderAdminPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('query')
  const perPage = z.coerce.number().parse(searchParams.get('perPage') ?? '10')

  const basePageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const pageIndex = basePageIndex <= 0 ? 1 : basePageIndex

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders', pageIndex, query, perPage],
    queryFn: () => fetchOrders({ pageIndex, query, perPage }),
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

    const meta = orders && orders.meta

    if (meta && pageIndex > Math.ceil(meta.totalCount / meta.perPage)) {
      setSearchParams((prev) => {
        prev.set('page', '1')
        return prev
      })
    }
  }, [orders, basePageIndex, pageIndex, setSearchParams, searchParams])

  return (
    <div>
      <Helmet>
        <title>Pedidos</title>
      </Helmet>
      <div className="mb-5 flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
      </div>
      <Separator />
      <div className="mt-4 space-y-2.5">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:gap-2">
          <div>
            <OrderTableFilters />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identificador</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Preço Total</TableHead>
                <TableHead>Data do Pedido</TableHead>
                <TableHead className="text-end">Total de Itens</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody style={{ height: '100%' }}>
              {isLoadingOrders ? (
                <OrderTableSkeleton />
              ) : (
                orders &&
                orders.orders.map((order) => (
                  <OrderTableRow key={order.id} order={order} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination
          onChangePage={handlePaginate}
          pageIndex={
            orders && orders.meta.pageIndex !== undefined
              ? orders.meta.pageIndex
              : 0
          }
          perPage={
            orders && orders.meta.perPage !== undefined
              ? orders.meta.perPage
              : 10
          } // Or whatever default value you want
          totalCount={
            orders && orders.meta.totalCount !== undefined
              ? orders.meta.totalCount
              : 0
          }
        />
      </div>
    </div>
  )
}
