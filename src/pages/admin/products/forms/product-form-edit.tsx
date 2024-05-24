import { zodResolver } from '@hookform/resolvers/zod'
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
import { queryClient } from '@/lib/react-query'
import { formatPrice } from '@/utils/format-price'

type ProductEditFormProps = {
  product: {
    id: string
    name: string
    description?: string
    price: number
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
})

type ProductEditSchema = z.infer<typeof productEditSchema>

export const ProductEditForm: React.FC<ProductEditFormProps> = ({
  product,
  setIsSheetOpen,
}) => {
  const form = useForm<ProductEditSchema>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
    },
  })

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
      toast.error('Erro ao editar producto!')
    }
  }

  return (
    <SheetContent className="overflow-auto ">
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
