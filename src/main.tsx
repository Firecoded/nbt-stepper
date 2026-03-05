import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { onboardingRouter } from './onboarding/routes'
import { OnboardingProvider } from './onboarding/context/OnboardingContext'
import { ToastProvider } from './shared/components/ui/Toaster'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <OnboardingProvider>
          <RouterProvider router={onboardingRouter} />
        </OnboardingProvider>
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>,
)
