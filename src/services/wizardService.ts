import { mockController } from '../api/mock/mockController';
import type { ScreenNameCheckResult } from '../api/mock/mockController';
import type { WizardDraft, WizardSubmission } from '../types/wizard';

/**
 * Business logic layer — the seam between the UI and data persistence.
 *
 * To integrate a real backend:
 *   1. Replace mockController calls with fetch/axios pointing at your API
 *   2. The return types and method signatures stay identical
 *   3. Components and context remain untouched
 */
export const wizardService = {
  async loadDraft(): Promise<WizardDraft | null> {
    return mockController.loadDraft();
  },

  async saveDraft(draft: WizardDraft): Promise<void> {
    return mockController.saveDraft(draft);
  },

  async checkScreenName(value: string): Promise<ScreenNameCheckResult> {
    return mockController.checkScreenName(value);
  },

  async submit(data: WizardSubmission): Promise<void> {
    return mockController.submit(data);
  },
};
