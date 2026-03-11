import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useMutation } from '@tanstack/react-query';
import { mockOnboardingApi } from '../api/mockOnboardingApi';
import { useOnboardingProgress } from '../queries/useOnboardingProgress';
import { useSaveOnboardingProgress } from '../queries/useSaveOnboardingProgress';
import type {
  BusinessDetailsData,
  IdentityData,
  OnboardingConfig,
  PreferencesData,
  ProfileData,
  OnboardingFormData,
} from '../types/onboarding';
import type { FormStepId } from '../config/steps';

/**
 * Minimal form step shape that context needs: id for lookup, path for routing.
 * The full FormStepConfig (with component ref) lives in config/steps.ts and is
 * passed in via the defaultFormSteps prop so context never imports that file.
 */
interface FormStepMeta {
  id: string;
  path: string;
}

// Structural path constants for the journey bounds.
// These never change based on server config — only the middle form steps do.
const QUALIFY_PATH = '/qualify';
const FINISH_PATH = '/finish';

interface OnboardingProviderProps {
  children: ReactNode;
  /** All possible form steps. Passed in from main.tsx to avoid a circular import. */
  defaultFormSteps: FormStepMeta[];
}

interface OnboardingContextValue {
  formData: OnboardingFormData;
  currentStepId: string | null;
  completedStepIds: string[];
  isCompletingStep: boolean;
  isStepValid: boolean;
  isLoaded: boolean;
  isLoadError: boolean;
  activeFormSteps: FormStepMeta[];
  activeStepRoutes: string[];
  setStepData: (step: FormStepId, data: ProfileData | PreferencesData | BusinessDetailsData | IdentityData) => void;
  setCurrentStepId: (id: string | null) => void;
  setStepValid: (valid: boolean) => void;
  completeStep: (stepId: string, options?: { onSuccess?: () => void }) => void;
  resetWizard: () => void;
  applyConfig: (config: OnboardingConfig) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

const DEFAULT_FORM_DATA: OnboardingFormData = {
  profile: null,
  preferences: null,
  'business-details': null,
  identity: null,
};

export function OnboardingProvider({ children, defaultFormSteps }: OnboardingProviderProps) {
  const [formData, setFormData] = useState<OnboardingFormData>(DEFAULT_FORM_DATA);
  const [currentStepId, setCurrentStepIdState] = useState<string | null>(null);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [isStepValid, setIsStepValid] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [activeFormSteps, setActiveFormSteps] = useState<FormStepMeta[]>(() => [...defaultFormSteps]);

  // Refs so the OnboardingLayout route guard always reads the latest values
  // without those values being in the guard's dependency array (avoids redirect races).
  const activeFormStepsRef = useRef(activeFormSteps);
  const completedStepIdsRef = useRef(completedStepIds);
  activeFormStepsRef.current = activeFormSteps;
  completedStepIdsRef.current = completedStepIds;

  const activeStepRoutes = useMemo(
    () => [QUALIFY_PATH, ...activeFormSteps.map((s) => s.path), FINISH_PATH],
    [activeFormSteps]
  );

  const { data: savedProgress, isSuccess, isError: isLoadError } = useOnboardingProgress();
  const { mutate: saveProgress } = useSaveOnboardingProgress();

  // Seed local state from persisted progress on first load.
  // Old localStorage keys (currentStep/completedSteps) gracefully become null/[].
  useEffect(() => {
    if (!isSuccess && !isLoadError) return;
    if (savedProgress) {
      setFormData(savedProgress.formData ?? DEFAULT_FORM_DATA);
      setCurrentStepIdState(savedProgress.currentStepId ?? null);
      setCompletedStepIds(savedProgress.completedStepIds ?? []);
      // Restore the journey the user selected before the refresh
      if (savedProgress.activeStepIds?.length) {
        const resolved = savedProgress.activeStepIds
          .map((id) => defaultFormSteps.find((s) => s.id === id))
          .filter((s): s is FormStepMeta => s !== undefined);
        if (resolved.length > 0) setActiveFormSteps(resolved);
      }
    }
    setIsLoaded(true);
  }, [isSuccess, isLoadError]);

  // Debounced persist whenever state changes after initial load
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!isLoaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveProgress({
        formData,
        currentStepId,
        completedStepIds,
        activeStepIds: activeFormSteps.map((s) => s.id),
      });
    }, 300);
  }, [isLoaded, formData, currentStepId, completedStepIds, activeFormSteps]);

  const setStepData = (
    step: FormStepId,
    data: ProfileData | PreferencesData | BusinessDetailsData | IdentityData
  ) => {
    setFormData((prev) => ({ ...prev, [step]: data }));
  };

  const setCurrentStepId = (id: string | null) => {
    setCurrentStepIdState(id);
    setIsStepValid(false);
  };

  const setStepValid = (valid: boolean) => setIsStepValid(valid);

  // The completeStep mutation — one API call per step advancement.
  const { mutate: _completeStep, isPending: isCompletingStep } = useMutation({
    mutationFn: (stepId: string) => mockOnboardingApi.completeStep(stepId),
  });

  const completeStep = useCallback(
    (stepId: string, options?: { onSuccess?: () => void }) => {
      _completeStep(stepId, {
        onSuccess: () => {
          // Use functional update + sync the ref so the route guard reads the new value
          // before the navigation triggered by options.onSuccess changes the URL.
          setCompletedStepIds((prev) => {
            const updated = prev.includes(stepId) ? prev : [...prev, stepId];
            completedStepIdsRef.current = updated;
            return updated;
          });
          options?.onSuccess?.();
        },
      });
    },
    [_completeStep]
  );

  const resetWizard = () => {
    setFormData(DEFAULT_FORM_DATA);
    setCurrentStepIdState(null);
    setCompletedStepIds([]);
    completedStepIdsRef.current = [];
    setIsStepValid(false);
    setActiveFormSteps([...defaultFormSteps]);
  };

  const applyConfig = (config: OnboardingConfig) => {
    const resolved = config.steps
      .map((id) => defaultFormSteps.find((s) => s.id === id))
      .filter((s): s is FormStepMeta => s !== undefined);
    setActiveFormSteps(resolved.length > 0 ? resolved : [...defaultFormSteps]);
  };

  return (
    <OnboardingContext.Provider
      value={{
        formData,
        currentStepId,
        completedStepIds,
        isCompletingStep,
        isStepValid,
        isLoaded,
        isLoadError,
        activeFormSteps,
        activeStepRoutes,
        setStepData,
        setCurrentStepId,
        setStepValid,
        completeStep,
        resetWizard,
        applyConfig,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
