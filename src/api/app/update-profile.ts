import nookies from 'nookies'

import { api } from '@/lib/axios'

export async function updateProfile(formData: FormData) {
  const token = nookies.get(null).token

  const response = await api.put('/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
  return response
}
