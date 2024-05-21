import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const MB_BYTES = 1000000 // Number of bytes in a megabyte.

// This is the list of mime types you will accept with the schema
const ACCEPTED_MIME_TYPES = ['image/gif', 'image/jpeg', 'image/png']

const userCreateSchema = z.object({
  name: z
    .string({
      required_error: '',
    })
    .min(3),
  email: z
    .string({
      required_error: '',
    })
    .email(),
  phone: z.string({
    required_error: '',
  }),
  birthdate: z.date({
    required_error: '',
  }),
  password: z
    .string({
      required_error: '',
    })
    .min(6),
  photoPath: z.instanceof(File).superRefine((f, ctx) => {
    if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `File must be one of [${ACCEPTED_MIME_TYPES.join(', ')}] but was ${f.type}`,
      })
    }
    if (f.size > 3 * MB_BYTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `The file must not be larger than ${3 * MB_BYTES} bytes: ${f.size}`,
      })
    }
  }),
  role: z.enum(['ADMIN', 'MEMBER']),
})

type UserCreateSchema = z.infer<typeof userCreateSchema>

export function UserSheetCreate() {
  const [isSheetOpen, setIsSheetOpen] = useState(false) // State to control sheet open/close

  const form = useForm<UserCreateSchema>({
    resolver: zodResolver(userCreateSchema),
  })

  async function onSubmit(data: UserCreateSchema) {
    console.log(data)
    try {
      const response = await createUser({
        birthdate: data.birthdate,
        email: data.email,
        name: data.name,
        password: data.password,
        photoPath: data.photoPath,
        phone: data.phone,
        role: data.role,
      })

      if (response.status === 201) {
        toast.success('Login efetuado com sucesso!')
        setIsSheetOpen(false)
      }
    } catch {
      toast.error('Erro ao cadastrar usuário!')
    }
  }

  return (
    <Sheet open={isSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" onClick={() => setIsSheetOpen(true)}>
          Cadastrar
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <SheetHeader>
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
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">
                      Data de Nascimento
                    </FormLabel>
                    <FormControl className="w-full">
                      <DatePickerDemo
                        date={field.value}
                        setDate={field.onChange}
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
                        placeholder="shadcn"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          field.onChange(file) // Manually call the onChange method with the selected file
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
                        defaultValue="ADMIN"
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
              <SheetClose asChild>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Salvar
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
