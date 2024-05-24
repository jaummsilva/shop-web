import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
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
import {
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { env } from '@/env'
import { queryClient } from '@/lib/react-query'
import { formatPrice } from '@/utils/format-price'

type ProductEditFormProps = {
  product: {
    id: string
    name: string
    description?: string
    price: number
    productImages: {
      imageUrl: string
      isPrincipal: boolean
    }[]
  }
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const productEditSchema = z.object({
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
        const MB_BYTES = 1 * 1024 * 1024 // 1MB em bytes
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
            const MB_BYTES = 1 * 1024 * 1024 // 1MB em bytes
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

type ProductEditSchema = z.infer<typeof productEditSchema>

type ImageFile = {
  file: File
  previewUrl: string
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({
  product,
  setIsSheetOpen,
}) => {
  const [selectedPhotoPrincipal, setSelectedPhotoPrincipal] =
    useState<ImageFile | null>(null)
  const [selectedPhotos, setSelectedPhotos] = useState<ImageFile[]>([])

  const form = useForm<ProductEditSchema>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
    },
  })

  useEffect(() => {
    if (product.productImages.length > 0) {
      const principalImage = product.productImages.find(
        (img) => img.isPrincipal,
      )
      if (principalImage) {
        const imageUrl = principalImage.imageUrl // Substitua por sua lógica para obter a URL correta
        setSelectedPhotoPrincipal({
          file: new File([], ''), // Aqui você pode definir o arquivo como necessário
          previewUrl: env.VITE_API_URL.concat(imageUrl),
        })
      }

      const otherImages = product.productImages.filter(
        (img) => !img.isPrincipal,
      )
      if (otherImages.length > 0) {
        const files = otherImages.map((img) => ({
          file: new File([], ''), // Aqui você pode definir o arquivo como necessário
          previewUrl: env.VITE_API_URL.concat(img.imageUrl), // Substitua por sua lógica para obter a URL correta
        }))
        setSelectedPhotos(files)
      }
    }
  }, [product])

  async function onSubmit(data: ProductEditSchema) {
    try {
      const formData = new FormData()
      formData.append('productId', product.id)
      formData.append('name', data.name)
      if (data.description !== '') {
        formData.append('description', data.description ?? '')
      }
      formData.append('description', data.description ?? '')

      const response = await createProduct(formData)

      if (response.status === 204) {
        toast.success('Produto editado com sucesso!')
        setIsSheetOpen(false)

        await queryClient.invalidateQueries({
          queryKey: ['products'],
        })

        form.reset()
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
      form.setValue(
        'photos',
        selected.map((item) => item.file),
      )
    }
  }

  console.log(selectedPhotoPrincipal)
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
                        field.onChange(parseFloat(value) / 100)
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
                    <div className="mt-2">
                      <img
                        src={selectedPhotoPrincipal.previewUrl}
                        alt="Foto Principal"
                        className="h-30 w-30"
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
                    <div className="mt-3 grid grid-cols-3 gap-4">
                      {selectedPhotos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo.previewUrl}
                          alt={`Photo ${index}`}
                          className="h-30 w-30 object-cover"
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
    </SheetContent>
  )
}
