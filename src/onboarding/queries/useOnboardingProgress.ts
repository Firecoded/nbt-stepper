import { useQuery } from '@tanstack/react-query';
import { mockOnboardingApi } from '../api/mockOnboardingApi';
import type { OnboardingProgress } from '../types/onboarding';

export function useOnboardingProgress() {
  return useQuery<OnboardingProgress | null>({
    queryKey: ['onboarding', 'progress'],
    queryFn: async () => {
      // TODO: replace mock with real endpoint when API is available
      // const res = await fetch('/api/v1/onboarding/progress')
      // if (!res.ok) return null
      // return res.json()
      return mockOnboardingApi.loadProgress();
    },
    staleTime: Infinity,
  });
}
