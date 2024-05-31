import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import nookies from 'nookies'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { adminSignIn } from '@/api/admin/admin-sign-in'
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
  const navigate = useNavigate()

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
    mutationFn: adminSignIn,
  })

  async function handleLogin(data: LoginFormInputs) {
    try {
      nookies.destroy(undefined, 'token_admin')
      const response = await authenticate({
        email: data.email,
        password: data.password,
      })

      const { token } = response.data
      nookies.set(undefined, 'token_admin', token, {
        maxAge: 60 * 60,
        path: '/admin',
      })

      toast.success('Login efetuado com sucesso!')
      navigate('/admin')
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
        <title>Admin</title>
      </Helmet>
      <div className="flex w-[350px] flex-col justify-center gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Acessar <span className="text-blue-700">ADMIN</span>
          </h1>
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
  )
}
