import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useOnboardingProgress } from '../queries/useOnboardingProgress';
import { useSaveOnboardingProgress } from '../queries/useSaveOnboardingProgress';
import type {
  IdentityData,
  PreferencesData,
  ProfileData,
  OnboardingFormData,
} from '../types/onboarding';
import type { FormStepId } from '../config/steps';

interface OnboardingContextValue {
  formData: OnboardingFormData;
  currentStep: number;
  completedSteps: number[];
  isStepValid: boolean;
  isLoaded: boolean;
  isLoadError: boolean;
  setStepData: (
    step: FormStepId,
    data: ProfileData | PreferencesData | IdentityData
  ) => void;
  setCurrentStep: (step: number) => void;
  setStepValid: (valid: boolean) => void;
  markStepComplete: (step: number) => void;
  resetWizard: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

const DEFAULT_FORM_DATA: OnboardingFormData = {
  profile: null,
  preferences: null,
  identity: null,
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<OnboardingFormData>(DEFAULT_FORM_DATA);
  const [currentStep, setCurrentStepState] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isStepValid, setIsStepValid] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { data: savedProgress, isSuccess, isError: isLoadError } = useOnboardingProgress();
  const { mutate: saveProgress } = useSaveOnboardingProgress();

  // Seed local state from persisted progress on first load
  useEffect(() => {
    if (!isSuccess && !isLoadError) return;
    if (savedProgress) {
      setFormData(savedProgress.formData ?? DEFAULT_FORM_DATA);
      setCurrentStepState(savedProgress.currentStep ?? 0);
      setCompletedSteps(savedProgress.completedSteps ?? []);
    }
    setIsLoaded(true);
  }, [isSuccess, isLoadError]);

  // Debounced persist whenever state changes after initial load
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!isLoaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveProgress({ formData, currentStep, completedSteps });
    }, 300);
  }, [isLoaded, formData, currentStep, completedSteps]);

  const setStepData = (
    step: FormStepId,
    data: ProfileData | PreferencesData | IdentityData
  ) => {
    setFormData((prev) => ({ ...prev, [step]: data }));
  };

  const setCurrentStep = (step: number) => {
    setCurrentStepState(step);
    setIsStepValid(false);
  };

  const markStepComplete = (step: number) => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev : [...prev, step]
    );
  };

  const setStepValid = (valid: boolean) => setIsStepValid(valid);

  const resetWizard = () => {
    setFormData(DEFAULT_FORM_DATA);
    setCurrentStepState(0);
    setCompletedSteps([]);
    setIsStepValid(false);
  };

  return (
    <OnboardingContext.Provider
      value={{
        formData,
        currentStep,
        completedSteps,
        isStepValid,
        isLoaded,
        isLoadError,
        setStepData,
        setCurrentStep,
        setStepValid,
        markStepComplete,
        resetWizard,
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
