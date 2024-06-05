import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { env } from '@/env'
import type { Order } from '@/type/order'
import { formatPrice } from '@/utils/format-price'

export interface OrderDetailsProps {
  order: Order
  open: boolean
}

export function OrderDetails({ order }: OrderDetailsProps) {
  // Format the createdAt date
  const formattedDate = new Date(order.createdAt)
  const day = formattedDate.getDate()
  const month = formattedDate.toLocaleString('pt-BR', { month: 'long' })
  const year = formattedDate.getFullYear()
  const formattedDateString = `${day} de ${month} de ${year}`

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Pedido: {order.id}</DialogTitle>
        <DialogDescription className="flex items-center justify-between">
          <p> Detalhes do pedido</p>
          <p className="font-semibold tracking-tighter">
            {formattedDateString}
          </p>
        </DialogDescription>
      </DialogHeader>
      <div className="max-h-[600px] space-y-6 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="hidden w-[100px] text-lg tracking-tighter sm:table-cell">
                <span className="sr-only">Imagem do Produto</span>
              </TableHead>
              <TableHead className="text-lg tracking-tighter">
                Produto
              </TableHead>
              <TableHead className="text-lg tracking-tighter">Preço</TableHead>
              <TableHead className="text-center text-lg tracking-tighter">
                Quantidade
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.orderItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="hidden sm:table-cell">
                  <div className="mt-2 flex h-20 justify-center overflow-auto">
                    <img
                      alt="Product image"
                      className="rounded object-cover"
                      src={
                        item.productImageUrl
                          ? `${env.VITE_API_URL}${item.productImageUrl}`
                          : ''
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="text-md font-medium tracking-tighter">
                  {item.productName}
                </TableCell>
                <TableCell className="text-md font-semibold tracking-tighter">
                  {formatPrice(item.totalPrice)}
                </TableCell>
                <TableCell className="text-md text-center font-medium tracking-tighter">
                  {item.quantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Separator />
      <DialogFooter className="flex justify-center">
        <div className="flex flex-row gap-3">
          <p className="font- text-xl tracking-tighter text-muted-foreground">
            Total do pedido:
          </p>
          <p className="text-xl font-semibold tracking-tighter">
            {formatPrice(order.totalPrice)}
          </p>
        </div>
      </DialogFooter>
    </DialogContent>
  )
}
