import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const productFiltersSchema = z.object({
  name: z.string().optional(),
  perPage: z.string(),
})

type ProductFilterSchema = z.infer<typeof productFiltersSchema>

export function ProductTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const name = searchParams.get('name')
  const perPage = searchParams.get('perPage')

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm<ProductFilterSchema>({
    resolver: zodResolver(productFiltersSchema),
    defaultValues: {
      name: name ?? '',
      perPage: perPage ?? '10',
    },
  })

  function handleFilter({ name, perPage }: ProductFilterSchema) {
    setSearchParams((state) => {
      if (name) {
        state.set('name', name)
      } else {
        state.delete('name')
      }
      if (perPage) {
        state.set('perPage', perPage)
      } else {
        state.delete('perPage')
      }

      state.set('page', '1')
      return state
    })
  }

  function handleFilterReset() {
    setSearchParams((state) => {
      state.delete('name')
      state.delete('perPage')
      state.set('page', '1')
      return state
    })
    reset({
      name: '',
      perPage: '10',
    })
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex w-full flex-col items-start gap-3 md:flex-row md:gap-2"
    >
      <div className="xs:flex-col flex w-full  flex-row items-center gap-2">
        <span className="text-sm font-semibold">Filtros:</span>
        <Input
          {...register('name')}
          id="name"
          placeholder="Nome do usuário"
          className="h-8 sm:w-[320px]"
        />
        <Controller
          name="perPage"
          control={control}
          render={({ field: { name, onChange, value, disabled } }) => (
            <Select
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[65px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full sm:ml-2 sm:w-auto">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex  flex-row gap-2">
        <Button
          disabled={isSubmitting}
          type="submit"
          variant="secondary"
          size="xs"
          className="md:ml-2"
        >
          <Search className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
        <Button
          disabled={isSubmitting}
          type="button"
          variant="outline"
          size="xs"
          onClick={handleFilterReset}
        >
          <X className="mr-2 h-4 w-4" />
          Remover Filtros
        </Button>
      </div>
    </form>
  )
}
