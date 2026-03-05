import { createBrowserRouter, Navigate } from 'react-router-dom';
import WizardLayout from './components/layout/WizardLayout';
import WelcomeStep from './components/steps/WelcomeStep';
import ProfileStep from './components/steps/ProfileStep';
import PreferencesStep from './components/steps/PreferencesStep';
import IdentityStep from './components/steps/IdentityStep';
import FinishStep from './components/steps/FinishStep';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/welcome" replace />,
  },
  {
    element: <WizardLayout />,
    children: [
      { path: '/welcome', element: <WelcomeStep /> },
      { path: '/profile', element: <ProfileStep /> },
      { path: '/preferences', element: <PreferencesStep /> },
      { path: '/identity', element: <IdentityStep /> },
      { path: '/finish', element: <FinishStep /> },
    ],
  },
]);
