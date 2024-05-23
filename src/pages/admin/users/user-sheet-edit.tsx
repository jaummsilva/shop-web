import { Edit } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'

import type { UsersTableRowProps } from './page'
import { UserEditForm } from './user-form-edit'

export function UserSheetEdit({ user }: UsersTableRowProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false) // State to control sheet open/close

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="blue" onClick={() => setIsSheetOpen(true)}>
          <Edit className="mr-2 size-5" />
          Editar
        </Button>
      </SheetTrigger>

      <UserEditForm
        user={user}
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
      />
    </Sheet>
  )
}
