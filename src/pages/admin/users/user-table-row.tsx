import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'

import { updateUserStatus } from '@/api/admin/update-status-user'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { queryClient } from '@/lib/react-query'

import type { UsersTableRowProps } from './page'
import { UserSheetEdit } from './user-sheet-edit'

export function UserTableRow({ user }: UsersTableRowProps) {
  async function handleUpdateUserStatus(newStatus: 'S' | 'N') {
    try {
      const response = await updateUserStatus({
        userId: user.id,
        status: newStatus,
      })

      if (response.status === 204) {
        // Atualização bem sucedida
        toast.success(`Status do usuário ${user.name} atualizado com sucesso!`)
        await queryClient.invalidateQueries({
          queryKey: ['users'],
        })
      }
    } catch (error) {
      toast.error('Falha ao atualizar o status do usuário!')
    }
  }

  return (
    <TableRow>
      <TableCell>{user?.name}</TableCell>
      <TableCell>{user?.email}</TableCell>

      <TableCell>
        <Badge
          variant={user?.role === 'ADMIN' ? 'secondary' : 'default'}
          className="p-2"
        >
          {user?.role}
        </Badge>
      </TableCell>

      <TableCell>
        {user?.createdAt
          ? format(user.createdAt, 'd/M/yyyy HH:mm', {
              locale: ptBR,
            })
          : ''}
      </TableCell>
      <TableCell>
        {user?.updatedAt
          ? format(user.updatedAt, 'd/M/yyyy HH:mm', {
              locale: ptBR,
            })
          : ''}
      </TableCell>
      <TableCell className="space-x-2">
        <UserSheetEdit user={user} />

        {user?.status === 'S' ? (
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleUpdateUserStatus('N')}
          >
            <X className="mr-2 size-5" />
            Inativar
          </Button>
        ) : (
          <Button
            type="button"
            variant="success"
            onClick={() => handleUpdateUserStatus('S')}
          >
            <Check className="mr-2 size-5" />
            Ativar
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}
