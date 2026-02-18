import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react'
import { authService } from '../services/auth.service'
import { useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const queryClient = useQueryClient()

  // Verificar autenticação no cliente
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    if (isAuthenticated) {
      router.navigate({ to: '/' })
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    console.log(`[Auth] Attempting login for: ${email}`)

    try {
      const response = await authService.login({ email, password })

      console.log(`[Auth] ✅ Login successful for ${email}. Role: ${response.user.role}`)
      console.log(`[Auth] SessionToken: ${response.sessionToken.substring(0, 10)}...`)
      console.log(`[Auth] RefreshToken: ${response.refreshToken.substring(0, 10)}...`)

      // Invalida a query de sessão para forçar o RootLayout a atualizar
      queryClient.invalidateQueries({ queryKey: ['session'] })

      router.navigate({ to: '/' })
    } catch (err: any) {
      const status = err.response?.status
      const message = err.response?.data?.message || err.message

      console.error(`[Auth] ❌ Login failed for ${email}`)
      console.error(`[Auth] Status: ${status}`)
      console.error(`[Auth] Error: ${message}`)

      if (status === 401) {
        setError('E-mail ou senha inválidos. Por favor, verifique suas credenciais.')
      } else if (status === 404) {
        setError('Usuário não encontrado. Verifique se o e-mail está correto.')
      } else if (!navigator.onLine || err.code === 'ERR_NETWORK') {
        setError('Erro de conexão. Verifique sua internet ou se o backend está rodando.')
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente mais tarde.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-notion-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <h1 className="text-2xl font-bold text-notion-text">Kanban SaaS</h1>
          </div>
          <p className="text-notion-text-muted">
            Gerencie suas tarefas
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-notion-sidebar border border-notion-border rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-notion-text mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-notion-text-muted" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 bg-notion-hover border border-notion-border rounded-lg text-notion-text placeholder-notion-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-notion-text mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-notion-text-muted" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-12 py-3 bg-notion-hover border border-notion-border rounded-lg text-notion-text placeholder-notion-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-notion-text-muted hover:text-notion-text transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-800/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-notion-border">
            <div className="text-xs text-notion-text-muted text-center">
              <strong>Credenciais de demonstração (Base):</strong><br />
              <p>E-mail: allan.azevedo@gmail.com</p>
              <p>Senha: 12345678</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-notion-text-muted">
            Inspirado no design minimalista
          </p>
        </div>
      </div>
    </div>
  )
}
