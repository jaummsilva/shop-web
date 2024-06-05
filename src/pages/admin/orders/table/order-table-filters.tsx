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

const orderFiltersSchema = z.object({
  query: z.string().optional(),
  perPage: z.string(),
})

type OrderFilterSchema = z.infer<typeof orderFiltersSchema>

export function OrderTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('query')
  const perPage = searchParams.get('perPage')

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm<OrderFilterSchema>({
    resolver: zodResolver(orderFiltersSchema),
    defaultValues: {
      query: query ?? '',
      perPage: perPage ?? '10',
    },
  })

  function handleFilter({ query, perPage }: OrderFilterSchema) {
    setSearchParams((state) => {
      if (query) {
        state.set('query', query)
      } else {
        state.delete('query')
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
      state.delete('query')
      state.delete('perPage')
      state.set('page', '1')
      return state
    })
    reset({
      query: '',
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
          {...register('query')}
          id="name"
          placeholder="Busque pelo id ou nome do usuário"
          className="h-8 w-[320px]"
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
              <SelectContent>
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
