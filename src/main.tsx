import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HeroUIProvider } from '@heroui/react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import './styles/globals.css'

// Import the generated route tree (created by @tanstack/router-plugin)
// Fallback: type-only stub exists for tsc when the file isn't generated yet
import { routeTree } from './routeTree.gen'
import { initAuth } from './lib/keycloak'
import { RECAPTCHA_SITE_KEY } from './lib/recaptcha'

const router = createRouter({ routeTree })
const queryClient = new QueryClient()

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

async function bootstrap() {
  if (import.meta.env.MODE === 'mock') {
    const { worker } = await import('./mocks/browser')
    await worker.start()
  }

  // Initialize Keycloak (silent SSO if configured)
  try {
    await initAuth()
  } catch (e) {
    // Non-fatal at startup; admin routes enforce login via beforeLoad
  }

  const root = createRoot(document.getElementById('root')!)
  root.render(
    <StrictMode>
      <GoogleReCaptchaProvider
        reCaptchaKey={RECAPTCHA_SITE_KEY}
        scriptProps={{
          async: true,
          defer: true,
          appendTo: 'head',
        }}
      >
        <HeroUIProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </HeroUIProvider>
      </GoogleReCaptchaProvider>
    </StrictMode>,
  )
}

bootstrap()
