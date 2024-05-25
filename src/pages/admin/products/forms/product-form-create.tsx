import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { useState } from 'react'
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
import { validateImageFile } from '@/utils/validate-image'

import type { ProductCreateFormProps } from '../types/product-create-form-props'

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
    .refine((value) => {
      const parsedValue = parseFloat(value)
      return !isNaN(parsedValue) && parsedValue > 0
    }, 'O preço deve ser um número maior que zero.'),
  photoPrincipal: z
    .instanceof(File, {
      message: 'O tipo do arquivo deve ser imagem',
    })
    .refine(async (file) => await validateImageFile(file), {
      message: 'A imagem deve ser JPG ou PNG e ter menos de 1MB.',
    }),
  photos: z
    .array(
      z
        .instanceof(File, {
          message: 'O tipo do arquivo deve ser imagem',
        })
        .refine(async (file) => await validateImageFile(file), {
          message: 'A imagem deve ser JPG ou PNG e ter menos de 1MB.',
        }),
    )
    .max(3, 'Máximo de 3 fotos permitidas.')
    .optional(),
})

type ProductCreateSchema = z.infer<typeof productCreateSchema> // Definir o tipo aqui

export function ProductFormCreate({ onClose }: ProductCreateFormProps) {
  const [selectedPhotoPrincipal, setSelectedPhotoPrincipal] =
    useState<File | null>(null)
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([])

  const form = useForm<ProductCreateSchema>({
    resolver: zodResolver(productCreateSchema),
  })

  async function onSubmit(data: ProductCreateSchema) {
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('price', (data.price ?? 0).toString())

      if (data.photoPrincipal instanceof File) {
        formData.append('photoPrincipal', data.photoPrincipal)
      }

      if (data.description !== undefined) {
        formData.append('description', data.description ?? '')
      }

      if (data.photos?.length) {
        for (let i = 0; i < data.photos.length; i++) {
          formData.append(`photos${i}`, data.photos[i])
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
        setSelectedPhotoPrincipal(null)
        setSelectedPhotos([])
      }
    } catch {
      toast.error('Erro ao cadastrar usuário!')
    }
  }

  const handlePhotoPrincipalChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedPhotoPrincipal(file)
      form.setValue('photoPrincipal', file)
    }
  }

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const selected = Array.from(files)
      setSelectedPhotos(selected)
      form.setValue('photos', selected)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <SheetHeader className="flex flex-row items-center gap-2">
          <UserPlus className="mt-2 size-6" />
          <SheetTitle>Cadastrar Produto</SheetTitle>
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
                      const valorFormatted = (
                        parseFloat(value) / 100
                      ).toString()
                      field.onChange(valorFormatted)
                    }}
                    onBlur={() => {
                      field.onChange(Number(field.value).toFixed(2)) // Formatar para 2 casas decimais ao sair
                    }}
                    value={formatPrice(Number(field.value))} // Formatar o valor exibido
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
                      handlePhotoPrincipalChange(e)
                      field.onChange(file)
                    }}
                  />
                </FormControl>
                {selectedPhotoPrincipal && (
                  <div className="mt-2 h-40 overflow-auto">
                    <img
                      src={URL.createObjectURL(selectedPhotoPrincipal)}
                      alt="Foto Principal"
                      className="h-auto w-full rounded"
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full grid-cols-4 items-center gap-4">
          <FormField
            control={form.control}
            name="photos"
            render={() => (
              <FormItem>
                <FormLabel>Fotos (Opcional, até 3 fotos)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    className="cursor-pointer"
                    accept="image/jpg, image/jpeg, image/png"
                    multiple
                    onChange={handlePhotosChange}
                  />
                </FormControl>
                {selectedPhotos.length > 0 && (
                  <div className="mt-3 grid h-20 grid-cols-3 gap-4 overflow-auto">
                    {selectedPhotos.map((photo, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index}`}
                        className="h-full w-full rounded object-cover"
                      />
                    ))}
                  </div>
                )}
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
