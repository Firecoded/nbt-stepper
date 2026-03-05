export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface PreferencesData {
  role: string;
  interests: string[];
}

export interface IdentityData {
  avatarId: string;
  screenName: string;
}

export interface WizardFormData {
  profile: ProfileData | null;
  preferences: PreferencesData | null;
  identity: IdentityData | null;
}

export interface WizardDraft {
  formData: WizardFormData;
  currentStep: number;
  completedSteps: number[];
}

export interface WizardSubmission {
  profile: ProfileData;
  preferences: PreferencesData;
  identity: IdentityData;
  submittedAt: string;
}

export type ScreenNameStatus = 'idle' | 'typing' | 'checking' | 'available' | 'unavailable' | 'too-short';
