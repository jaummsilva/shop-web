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

const userFiltersSchema = z.object({
  name: z.string().optional(),
  perPage: z.string(),
})

type UserFilterSchema = z.infer<typeof userFiltersSchema>

export function UserTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const name = searchParams.get('name')
  const perPage = searchParams.get('perPage')

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm<UserFilterSchema>({
    resolver: zodResolver(userFiltersSchema),
    defaultValues: {
      name: name ?? '',
      perPage: perPage ?? '10',
    },
  })

  function handleFilter({ name, perPage }: UserFilterSchema) {
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
      state.set('page', '1')
      return state
    })
    reset({
      name: '',
    })
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex w-full  flex-row justify-between"
    >
      <div className="flex  justify-start">
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
              <SelectTrigger className="h-8 w-[180px]">
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
      <div className="flex w-full items-center justify-end gap-2">
        <span className="text-sm font-semibold">Filtros:</span>
        <Input
          {...register('name')}
          id="name"
          placeholder="Nome do usuario"
          className="h-8 w-[320px]"
        />
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
