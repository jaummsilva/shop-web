import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getUsers } from '@/api/admin/get-users'
import { Pagination } from '@/components/pagination'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { UserSheetCreate } from './components/user-sheet-create'
import { UserTableFilters } from './table/user-table-filters'
import { UserTableRow } from './table/user-table-row'
import { UserTableSkeleton } from './table/user-table-skeleton'

export interface UsersTableRowProps {
  user: {
    id: string
    name: string
    birthdate: string
    email: string
    phone: string
    role: 'ADMIN' | 'MEMBER'
    status: 'S' | 'N'
    imageFakeName: string
    imageOriginalName: string
    imageUrl: string
    createdAt: string
    updatedAt: string
  }
}

export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const name = searchParams.get('name')
  const perPage = z.coerce.number().parse(searchParams.get('perPage') ?? '10')

  const basePageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const pageIndex = basePageIndex <= 0 ? 1 : basePageIndex

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users', pageIndex, name, perPage],
    queryFn: () => getUsers({ pageIndex, name, perPage }),
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set('page', pageIndex.toString())
      return prev
    })
  }

  useEffect(() => {
    const pageIndex = basePageIndex <= 0 ? 1 : basePageIndex
    const perPage = searchParams.get('perPage') ?? '10'

    const validPerPageValues = ['10', '25', '50', '100']

    if (!validPerPageValues.includes(perPage)) {
      setSearchParams((prev) => {
        prev.set('perPage', '10')
        return prev
      })
    }

    setSearchParams((prev) => {
      prev.set('page', pageIndex.toString())
      return prev
    })

    const meta = users && users.meta

    if (meta && pageIndex > Math.ceil(meta.totalCount / meta.perPage)) {
      setSearchParams((prev) => {
        prev.set('page', '1')
        return prev
      })
    }
  }, [users, basePageIndex, pageIndex, setSearchParams, searchParams])

  return (
    <div>
      <Helmet>
        <title>Usuários</title>
      </Helmet>
      <div className="mb-5 flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
      </div>
      <Separator />
      <div className="mt-4 space-y-2.5">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:gap-2">
          <div className="block lg:hidden">
            <UserSheetCreate />
          </div>
          <div>
            <UserTableFilters />
          </div>
          <div className="hidden lg:block">
            <UserSheetCreate />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Data de Atualização</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody style={{ height: '100%' }}>
              {isLoadingUsers ? (
                <UserTableSkeleton />
              ) : (
                users &&
                users.users.map((user) => (
                  <UserTableRow key={user.id} user={user} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination
          onChangePage={handlePaginate}
          pageIndex={
            users && users.meta.pageIndex !== undefined
              ? users.meta.pageIndex
              : 0
          }
          perPage={
            users && users.meta.perPage !== undefined ? users.meta.perPage : 10
          } // Or whatever default value you want
          totalCount={
            users && users.meta.totalCount !== undefined
              ? users.meta.totalCount
              : 0
          }
        />
      </div>
    </div>
  )
}
