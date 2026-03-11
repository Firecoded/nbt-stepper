import { createBrowserRouter } from 'react-router-dom';
import OnboardingLayout from './components/layout/OnboardingLayout';
import WelcomeStep from './components/steps/WelcomeStep';
import { STEP_CONFIG } from './config/steps';

export const onboardingRouter = createBrowserRouter([
  {
    // Landing page — lives outside the wizard layout, no stepper or progress guard
    path: '/',
    element: <WelcomeStep />,
  },
  {
    element: <OnboardingLayout />,
    children: STEP_CONFIG.map((step) => {
      const Component = step.component;
      return { path: step.path, element: <Component /> };
    }),
  },
]);
