import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Badge } from '@/components/ui/badge'
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
        {user && user.role === 'ADMIN' ? (
          <Badge variant={'default'} className="p-2">
            {user && user.role}
          </Badge>
        ) : (
          <Badge className="p-2" variant={'destructive'}>
            {user && user.role}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        {user && user.birthdate
          ? format(new Date(user.birthdate), 'd/M/yyyy', {
              locale: ptBR,
            })
          : ''}
      </TableCell>
      <TableCell>
        <Button type="button" variant="outline">
          Editar
        </Button>
      </TableCell>
    </TableRow>
  )
}
