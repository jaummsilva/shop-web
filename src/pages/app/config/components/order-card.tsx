import { Boxes } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogClose, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { Order } from '@/type/order'
import { formatPrice } from '@/utils/format-price'

import { OrderDetails } from './order-details'

interface OrderCardProps {
  order: Order
}

export default function OrderCard({ order }: OrderCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Format the createdAt date
  const formattedDate = new Date(order.createdAt)
  const day = formattedDate.getDate()
  const month = formattedDate.toLocaleString('pt-BR', { month: 'long' })
  const year = formattedDate.getFullYear()
  const formattedDateString = `${day} de ${month} de ${year}`

  return (
    <Card className="bg-muted dark:bg-black">
      <CardContent className="flex w-full flex-col gap-4">
        <div className="text-md flex w-full justify-between border-b p-2 font-semibold tracking-tighter">
          <p>{formattedDateString}</p>

          <p className="">Total de itens: {order.orderItems.length}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-between gap-3 text-lg">
            <p className="text-sm font-normal text-muted-foreground md:text-2xl">
              {order.id}
            </p>
            <Separator
              orientation="vertical"
              className="h-5 bg-black dark:bg-white"
            />
            <p className="text-sm font-semibold text-blue-800 md:text-2xl">
              {formatPrice(order.totalPrice)}
            </p>
          </div>
          <div>
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                  <Boxes className="mr-2 h-6 w-6" />
                  <span className="">Visualizar itens</span>
                </Button>
              </DialogTrigger>

              <DialogClose />
              <OrderDetails open order={order} />
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
