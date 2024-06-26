import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Check, Trash, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { deleteUser } from '@/api/admin/delete-user'
import { getAdminProfile } from '@/api/admin/get-admin-profile'
import { updateUserStatus } from '@/api/admin/update-status-user'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { queryClient } from '@/lib/react-query'

import { UserSheetEdit } from '../components/user-sheet-edit'
import type { UsersTableRowProps } from '../page'

export function UserTableRow({ user }: UsersTableRowProps) {
  const navigate = useNavigate()

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const result = await getAdminProfile()
        return result.data
      } catch (error) {
        navigate('/admin/sign-in')
      }
    },
  })

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
      toast.error('Falha ao deletar o status do usuário!')
    }
  }

  async function handleDeleteUser() {
    if (profile?.user.email === user.email) {
      toast.error('Você não pode deletar seu próprio usuário!')
    } else {
      try {
        const response = await deleteUser({
          userId: user.id,
        })

        if (response.status === 204) {
          // Atualização bem sucedida
          toast.success(`Usuário ${user.name} deletado com sucesso!`)
          await queryClient.invalidateQueries({
            queryKey: ['users'],
          })
        }
      } catch (error) {
        toast.error('Falha ao deletar o usuário!')
      }
    }
  }

  const roleText = user?.role === 'ADMIN' ? 'Administrador' : 'Membro'
  return (
    <TableRow>
      <TableCell>{user?.name}</TableCell>
      <TableCell>{user?.email}</TableCell>

      <TableCell>
        <Badge
          variant={user?.role === 'ADMIN' ? 'secondary' : 'default'}
          className="p-2"
        >
          {roleText}
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
      <TableCell className="flex space-x-2">
        <UserSheetEdit user={user} />
        <Button
          type="button"
          variant="destructive"
          onClick={() => handleDeleteUser()}
        >
          <Trash className="mr-2 size-5" />
          Excluir
        </Button>
        {user?.status === 'S' ? (
          <Button
            type="button"
            variant="default"
            onClick={() => handleUpdateUserStatus('N')}
          >
            <X className="mr-2 size-5" />
            Inativar
          </Button>
        ) : (
          <Button
            type="button"
            variant="default"
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
