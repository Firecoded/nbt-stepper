import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { wizardService } from '../services/wizardService';
import type {
  IdentityData,
  PreferencesData,
  ProfileData,
  WizardDraft,
  WizardFormData,
} from '../types/wizard';

export const STEP_ROUTES = ['/welcome', '/profile', '/preferences', '/identity', '/finish'] as const;
export type StepRoute = (typeof STEP_ROUTES)[number];

interface WizardContextValue {
  formData: WizardFormData;
  currentStep: number;
  completedSteps: number[];
  isStepValid: boolean;
  isLoaded: boolean;
  setStepData: (
    step: 'profile' | 'preferences' | 'identity',
    data: ProfileData | PreferencesData | IdentityData
  ) => void;
  setCurrentStep: (step: number) => void;
  setStepValid: (valid: boolean) => void;
  markStepComplete: (step: number) => void;
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

const DEFAULT_FORM_DATA: WizardFormData = {
  profile: null,
  preferences: null,
  identity: null,
};

export function WizardProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<WizardFormData>(DEFAULT_FORM_DATA);
  const [currentStep, setCurrentStepState] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isStepValid, setIsStepValid] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    wizardService.loadDraft().then((draft) => {
      if (draft) {
        setFormData(draft.formData);
        setCurrentStepState(draft.currentStep);
        setCompletedSteps(draft.completedSteps);
      }
      setIsLoaded(true);
    });
  }, []);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistDraft = (draft: WizardDraft) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      wizardService.saveDraft(draft);
    }, 300);
  };

  // Persist whenever any draft-relevant state changes (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    persistDraft({ formData, currentStep, completedSteps });
  }, [isLoaded, formData, currentStep, completedSteps]);

  const setStepData = (
    step: 'profile' | 'preferences' | 'identity',
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
    <WizardContext.Provider
      value={{
        formData,
        currentStep,
        completedSteps,
        isStepValid,
        isLoaded,
        setStepData,
        setCurrentStep,
        setStepValid,
        markStepComplete,
        resetWizard,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used within WizardProvider');
  return ctx;
}
