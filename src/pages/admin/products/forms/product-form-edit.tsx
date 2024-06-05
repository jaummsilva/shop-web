import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { updateProduct } from '@/api/admin/update-product'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { env } from '@/env'
import { queryClient } from '@/lib/react-query'
import { formatPrice } from '@/utils/format-price'
import { validateImageFile } from '@/utils/validate-image'

import type { ProductEditFormProps } from '../types/product-edit-form-props'

const productEditSchema = z.object({
  name: z
    .string({
      required_error: '',
    })
    .min(3, 'O nome deve ter no mínimo 3 caracteres.')
    .max(255, 'O nome deve ter no máximo 255 caracteres.'),
  description: z
    .string({
      required_error: '',
    })
    .max(255, 'A descrição deve ter no máximo 255 caracteres.')
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
    })
    .optional(),
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
  deleteImagesOptional: z.boolean().default(false).optional(),
})

type ProductEditSchema = z.infer<typeof productEditSchema>

type ImageFile = {
  file: File
  previewUrl: string
}

export function ProductEditForm({
  product,
  setIsSheetOpen,
}: ProductEditFormProps) {
  const [selectedPhotoPrincipal, setSelectedPhotoPrincipal] =
    useState<ImageFile | null>(null)
  const [selectedPhotos, setSelectedPhotos] = useState<ImageFile[]>([])
  const [selectedOptionalPhotos, setSelectedOptionalPhotos] =
    useState<boolean>(false)

  const form = useForm<ProductEditSchema>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price.toString(),
    },
  })

  async function onSubmit(data: ProductEditSchema) {
    try {
      const formData = new FormData()
      formData.append('productId', product.id)
      formData.append('name', data.name)
      formData.append('price', (data.price ?? '0').toString())

      if (data.description !== '') {
        formData.append('description', data.description ?? '')
      }

      if (data.photoPrincipal instanceof File) {
        formData.append('photoPrincipal', data.photoPrincipal)
      }

      if (data.photos?.length) {
        for (let i = 0; i < data.photos.length; i++) {
          formData.append(`photos${i}`, data.photos[i])
        }
      }

      formData.append(
        'deleteImagesOptional',
        data.deleteImagesOptional ? 'Y' : 'N',
      )

      const response = await updateProduct(formData)

      if (response.status === 204) {
        if (data.deleteImagesOptional) {
          setSelectedPhotos([])
          form.setValue('photos', [])
        }
        toast.success('Produto editado com sucesso!')
        setIsSheetOpen(false)

        await queryClient.invalidateQueries({
          queryKey: ['products'],
        })
        setSelectedOptionalPhotos(false)
      }
    } catch {
      toast.error('Erro ao editar produto!')
    }
  }

  const handlePhotoPrincipalChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedPhotoPrincipal({
        file,
        previewUrl: URL.createObjectURL(file),
      })
      form.setValue('photoPrincipal', file)
    }
  }

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const selected = Array.from(files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }))

      setSelectedPhotos(selected)

      if (selected.length === 0) {
        setSelectedOptionalPhotos(false)
      } else {
        form.setValue(
          'photos',
          selected.map((item) => item.file),
        )
        form.setValue('deleteImagesOptional', false)
        setSelectedOptionalPhotos(true)
      }
    }
  }

  useEffect(() => {
    if (product.productImages.length > 0) {
      const principalImage = product.productImages.find(
        (img) => img.isPrincipal,
      )
      if (principalImage) {
        const imageUrl = principalImage.imageUrl
        setSelectedPhotoPrincipal({
          file: new File([], ''),
          previewUrl: env.VITE_API_URL.concat(imageUrl),
        })
      }

      const otherImages = product.productImages.filter(
        (img) => !img.isPrincipal,
      )
      if (otherImages.length > 0) {
        const files = otherImages.map((img) => ({
          file: new File([], ''),
          previewUrl: env.VITE_API_URL.concat(img.imageUrl),
        }))
        setSelectedPhotos(files)
      } else {
        setSelectedPhotos([])
      }
      setSelectedOptionalPhotos(false)
      form.setValue('deleteImagesOptional', false)
      form.setValue('photos', [])
    }
  }, [product])

  return (
    <SheetContent className="overflow-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 py-4"
        >
          <SheetHeader className="flex flex-row items-center gap-2">
            <SheetTitle>{product && product.name}</SheetTitle>
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">Preço</FormLabel>
                  <FormControl>
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
                        field.onChange(Number(field.value).toFixed(2))
                      }}
                      value={formatPrice(Number(field.value))}
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
                      placeholder="Selecione uma foto"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        handlePhotoPrincipalChange(e)
                        field.onChange(file)
                      }}
                    />
                  </FormControl>
                  {selectedPhotoPrincipal && (
                    <div className="mt-2 flex h-40 justify-center overflow-auto">
                      <img
                        src={selectedPhotoPrincipal.previewUrl}
                        alt="Foto Principal"
                        className="rounded object-cover"
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
                    <div className="mt-3 flex h-20 w-full justify-center gap-4 overflow-auto">
                      {selectedPhotos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo.previewUrl}
                          alt={`Photo ${index}`}
                          className="rounded object-cover"
                          style={{ maxWidth: '100%' }}
                        />
                      ))}
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
              name="deleteImagesOptional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">
                    Excluir imagens opcionais?
                  </FormLabel>
                  <FormControl className="ml-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={selectedOptionalPhotos}
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
    </SheetContent>
  )
}
