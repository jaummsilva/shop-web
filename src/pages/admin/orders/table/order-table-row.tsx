import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Boxes } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { OrderDetails } from '@/pages/app/config/components/order-details'
import { formatPrice } from '@/utils/format-price'

import type { OrdersTableRowProps } from '../page'

export function OrderTableRow({ order }: OrdersTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  return (
    <TableRow>
      <TableCell>{order?.id}</TableCell>
      <TableCell className="text-md font-semibold text-muted-foreground">
        {order?.userName}
      </TableCell>
      <TableCell>
        <Badge className="text-md bg-blue-800 font-semibold text-white">
          {' '}
          {formatPrice(order.totalPrice)}
        </Badge>
      </TableCell>
      <TableCell>
        {order?.createdAt
          ? format(order.createdAt, 'dd/MM/yyyy HH:mm', {
              locale: ptBR,
            })
          : ''}
      </TableCell>
      <TableCell className="text-end">{order.orderItems.length}</TableCell>
      <TableCell className="text-center">
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
      </TableCell>
    </TableRow>
  )
}
