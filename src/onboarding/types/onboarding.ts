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

export interface OnboardingFormData {
  profile: ProfileData | null;
  preferences: PreferencesData | null;
  identity: IdentityData | null;
}

export interface OnboardingProgress {
  formData: OnboardingFormData;
  currentStep: number;
  completedSteps: number[];
}

export interface OnboardingSubmission {
  profile: ProfileData;
  preferences: PreferencesData;
  identity: IdentityData;
  submittedAt: string;
}

export type ScreenNameCheckResult =
  | { status: 'available' }
  | { status: 'unavailable'; suggestions: string[] };

export type ScreenNameStatus = 'idle' | 'typing' | 'checking' | 'available' | 'unavailable' | 'too-short' | 'error';
