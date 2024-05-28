import nookies from 'nookies'

import { api } from '@/lib/axios'

export interface GetUsersQuery {
  pageIndex?: number | null
  name?: string | null
  perPage?: number | null
}

export interface GetUsersResponse {
  users: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    birthdate: string
    email: string
    phone: string
    imageFakeName: string
    imageOriginalName: string
    imageUrl: string
    status: 'S' | 'N'
    role: 'ADMIN' | 'MEMBER'
  }[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getUsers({
  name,
  pageIndex: page,
  perPage,
}: GetUsersQuery) {
  const token = nookies.get(null).token_admin

  const response = await api.get<GetUsersResponse>('/users', {
    params: {
      page,
      name,
      perPage,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
