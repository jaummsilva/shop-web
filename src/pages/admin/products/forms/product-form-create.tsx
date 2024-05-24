import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createProduct } from '@/api/admin/create-product'
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
import { Separator } from '@/components/ui/separator'
import { SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { queryClient } from '@/lib/react-query'
import { formatPrice } from '@/utils/format-price'

const productCreateSchema = z.object({
  name: z
    .string({
      required_error: '',
    })
    .min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  description: z
    .string({
      required_error: '',
    })
    .optional(),
  price: z
    .string({
      required_error: '',
    })
    .transform((value) => parseFloat(value.replace(',', '.'))),
  photoPrincipal: z
    .instanceof(File, {
      message: 'O tipo do arquivo deve ser imagem',
    })
    .refine(
      (file) => {
        const acceptedTypes = ['image/jpeg', 'image/png']
        const MB_BYTES = 1 * 1024 * 1024 // 1MB in bytes
        return file.size < MB_BYTES && acceptedTypes.includes(file.type)
      },
      {
        message: 'A imagem deve ser JPG ou PNG e ter menos de 1MB.',
      },
    ),
  photos: z
    .array(
      z
        .instanceof(File, {
          message: 'O tipo do arquivo deve ser imagem',
        })
        .refine(
          (file) => {
            const acceptedTypes = ['image/jpeg', 'image/png']
            const MB_BYTES = 1 * 1024 * 1024 // 1MB in bytes
            return file.size < MB_BYTES && acceptedTypes.includes(file.type)
          },
          {
            message: 'A imagem deve ser JPG ou PNG e ter menos de 1MB.',
          },
        ),
    )
    .max(3, 'Máximo de 3 fotos permitidas.')
    .optional(),
})

type ProductCreateSchema = z.infer<typeof productCreateSchema>

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
}

export function ProductFormCreate({ onClose }: ProductFormProps) {
  const form = useForm<ProductCreateSchema>({
    resolver: zodResolver(productCreateSchema),
  })

  async function onSubmit(data: ProductCreateSchema) {
    try {
      const formData = new FormData()

      formData.append('name', data.name)

      if (data.description !== '') {
        formData.append('description', data.description ?? '')
      }

      formData.append('price', (data.price ?? 0).toString())

      formData.append('photoPrincipal', data.photoPrincipal)

      if (data.photos?.length) {
        for (let i = 0; i < data.photos.length; i++) {
          formData.append(`photos[${i}]`, data.photos[i])
        }
      }

      const response = await createProduct(formData)

      if (response.status === 201) {
        toast.success('Produto cadastrado com sucesso!')
        onClose()

        await queryClient.invalidateQueries({
          queryKey: ['products'],
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right">Descrição</FormLabel>
                <FormControl className="w-full">
                  <Input
                    {...field}
                    type="text"
                    className="col-span-8 w-full"
                    placeholder="Digite a descrição"
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right">Preço</FormLabel>
                <FormControl className="w-full">
                  <Input
                    {...field}
                    type="text"
                    className="w-full"
                    placeholder="Digite o preço"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      field.onChange(parseFloat(value) / 100)
                    }}
                    onBlur={() => {
                      field.onChange(Number(field.value).toFixed(2)) // Format to 2 decimal places on blur
                    }}
                    value={formatPrice(Number(field.value))} // Format displayed value
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
            name="photoPrincipal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto Principal</FormLabel>
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
            name="photos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fotos (Opcional, até 3 fotos)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    className="cursor-pointer"
                    accept="image/jpg, image/jpeg, image/png"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files
                      if (files) {
                        field.onChange(Array.from(files))
                      }
                    }}
                  />
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
