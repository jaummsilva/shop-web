import { Link } from 'react-router-dom'

export function Error() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">Whoops, algo aconteceu...</h1>
      <p className="text-accent-foreground">Um erro aconteceu na aplicação</p>
      <p className="text-accent-foreground">
        Voltar para a{' '}
        <Link to="/" className="text-sky-600 dark:text-sky-400">
          {' '}
          loja
        </Link>
      </p>
    </div>
  )
}
