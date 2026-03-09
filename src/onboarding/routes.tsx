import { createBrowserRouter, Navigate } from 'react-router-dom';
import OnboardingLayout from './components/layout/OnboardingLayout';
import { STEP_CONFIG, WELCOME_PATH } from './config/steps';

export const onboardingRouter = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={WELCOME_PATH} replace />,
  },
  {
    element: <OnboardingLayout />,
    children: STEP_CONFIG.map((step) => {
      const Component = step.component;
      return { path: step.path, element: <Component /> };
    }),
  },
]);
