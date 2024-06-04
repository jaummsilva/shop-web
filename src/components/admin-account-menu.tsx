import { useQuery } from '@tanstack/react-query'
import { ChevronDown, LogOut } from 'lucide-react'
import nookies from 'nookies'
import { useNavigate } from 'react-router-dom'

import { getAdminProfile } from '@/api/admin/get-admin-profile'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { env } from '@/env'
import { queryClient } from '@/lib/react-query'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog } from './ui/dialog'
import { Skeleton } from './ui/skeleton'

export function AdminAccountMenu() {
  const navigate = useNavigate()

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
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

  async function handleLogout() {
    nookies.destroy(null, 'token_admin')
    await queryClient.invalidateQueries({
      queryKey: ['profile'],
    })
    navigate('/admin/sign-in')
  }

  let imageUrl = ''
  if (profile) {
    imageUrl = env.VITE_API_URL.concat(profile.user.imageUrl)
  }

  return (
    <>
      <Dialog>
        <Avatar>
          <AvatarImage className="h-10" src={imageUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex select-none items-center gap-2"
            >
              {profile && profile.user.name}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex flex-col">
              <span>
                {isLoadingProfile ? (
                  <Skeleton className="h-4 w-40" />
                ) : (
                  profile?.user.name
                )}
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {isLoadingProfile ? (
                  <Skeleton className="h-4 w-40" />
                ) : (
                  profile?.user.email
                )}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              className="cursor-pointer gap-1.5 text-rose-500 dark:text-rose-400"
            >
              <button className="w-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>
    </>
  )
}
