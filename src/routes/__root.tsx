import { HeadContent, Scripts, createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useRouter } from '@tanstack/react-router'

import Sidebar from '../components/sidebar/Sidebar'
import appCss from '../styles.css?url'

const queryClient = new QueryClient()

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Kanban SaaS - Notion Style',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: '',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      }
    ],
  }),
  component: RootDocument,
})

function RootDocument() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar status de autenticação apenas no cliente
    if (typeof window !== 'undefined') {
      const authenticated = localStorage.getItem('isAuthenticated') === 'true'
      setIsAuthenticated(authenticated)
      setIsLoading(false)

      // Redirecionar para login se não estiver autenticado e não estiver na página de login
      if (!authenticated && window.location.pathname !== '/login') {
        router.navigate({ to: '/login' })
      }
    }
  }, [router])

  return (
    <html lang="pt-br">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {isLoading ? (
            <div className="min-h-screen bg-notion-bg flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !isAuthenticated ? (
            <div className="min-h-screen bg-notion-bg text-notion-text">
              <Outlet />
            </div>
          ) : (
            <div className="flex h-screen w-full overflow-hidden bg-notion-bg text-notion-text">
              <Sidebar />
              <main className="flex-1 overflow-auto relative">
                <Outlet />
              </main>
            </div>
          )}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </QueryClientProvider>
      </body>
    </html>
  )
}
