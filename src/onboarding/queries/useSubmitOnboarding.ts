import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mockOnboardingApi } from '../api/mockOnboardingApi';
import { useToast } from '../../shared/components/ui/Toaster';
import type { OnboardingSubmission } from '../types/onboarding';

export function useSubmitOnboarding() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (data: OnboardingSubmission) => {
      // TODO: replace mock with real endpoint when API is available
      // const res = await fetch('/api/v1/onboarding/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })
      // if (!res.ok) throw new Error('Submission failed')
      return mockOnboardingApi.submit(data);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['onboarding', 'progress'] });
    },
    onError: () => {
      showToast('Account creation failed. Please try again.');
    },
  });
}
