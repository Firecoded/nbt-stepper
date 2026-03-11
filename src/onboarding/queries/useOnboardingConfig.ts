import { useMutation } from '@tanstack/react-query';
import { mockOnboardingApi } from '../api/mockOnboardingApi';
import type { OnboardingConfig, QualifierAnswers } from '../types/onboarding';

/**
 * Fetches the server-driven onboarding config for the given qualifier answers.
 * The config determines which form steps are shown and in what order.
 * TODO: replace mock with real endpoint → POST /api/v1/onboarding/config
 */
export function useOnboardingConfig() {
  return useMutation<OnboardingConfig, Error, QualifierAnswers>({
    mutationFn: async (answers) => {
      // TODO: replace mock with real endpoint when API is available
      // const res = await fetch('/api/v1/onboarding/config', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(answers),
      // })
      // if (!res.ok) throw new Error('Failed to fetch onboarding config')
      // return res.json()
      return mockOnboardingApi.getOnboardingConfig(answers);
    },
  });
}
