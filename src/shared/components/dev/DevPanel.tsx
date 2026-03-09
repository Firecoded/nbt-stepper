import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../onboarding/context/OnboardingContext';
import { STEP_ROUTES } from '../../../onboarding/config/steps';
import { useToast } from '../ui/Toaster';

interface DevPanelProps {
  onTriggerErrorView: () => void;
}

export default function DevPanel({ onTriggerErrorView }: DevPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { resetWizard, currentStep, markStepComplete, setCurrentStep } = useOnboarding();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const canSkip = currentStep > 0 && currentStep < STEP_ROUTES.length - 1;

  const handleReset = () => {
    resetWizard();
    navigate('/welcome');
  };

  const handleSkip = () => {
    if (!canSkip) return;
    markStepComplete(currentStep);
    const next = currentStep + 1;
    setCurrentStep(next);
    navigate(STEP_ROUTES[next]);
  };

  const actions = [
    {
      label: 'Reset',
      title: 'Reset wizard',
      onClick: handleReset,
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M2 8a6 6 0 1 0 1.5-3.9" />
          <path d="M2 4v4h4" />
        </svg>
      ),
    },
    {
      label: 'Skip',
      title: 'Complete current step',
      onClick: handleSkip,
      disabled: !canSkip,
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M3 4l6 4-6 4V4z" />
          <path d="M13 4v8" />
        </svg>
      ),
    },
    {
      label: 'Error view',
      title: 'Trigger error view',
      onClick: onTriggerErrorView,
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M8 2L14 13H2L8 2z" />
          <path d="M8 7v3" />
          <circle cx="8" cy="11.5" r="0.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: 'Toast',
      title: 'Trigger error toast',
      onClick: () => showToast('Simulated error — this is a test toast.'),
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M8 2a5 5 0 0 1 5 5c0 2.5-1 4-2 5H5c-1-1-2-2.5-2-5a5 5 0 0 1 5-5z" />
          <path d="M6 12v1a2 2 0 0 0 4 0v-1" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col items-end gap-2">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/50 backdrop-blur-sm transition-colors hover:text-white/80"
      >
        DEV
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ type: 'spring' as const, stiffness: 340, damping: 28 }}
            className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-black/50 p-2 backdrop-blur-sm"
          >
            {actions.map((action) => (
              <button
                key={action.label}
                title={action.title}
                onClick={action.onClick}
                disabled={action.disabled}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white/90 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
