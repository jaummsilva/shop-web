'use client'

import { useQuery } from '@tanstack/react-query'

import { getProfile } from '@/api/app/get-profile'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

import { ProfileForm } from './form/profile-form'

export default function ProfilePage() {
  const { data: profile, isFetching: isFechingProfileData } = useQuery({
    queryKey: ['get-profile'],
    queryFn: async () => {
      const response = await getProfile()

      return response.data
    },
    staleTime: 1000 * 60 * 5,
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Perfil</h3>
        <p className="text-sm text-muted-foreground">
          Atualize suas informações de perfil.
        </p>
      </div>
      <Separator />
      {!isFechingProfileData && profile ? (
        <div className="w-1/2">
          <ProfileForm user={profile.user} />
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-1/2 space-y-4">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          ))}
          <Skeleton className="h-10 w-36" />
        </div>
      )}
    </div>
  )
}
