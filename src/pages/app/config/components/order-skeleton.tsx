import { Boxes } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export function OrderSkeleton() {
  return Array.from({ length: 10 }).map((_, i) => {
    return (
      <Card key={i} className="bg-muted">
        <CardContent className="flex w-full flex-col gap-4">
          <div className="text-md w-full border-b p-2 font-semibold tracking-tighter">
            <Skeleton className="h-4 w-[110px]" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-lg">
              <p className="text-sm font-bold text-blue-800 md:text-2xl">
                <Skeleton className="h-4 w-[110px]" />
              </p>
              <Separator
                orientation="vertical"
                className="h-5 bg-black text-black"
              />
              <p className="font-semibold text-muted-foreground">
                <Skeleton className="h-4 w-[110px]" />
              </p>
            </div>
            <div>
              <Button variant="outline" size="lg">
                <Boxes className="mr-2 h-6 w-6" />
                <span className="">Visualizar itens</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  })
}
