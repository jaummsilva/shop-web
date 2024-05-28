import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createUser } from '@/api/admin/create-user'
import { DatePickerDemo } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { queryClient } from '@/lib/react-query'
import { validateImageFile } from '@/utils/validate-image'

const userCreateSchema = z
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
    phone: z
      .string({
        required_error: '',
      })
      .max(15, 'O telefone deve ter no máximo 15 caracteres.'),
    birthdate: z.date({
      required_error: '',
    }),
    password: z
      .string({
        required_error: '',
      })
      .min(6, 'A senha deve ter no mínimo 6 caracteres.')
      .max(100, 'A senha deve ter no máximo 100 caracteres.'),
    repeatPassword: z
      .string({
        required_error: '',
      })
      .min(6, 'A senha deve ter no mínimo 6 caracteres.')
      .max(100, 'A senha deve ter no máximo 100 caracteres.'),
    photoPath: z
      .instanceof(File, {
        message: 'O tipo do arquivo deve ser imagem',
      })
      .refine(async (file) => await validateImageFile(file), {
        message: 'A imagem deve ser JPG ou PNG e ter menos de 1MB.',
      }),
    role: z.enum(['ADMIN', 'MEMBER']),
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

type UserCreateSchema = z.infer<typeof userCreateSchema>

interface UserFormProps {
  isOpen: boolean
  onClose: () => void
}

export function UserFormCreate({ onClose }: UserFormProps) {
  const form = useForm<UserCreateSchema>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      role: 'MEMBER',
    },
  })

  async function onSubmit(data: UserCreateSchema) {
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('phone', data.phone)
      formData.append('birthdate', data.birthdate.toISOString())
      formData.append('password', data.password)
      formData.append('photoPath', data.photoPath)
      formData.append('role', data.role)

      const response = await createUser(formData)

      if (response.status === 201) {
        toast.success('Usuário cadastrado com sucesso!')
        onClose()

        await queryClient.invalidateQueries({
          queryKey: ['users'],
        })

        form.reset()
      }
    } catch {
      toast.error('Erro ao cadastrar usuário!')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <SheetHeader className="flex flex-row  items-center gap-2">
          <UserPlus className="mt-2 size-6" />
          <SheetTitle>Cadastrar Usuário</SheetTitle>
        </SheetHeader>
        <Separator />
        <div className="w-full grid-cols-4 items-center gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right">Nome</FormLabel>
                <FormControl className="w-full">
                  <Input
                    {...field}
                    type="text"
                    className="col-span-8 w-full"
                    placeholder="Digite o nome"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full grid-cols-4 items-center gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right">Email</FormLabel>
                <FormControl className="w-full">
                  <Input
                    {...field}
                    type="email"
                    className="col-span-8 w-full"
                    placeholder="Digite o email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full grid-cols-4 items-center gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right">Senha</FormLabel>
                <FormControl className="w-full">
                  <Input
                    {...field}
                    type="password"
                    className="col-span-8 w-full"
                    placeholder="Digite a senha"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full grid-cols-4 items-center gap-4">
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full grid-cols-4 items-center gap-4">
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
              </FormItem>
            )}
          />
        </div>
        <div className="w-full grid-cols-4 items-center gap-4">
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full grid-cols-4 items-center gap-4">
          <FormField
            control={form.control}
            name="photoPath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    className="cursor-pointer"
                    accept="image/jpg, image/jpeg, image/png"
                    placeholder="shadcn"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      field.onChange(file)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full grid-cols-4 items-center gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field: { name, onChange, value, disabled } }) => (
              <FormItem>
                <FormLabel className="text-right">Perfil</FormLabel>
                <FormControl className="w-full">
                  <Select
                    name={name}
                    onValueChange={onChange}
                    value={value}
                    disabled={disabled}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="MEMBER">Membro</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SheetFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Salvar
          </Button>
        </SheetFooter>
      </form>
    </Form>
  )
}
