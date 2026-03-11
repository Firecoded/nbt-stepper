import QualifyStep from '../components/steps/QualifyStep';
import ProfileStep from '../components/steps/ProfileStep';
import PreferencesStep from '../components/steps/PreferencesStep';
import BusinessDetailsStep from '../components/steps/BusinessDetailsStep';
import IdentityStep from '../components/steps/IdentityStep';
import FinishStep from '../components/steps/FinishStep';

export const STEP_CONFIG = [
  { type: 'qualify' as const, id: 'qualify' as const, path: '/qualify', component: QualifyStep },
  { type: 'form' as const, id: 'profile' as const, path: '/profile', component: ProfileStep },
  { type: 'form' as const, id: 'preferences' as const, path: '/preferences', component: PreferencesStep },
  { type: 'form' as const, id: 'business-details' as const, path: '/business-details', component: BusinessDetailsStep },
  { type: 'form' as const, id: 'identity' as const, path: '/identity', component: IdentityStep },
  { type: 'finish' as const, id: 'finish' as const, path: '/finish', component: FinishStep },
] as const;

type StepConfig = (typeof STEP_CONFIG)[number];

/** A form step entry — includes the React component reference. */
export type FormStepConfig = Extract<StepConfig, { type: 'form' }>;

export type FormStepId = FormStepConfig['id'];

/**
 * All possible form steps registered on the client. Passed into OnboardingProvider
 * as `defaultFormSteps` so context never needs to import this file directly,
 * breaking the circular dep: steps.ts → StepComponent → OnboardingContext → steps.ts
 */
export const FORM_STEPS = STEP_CONFIG.filter(
  (s): s is FormStepConfig => s.type === 'form'
);

/**
 * Typed step id constants. Shape: { profile: 'profile', preferences: 'preferences', … }.
 * Prefer FORM_STEP_IDS.identity over the string 'identity' for autocomplete + typo safety.
 */
export const FORM_STEP_IDS = Object.fromEntries(
  FORM_STEPS.map((s) => [s.id, s.id])
) as { [K in FormStepId]: K };

/** Landing page — rendered at '/' outside the wizard layout. */
export const HOME_PATH = '/';
export const QUALIFY_PATH = STEP_CONFIG.find((s) => s.id === 'qualify')!.path;
export const FINISH_PATH = STEP_CONFIG.find((s) => s.id === 'finish')!.path;
