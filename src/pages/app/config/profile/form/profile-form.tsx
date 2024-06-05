import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { updateProfile } from '@/api/app/update-profile'
import { DatePickerDemo } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { env } from '@/env'
import { queryClient } from '@/lib/react-query'
import { validateImageFile } from '@/utils/validate-image'

const profileFormSchema = z
  .object({
    name: z
      .string({
        required_error: '',
      })
      .min(3, 'O nome deve ter no mínimo 3 caracteres.')
      .max(255, 'O nome deve ter no máximo 255 caracteres.'),
    email: z
      .string({
        required_error: '',
      })
      .max(255, 'O email deve ter no máximo 255 caracteres.')
      .email('O e-mail deve ser válido.'),
    password: z
      .string({
        required_error: '',
      })
      .min(6, 'A senha deve ter no mínimo 6 caracteres.')
      .max(100, 'A senha deve ter no máximo 100 caracteres.')
      .optional(),
    phone: z
      .string({
        required_error: '',
      })
      .max(15, 'O telefone deve ter no máximo 15 caracteres.'),
    birthdate: z.date({
      required_error: '',
    }),
    repeatPassword: z
      .string({
        required_error: '',
      })
      .min(6, 'A senha deve ter no mínimo 6 caracteres.')
      .max(100, 'A senha deve ter no máximo 100 caracteres.')
      .optional(),
    photoPath: z
      .instanceof(File, {
        message: 'O tipo do arquivo deve ser imagem',
      })
      .refine(async (file) => await validateImageFile(file), {
        message: 'A imagem deve ser JPG ou PNG e ter menos de 1MB.',
      })
      .optional(),
  })
  .superRefine(({ repeatPassword, password }, ctx) => {
    if (repeatPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Senhas devem ser iguais!',
        path: ['repeatPassword'],
      })
    }
  })

type ProfileFormValues = z.infer<typeof profileFormSchema>

type ProfileFormProps = {
  user: {
    email: string
    name: string
    imageUrl: string
    phone: string
    birthdate: Date
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthdate: user.birthdate ? new Date(user.birthdate) : undefined,
    },
  })

  const userImage = env.VITE_API_URL.concat(user.imageUrl) ?? ''

  async function onSubmit(data: ProfileFormValues) {
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('password', data.password ?? '')
      formData.append('phone', data.phone)
      formData.append('birthdate', data.birthdate.toISOString())
      if (photoFile) {
        formData.append('photoPath', photoFile)
      }

      const response = await updateProfile(formData)

      if (response.status === 204) {
        toast.success('Perfil editado com sucesso!')

        await queryClient.invalidateQueries({
          queryKey: ['profile'],
        })
      }
    } catch {
      toast.error('Erro ao editar perfil!')
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário</FormLabel>
              <FormControl>
                <Input placeholder="user.name" {...field} />
              </FormControl>
              <FormDescription>
                Esse é o seu usuário único que será utilizado para acessar o
                sistema.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} />
              </FormControl>
              <FormDescription>
                Esse é o seu email único que também será utilizado para acessar
                o sistema.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div className="flex rounded-md border focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <Input
                    type="password"
                    className="border-none focus-visible:ring-0 focus-visible:ring-inset focus-visible:ring-offset-0"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Esse é a sua senha única que será utilizada para acessar o
                sistema.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">Repetir Senha</FormLabel>
              <FormControl className="w-full">
                <Input
                  {...field}
                  type="password"
                  className="col-span-8 w-full"
                  placeholder="Repita a senha"
                />
              </FormControl>
              <FormDescription>
                Repita a senha para que consiga alterar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">Data de Nascimento</FormLabel>
              <FormControl className="w-full">
                <DatePickerDemo date={field.value} setDate={field.onChange} />
              </FormControl>
              <FormMessage />
              <FormDescription>Essa é sua data de nascimento.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">Telefone</FormLabel>
              <FormControl className="w-full">
                <Input
                  {...field}
                  type="tel"
                  className="col-span-8 w-full"
                  placeholder="Digite o telefone"
                />
              </FormControl>
              <FormDescription>Essa é seu telefone.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="photoPath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto de perfil</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  className="cursor-pointer"
                  accept="image/jpg, image/jpeg, image/png"
                  placeholder="shadcn"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setPhotoFile(file)
                      field.onChange(file)
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Essa é a sua foto de perfil, pode ser alterada a qualquer
                momento.
              </FormDescription>
              {photoFile ? (
                <div className="mt-2 flex h-40 justify-center overflow-auto">
                  <img
                    src={URL.createObjectURL(photoFile)}
                    alt={'Foto do Usuário'}
                    className=" rounded object-cover"
                    style={{ maxWidth: '100%' }}
                  />
                </div>
              ) : userImage ? (
                <div className="flex h-40 justify-center overflow-auto">
                  <img
                    src={userImage}
                    alt="Foto do usuário"
                    style={{ maxWidth: '100%' }}
                    className="rounded object-cover"
                  />
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  Sem foto selecionada
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Atualizar perfil
        </Button>
      </form>
    </Form>
  )
}
