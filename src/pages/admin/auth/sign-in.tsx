import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { signIn } from '@/api/sign-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})
type LoginFormInputs = z.infer<typeof loginFormSchema>

export function AdminSignIn() {
  const [searchParams] = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      password: searchParams.get('password') ?? '',
    },
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  async function handleLogin(data: LoginFormInputs) {
    try {
      await authenticate({ email: data.email, password: data.password })
      toast.success('Enviamos um link de autenticação para seu e-mail')
    } catch {
      toast.error('Credencias invalidas!', {
        action: {
          label: 'Reenviar',
          onClick: () => handleLogin(data),
        },
      })
    }
  }

  return (
    <div>
      <Helmet>
        <title>Admin Login</title>
      </Helmet>
      <div className="p-8">
        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar admin
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie seu e-commerce!
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="Insira seu e-mail"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Senha</Label>
              <Input
                {...register('password')}
                id="password"
                type="password"
                placeholder="Insira sua senha"
                required
              />
            </div>
            <Button
              disabled={isSubmitting}
              variant="default"
              type="submit"
              className="w-full"
            >
              Acessar
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
