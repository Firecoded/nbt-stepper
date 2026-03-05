import { useNavigate } from 'react-router-dom';
import { useOnboarding, STEP_ROUTES } from '../../context/OnboardingContext';
import Button from '../../../shared/components/ui/Button';

interface NavButtonsProps {
  onNext?: () => void;
  loading?: boolean;
}

export default function NavButtons({ onNext, loading = false }: NavButtonsProps) {
  const { currentStep, isStepValid, setCurrentStep, markStepComplete } = useOnboarding();
  const navigate = useNavigate();

  const isFirst = currentStep <= 1;
  const isLast = currentStep === 3;

  const handleBack = () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    navigate(STEP_ROUTES[prevStep]);
  };

  const handleNext = () => {
    if (onNext) {
      // Step owns validation/navigation (e.g. form submit, async check)
      onNext();
      return;
    }
    markStepComplete(currentStep);
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    navigate(STEP_ROUTES[nextStep]);
  };

  const backButton = !isFirst && (
    <Button variant="ghost" onClick={handleBack} className="shrink-0">
      ← Back
    </Button>
  );

  const nextButton = (
    <Button
      variant="primary"
      onClick={handleNext}
      disabled={!isStepValid}
      loading={loading}
      size="md"
      className="flex-1"
    >
      {isLast ? 'Create Account' : 'Continue →'}
    </Button>
  );

  return (
    <>
      {/* Desktop — inline inside the card */}
      <div className="hidden sm:flex items-center gap-3 pt-2">
        {backButton}
        {nextButton}
      </div>

      {/* Mobile — fixed bar at the bottom of the viewport */}
      <div className="fixed bottom-0 left-0 right-0 flex sm:hidden items-center gap-3 border-t border-nbt-border bg-nbt-bg/95 px-4 pb-8 pt-3 backdrop-blur-md">
        {backButton}
        {nextButton}
      </div>
    </>
  );
}
