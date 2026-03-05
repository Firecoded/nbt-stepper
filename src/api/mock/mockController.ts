import { delay } from './delay';
import { storageService } from '../../services/storageService';
import type { WizardDraft, WizardSubmission } from '../../types/wizard';

export type ScreenNameCheckResult =
  | { status: 'available' }
  | { status: 'unavailable'; suggestions: string[] };

/**
 * Mirrors what real HTTP endpoints would look like.
 * To integrate a real backend, replace these implementations in wizardService.ts
 * with fetch/axios calls — the return shapes stay identical.
 */
export const mockController = {
  async loadDraft(): Promise<WizardDraft | null> {
    await delay(100);
    return storageService.get<WizardDraft>('nbt_draft');
  },

  async saveDraft(draft: WizardDraft): Promise<void> {
    await delay(80);
    storageService.set('nbt_draft', draft);
  },

  async checkScreenName(value: string): Promise<ScreenNameCheckResult> {
    // Simulate network latency for a real uniqueness check
    await delay(600 + Math.random() * 400);
    if (!/\d/.test(value)) {
      return {
        status: 'unavailable',
        suggestions: [`${value}42`, `${value}7`],
      };
    }
    return { status: 'available' };
  },

  async submit(data: WizardSubmission): Promise<void> {
    await delay(800 + Math.random() * 400);
    storageService.set('nbt_submitted', data);
    storageService.remove('nbt_draft');
  },
};
