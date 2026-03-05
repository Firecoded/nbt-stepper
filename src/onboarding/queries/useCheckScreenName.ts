import { useQuery } from '@tanstack/react-query';
import { mockOnboardingApi } from '../api/mockOnboardingApi';
import type { ScreenNameCheckResult } from '../types/onboarding';

export function useCheckScreenName(value: string) {
  return useQuery<ScreenNameCheckResult>({
    queryKey: ['screenName', 'check', value],
    queryFn: async () => {
      // TODO: replace mock with real endpoint when API is available
      // const res = await fetch(`/api/v1/screen-name/check?value=${encodeURIComponent(value)}`)
      // if (!res.ok) throw new Error('Screen name check failed')
      // return res.json()
      return mockOnboardingApi.checkScreenName(value);
    },
    enabled: value.length >= 3,
    staleTime: 30_000,
    retry: false,
  });
}
