import { useQuery } from '@tanstack/react-query'
import { ChevronDown, LogOut } from 'lucide-react'
import nookies from 'nookies'
import { useNavigate } from 'react-router-dom'

import { getProfile } from '@/api/get-profile'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { queryClient } from '@/lib/react-query'

import { Cart } from './cart'
import { Dialog } from './ui/dialog'
import { Skeleton } from './ui/skeleton'

export function AccountMenu() {
  const navigate = useNavigate()

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    refetchOnWindowFocus: false, // Evita refetch ao focar na janela
  })

  async function handleLogout() {
    nookies.destroy(null, 'token')
    nookies.destroy(null, 'refreshToken')
    await queryClient.invalidateQueries({
      queryKey: ['profile'],
    })
    navigate('/')
  }

  function handleLogin() {
    navigate('/sign-in')
  }

  return (
    <>
      {isLoadingProfile ? (
        <Button type="button" variant="default" onClick={handleLogin}>
          Entrar
        </Button>
      ) : (
        <Dialog>
          <Cart itemCount={0} />
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
