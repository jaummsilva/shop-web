import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { UserFormCreate } from '../forms/user-form-create'

export function UserSheetCreate() {
  const [isSheetOpen, setIsSheetOpen] = useState(false) // State to control sheet open/close

  const handleCloseSheet = () => {
    setIsSheetOpen(false)
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" onClick={() => setIsSheetOpen(true)}>
          Cadastrar
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-auto">
        <UserFormCreate isOpen={isSheetOpen} onClose={handleCloseSheet} />
      </SheetContent>
    </Sheet>
  )
}
