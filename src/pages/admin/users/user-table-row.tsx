import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

import type { UsersTableRowProps } from './page'

export function UserTableRow({ user }: UsersTableRowProps) {
  return (
    <TableRow>
      <TableCell>{user && user.name}</TableCell>
      <TableCell>{user && user.email}</TableCell>
      <TableCell>{user && user.phone}</TableCell>
      <TableCell>
        {user && user.birthdate
          ? format(new Date(user.birthdate), 'd/M/yyyy', {
              locale: ptBR,
            })
          : ''}
      </TableCell>
      <TableCell>{user && user.role}</TableCell>
      <TableCell>
        <Button type="button" variant="default">
          Editar
        </Button>
      </TableCell>
    </TableRow>
  )
}
