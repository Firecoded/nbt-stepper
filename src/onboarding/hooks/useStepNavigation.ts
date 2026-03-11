import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../context/OnboardingContext';
import { useTelemetry } from './useTelemetry';

const FINISH_PATH = '/finish';

/**
 * Encapsulates forward navigation for a single form step.
 *
 * Usage:
 *   const { advance } = useStepNavigation('profile');
 *   // In your submit handler:
 *   setStepData('profile', data);
 *   advance();
 *
 * `advance` calls the completeStep mutation (~350ms network sim), then navigates
 * to the next step in the active journey. The in-flight loading state is available
 * via `useOnboarding().isCompletingStep` and is automatically reflected in NavButtons.
 */
export function useStepNavigation(stepId: string) {
  const navigate = useNavigate();
  const { completeStep, activeFormSteps } = useOnboarding();
  const { track } = useTelemetry();
  const viewedAtRef = useRef(Date.now());

  const nextPath = useMemo(() => {
    const idx = activeFormSteps.findIndex((s) => s.id === stepId);
    return activeFormSteps[idx + 1]?.path ?? FINISH_PATH;
  }, [activeFormSteps, stepId]);

  const advance = () => {
    const durationMs = Date.now() - viewedAtRef.current;
    completeStep(stepId, {
      onSuccess: () => {
        track({ name: 'step_completed', properties: { stepId, durationMs } });
        navigate(nextPath);
      },
    });
  };

  return { advance };
}
