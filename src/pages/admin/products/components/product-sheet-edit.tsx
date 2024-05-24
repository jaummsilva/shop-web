import { Edit } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'

import { ProductEditForm } from '../forms/product-form-edit'
import type { ProductsTableRowProps } from '../page'

export function ProcutSheetEdit({ product }: ProductsTableRowProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false) // State to control sheet open/close

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="blue" onClick={() => setIsSheetOpen(true)}>
          <Edit className="mr-2 size-5" />
          Editar
        </Button>
      </SheetTrigger>

      <ProductEditForm product={product} setIsSheetOpen={setIsSheetOpen} />
    </Sheet>
  )
}
