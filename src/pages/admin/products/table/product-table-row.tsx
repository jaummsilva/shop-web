import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'

import { deleteProduct } from '@/api/admin/delete-product'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { queryClient } from '@/lib/react-query'

import { ProcutSheetEdit } from '../components/product-sheet-edit'
import type { ProductsTableRowProps } from '../page'

export function ProductTableRow({ product }: ProductsTableRowProps) {
  async function handleDeleteProduct() {
    try {
      const response = await deleteProduct({
        productId: product.id,
      })

      if (response.status === 204) {
        // Atualização bem sucedida
        toast.success(`Produto ${product.name} deletado com sucesso!`)
        await queryClient.invalidateQueries({
          queryKey: ['products'],
        })
      }
    } catch (error) {
      toast.error('Falha ao deletar o produto!')
    }
  }

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
      <TableCell className="flex space-x-2">
        <ProcutSheetEdit product={product} />
        <Button
          type="button"
          variant="destructive"
          onClick={() => handleDeleteProduct()}
        >
          <Trash className="mr-2 size-5" />
          Excluir
        </Button>
      </TableCell>
    </TableRow>
  )
}
