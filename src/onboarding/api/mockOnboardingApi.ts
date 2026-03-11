import { promiseDelay } from '../../shared/lib/promiseDelay';
import { localStorageService } from '../../shared/services/localStorageService';
import type {
  OnboardingConfig,
  OnboardingProgress,
  OnboardingSubmission,
  QualifierAnswers,
  ScreenNameCheckResult,
} from '../types/onboarding';

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

  /**
   * Returns the ordered list of form steps the server wants the client to render.
   * Simulates a real decisioning call: business accounts get a different flow.
   * TODO: replace with real endpoint → POST /api/v1/onboarding/config
   */
  async getOnboardingConfig(answers: QualifierAnswers): Promise<OnboardingConfig> {
    await promiseDelay(1000);
    if (answers.accountType === 'business') {
      return { steps: ['profile', 'business-details', 'identity'] };
    }
    return { steps: ['profile', 'preferences', 'identity'] };
  },

  /**
   * Marks a single step as complete on the server.
   * In production this would be something like: POST /api/v1/onboarding/steps/:stepId/complete
   */
  async completeStep(_stepId: string): Promise<void> {
    await promiseDelay(350 + Math.random() * 150);
  },

  async submit(data: OnboardingSubmission): Promise<void> {
    await promiseDelay(800 + Math.random() * 400);
    localStorageService.set('nbt_submitted', data);
    localStorageService.remove('nbt_progress');
  },
};
