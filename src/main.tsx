import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router'
import { WizardProvider } from './context/WizardContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WizardProvider>
      <RouterProvider router={router} />
    </WizardProvider>
  </StrictMode>,
)
