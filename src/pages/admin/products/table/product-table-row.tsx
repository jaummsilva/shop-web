import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

import { ProcutSheetEdit } from '../components/product-sheet-edit'
import type { ProductsTableRowProps } from '../page'

export function ProductTableRow({ product }: ProductsTableRowProps) {
  return (
    <TableRow>
      <TableCell>{product?.id}</TableCell>
      <TableCell>{product?.name}</TableCell>
      <TableCell>
        {product?.createdAt
          ? format(product.createdAt, 'd/M/yyyy HH:mm', {
              locale: ptBR,
            })
          : ''}
      </TableCell>
      <TableCell>
        {product?.updatedAt
          ? format(product.updatedAt, 'd/M/yyyy HH:mm', {
              locale: ptBR,
            })
          : ''}
      </TableCell>
      <TableCell className="space-x-2">
        <ProcutSheetEdit product={product} />
        <Button type="button" variant="destructive">
          <Trash className="mr-2 size-5" />
          Excluir
        </Button>
      </TableCell>
    </TableRow>
  )
}
