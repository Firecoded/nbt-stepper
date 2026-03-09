import WelcomeStep from '../components/steps/WelcomeStep';
import ProfileStep from '../components/steps/ProfileStep';
import PreferencesStep from '../components/steps/PreferencesStep';
import IdentityStep from '../components/steps/IdentityStep';
import FinishStep from '../components/steps/FinishStep';

export const STEP_CONFIG = [
  { type: 'welcome' as const, id: 'welcome' as const, path: '/welcome', component: WelcomeStep },
  { type: 'form' as const, id: 'profile' as const, path: '/profile', component: ProfileStep },
  { type: 'form' as const, id: 'preferences' as const, path: '/preferences', component: PreferencesStep },
  { type: 'form' as const, id: 'identity' as const, path: '/identity', component: IdentityStep },
  { type: 'finish' as const, id: 'finish' as const, path: '/finish', component: FinishStep },
] as const;

type StepConfig = (typeof STEP_CONFIG)[number];
type FormStepConfig = Extract<StepConfig, { type: 'form' }>;

export type FormStepId = FormStepConfig['id'];

export const FORM_STEPS = STEP_CONFIG.filter(
  (s): s is FormStepConfig => s.type === 'form'
);

/**
 * Typed step ids derived from FORM_STEPS. Shape: { profile: 'profile', preferences: 'preferences', identity: 'identity' }.
 * Use FORM_STEP_IDS.identity instead of the string 'identity' so call sites get autocomplete and typo protection.
 * Derived from FORM_STEPS so adding a step only requires updating the config — no separate enum or constant to maintain.
 */
export const FORM_STEP_IDS = Object.fromEntries(
  FORM_STEPS.map((s) => [s.id, s.id])
) as { [K in FormStepId]: K };

export const STEP_ROUTES = STEP_CONFIG.map((s) => s.path);

export type StepRoute = StepConfig['path'];

export const WELCOME_PATH = STEP_CONFIG.find((s) => s.id === 'welcome')!.path;
export const FINISH_PATH = STEP_CONFIG.find((s) => s.id === 'finish')!.path;

/** Returns the context step index (1-based for form steps) for a given form step id. */
export function getStepIndex(stepId: FormStepId): number {
  const i = FORM_STEPS.findIndex((s) => s.id === stepId);
  return i >= 0 ? i + 1 : 0;
}

/** Path for the step immediately after the given form step. */
export function getNextStepPath(stepId: FormStepId): StepRoute {
  return STEP_ROUTES[getStepIndex(stepId) + 1];
}

/** Index of the first step with type 'form'. */
export const FIRST_FORM_STEP_INDEX = STEP_CONFIG.findIndex((s) => s.type === 'form');

/** Last form step index (index of the final step before finish). */
export const LAST_FORM_STEP_INDEX = FORM_STEPS.length;
