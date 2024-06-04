import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarNavItem {
  title: string
  href: string
}

interface SidebarNavProps {
  className?: string
  items: SidebarNavItem[]
  activeItem: string
  onItemClick: (itemHref: string) => void
}

function SidebarNav({
  className,
  items,
  activeItem,
  onItemClick,
  ...props
}: SidebarNavProps) {
  return (
    <nav className={cn('flex flex-col space-y-2', className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          to="#"
          onClick={() => onItemClick(item.href)}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            activeItem === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

export default SidebarNav
