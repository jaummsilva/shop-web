import { Store } from 'lucide-react'

export function StoreFooter() {
  return (
    <footer className="dark:bg-dark fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-gray-300 bg-white dark:bg-black">
      <div className="flex h-full flex-row items-center justify-center px-6">
        <p className="flex gap-2 text-center text-gray-500">
          <Store className="h-6 w-6" />© 2024 JV Shop - Rio Grande do Sul, 385.
          Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
