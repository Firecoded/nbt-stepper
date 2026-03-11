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

export interface BusinessDetailsData {
  companyName: string;
  industry: string;
}

export interface OnboardingFormData {
  profile: ProfileData | null;
  preferences: PreferencesData | null;
  'business-details': BusinessDetailsData | null;
  identity: IdentityData | null;
}

export interface OnboardingProgress {
  formData: OnboardingFormData;
  currentStepId: string | null;
  completedStepIds: string[];
  /** Ordered IDs of the form steps resolved from the last journey manifest response. */
  activeStepIds: string[];
}

export interface OnboardingSubmission {
  profile: ProfileData;
  preferences: PreferencesData | null;
  'business-details': BusinessDetailsData | null;
  identity: IdentityData;
  submittedAt: string;
}

/** Sent to the server to determine which steps to show. */
export interface QualifierAnswers {
  accountType: 'personal' | 'business';
}

/**
 * Server response that drives the wizard flow.
 * `steps` is an ordered list of form step IDs to activate.
 * Unknown IDs are silently skipped; missing IDs fall back to the full static config.
 */
export interface OnboardingConfig {
  steps: string[];
}

export type ScreenNameCheckResult =
  | { status: 'available' }
  | { status: 'unavailable'; suggestions: string[] };

export type ScreenNameStatus = 'idle' | 'typing' | 'checking' | 'available' | 'unavailable' | 'too-short' | 'error';
