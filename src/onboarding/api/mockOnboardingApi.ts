import { promiseDelay } from '../../shared/lib/promiseDelay';
import { localStorageService } from '../../shared/services/localStorageService';
import type { OnboardingProgress, OnboardingSubmission, ScreenNameCheckResult } from '../types/onboarding';

export const mockOnboardingApi = {
  async loadProgress(): Promise<OnboardingProgress | null> {
    await promiseDelay(100);
    return localStorageService.get<OnboardingProgress>('nbt_progress');
  },

  async saveProgress(progress: OnboardingProgress): Promise<void> {
    await promiseDelay(80);
    localStorageService.set('nbt_progress', progress);
  },

  async checkScreenName(value: string): Promise<ScreenNameCheckResult> {
    // Simulate network latency for a real uniqueness check
    await promiseDelay(600 + Math.random() * 400);
    if (!/\d/.test(value)) {
      return {
        status: 'unavailable',
        suggestions: [`${value}42`, `${value}7`],
      };
    }
    return { status: 'available' };
  },

  async submit(data: OnboardingSubmission): Promise<void> {
    await promiseDelay(800 + Math.random() * 400);
    localStorageService.set('nbt_submitted', data);
    localStorageService.remove('nbt_progress');
  },
};
