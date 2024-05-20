import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { Button } from './ui/button'

export interface PaginationProps {
  pageIndex: number
  totalCount: number
  perPage: number
  onChangePage: (pageIndex: number) => Promise<void> | void
}

export function Pagination({
  pageIndex,
  totalCount,
  perPage,
  onChangePage,
}: PaginationProps) {
  const pages = Math.ceil(totalCount / perPage) || 1

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground ">
        Total de {totalCount} item(s)
      </span>
      <div className="flex items-center gap-6 lg:gap-8">
        <div className="text-sm font-medium">
          Pagina {pageIndex + 1} de {pages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onChangePage(0)}
            type="button"
            variant="outline"
            size="xs"
            className="h-8 w-8 p-0"
            disabled={pageIndex === 0}
          >
            <ChevronsLeft />
            <span className="sr-only">Primeira página</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="xs"
            className="h-8 w-8 p-0"
            onClick={() => onChangePage(pageIndex - 1)}
            disabled={pageIndex === 0}
          >
            <ChevronLeft />
            <span className="sr-only">Página anterior</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="xs"
            className="h-8 w-8 p-0"
            onClick={() => onChangePage(pageIndex + 1)}
            disabled={pages <= pageIndex + 1}
          >
            <ChevronRight />
            <span className="sr-only">Próxima página</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="xs"
            className="h-8 w-8 p-0"
            onClick={() => onChangePage(pages - 1)}
            disabled={pages <= pageIndex + 1}
          >
            <ChevronsRight />
            <span className="sr-only">Última página</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
