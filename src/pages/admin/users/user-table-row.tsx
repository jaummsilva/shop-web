import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Check, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

import type { UsersTableRowProps } from './page'
import { UserSheetEdit } from './user-sheet-edit'

export function UserTableRow({ user }: UsersTableRowProps) {
  return (
    <TableRow>
      <TableCell>{user && user.name}</TableCell>
      <TableCell>{user && user.email}</TableCell>
      <TableCell>{user && user.phone}</TableCell>
      <TableCell>
        {user && user.role === 'ADMIN' ? (
          <Badge variant={'secondary'} className="p-2">
            {user && user.role}
          </Badge>
        ) : (
          <Badge className="p-2" variant={'default'}>
            {user && user.role}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        {user && user.birthdate
          ? format(user.birthdate, 'd/M/yyyy', {
              locale: ptBR,
            })
          : ''}
      </TableCell>
      <TableCell className="space-x-2">
        <UserSheetEdit user={user} />

        {user && user.status === 'S' ? (
          <Button type="button" variant="secondary">
            <X className="mr-2 size-4" />
            Inativar
          </Button>
        ) : (
          <Button type="button" variant="secondary">
            <Check className="mr-2 size-4" />
            Ativar
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}
