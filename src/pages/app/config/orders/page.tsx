import { useQuery } from '@tanstack/react-query'

import { fetchOrdersByUser } from '@/api/app/fetch-orders-by-user'
import { Separator } from '@/components/ui/separator'

import OrderCard from '../components/order-card'
import { OrderSkeleton } from '../components/order-skeleton'

export default function OrdersPage() {
  const { data: result, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetchOrdersByUser(),
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Meus Pedidos</h3>
        <p className="text-sm text-muted-foreground">
          Visualize as informações de seus pedidos
        </p>
      </div>
      <Separator />
      {isLoadingOrders ? (
        <OrderSkeleton />
      ) : result?.orders && result.orders.length > 0 ? (
        result.orders.map((order, index) => (
          <OrderCard order={order} key={index} />
        ))
      ) : (
        <p className="text-lg font-semibold">
          Você não fez nenhum pedido na loja!
        </p>
      )}
    </div>
  )
}
