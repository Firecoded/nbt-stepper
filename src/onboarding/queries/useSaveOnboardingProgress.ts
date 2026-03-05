import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mockOnboardingApi } from '../api/mockOnboardingApi';
import { useToast } from '../../shared/components/ui/Toaster';
import type { OnboardingProgress } from '../types/onboarding';

export function useSaveOnboardingProgress() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (progress: OnboardingProgress) => {
      // TODO: replace mock with real endpoint when API is available
      // const res = await fetch('/api/v1/onboarding/progress', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(progress),
      // })
      // if (!res.ok) throw new Error('Failed to save progress')
      return mockOnboardingApi.saveProgress(progress);
    },
    onSuccess: (_data, progress) => {
      queryClient.setQueryData(['onboarding', 'progress'], progress);
    },
    onError: () => {
      showToast('Progress could not be saved. Please try again.');
    },
  });
}
