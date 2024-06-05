import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { ChevronDown, Cog, LogOut } from 'lucide-react'
import nookies from 'nookies'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { getProfile } from '@/api/app/get-profile'
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
import { useAuth } from '@/hooks/use-auth'
import { queryClient } from '@/lib/react-query'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Dialog } from '../ui/dialog'
import { Skeleton } from '../ui/skeleton'

export function AccountMenu() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const {
    data: profile,
    isLoading: isLoadingProfile,
    error,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  useEffect(() => {
    const handleProfileError = (error: Error) => {
      if (
        error &&
        'response' in error &&
        (error as AxiosError).response?.status === 404
      ) {
        // Verifica se o erro é do tipo AxiosError e se o status é 404
        nookies.destroy(undefined, 'token')
        window.location.reload()
      }
    }

    handleProfileError(error as Error)
  }, [error])

  const handleLogout = () => {
    nookies.destroy(undefined, 'token')
    queryClient.invalidateQueries({
      queryKey: ['profile'],
    })
    window.location.reload()
  }

  function handleLogin() {
    navigate('/sign-in')
  }

  let imageUrl = ''
  if (profile) {
    imageUrl = env.VITE_API_URL.concat(profile.data.user.imageUrl)
  }

  return (
    <>
      {!isAuthenticated() ? (
        <Button type="button" variant="default" onClick={handleLogin}>
          Entrar
        </Button>
      ) : (
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
                {profile && profile.data.user.name}
                <ChevronDown className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex flex-col">
                <span>
                  {isLoadingProfile ? (
                    <Skeleton className="h-4 w-40" />
                  ) : (
                    profile?.data.user.name
                  )}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {isLoadingProfile ? (
                    <Skeleton className="h-4 w-40" />
                  ) : (
                    profile?.data.user.email
                  )}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer gap-1.5 ">
                <Link to="/config">
                  <Cog className="h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
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
      )}
    </>
  )
}
