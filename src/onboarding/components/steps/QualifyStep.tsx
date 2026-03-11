import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useOnboardingConfig } from '../../queries/useOnboardingConfig';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTelemetry } from '../../hooks/useTelemetry';
import { FORM_STEPS } from '../../config/steps';
import type { QualifierAnswers } from '../../types/onboarding';
import Button from '../../../shared/components/ui/Button';

const ACCOUNT_TYPES: {
  id: QualifierAnswers['accountType'];
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    id: 'personal',
    label: 'Personal',
    description: 'For individual creators, freelancers, and personal projects.',
    icon: '👤',
  },
  {
    id: 'business',
    label: 'Business',
    description: 'For teams, startups, and established companies.',
    icon: '🏢',
  },
];

export default function QualifyStep() {
  const navigate = useNavigate();
  const { applyConfig } = useOnboarding();
  const { mutate: fetchConfig, isPending } = useOnboardingConfig();
  const { track } = useTelemetry();
  const [selected, setSelected] = useState<QualifierAnswers['accountType'] | null>(null);

  const handleSubmit = () => {
    if (!selected) return;
    fetchConfig(
      { accountType: selected },
      {
        onSuccess: (config) => {
          applyConfig(config);
          // Navigate to the first step the server specified, falling back to /profile
          const firstStepId = config.steps[0];
          const firstStep = FORM_STEPS.find((s) => s.id === firstStepId);
          navigate(firstStep?.path ?? '/profile');
        },
      }
    );
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="w-full max-w-lg"
      >
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="text-3xl font-bold text-nbt-text sm:text-4xl">
            Let's personalise your experience
          </h1>
          <p className="mt-2 text-base text-nbt-muted sm:text-lg">
            What best describes you?
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {ACCOUNT_TYPES.map((type) => {
            const isSelected = selected === type.id;
            return (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelected(type.id);
                  track({ name: 'qualifier_selected', properties: { accountType: type.id } });
                }}
                className={clsx(
                  'relative flex items-start gap-4 rounded-2xl border p-5 text-left transition-colors sm:p-6',
                  isSelected
                    ? 'border-nbt-primary bg-nbt-primary/10 shadow-lg shadow-nbt-primary/20'
                    : 'border-nbt-border bg-nbt-surface hover:border-nbt-primary/40'
                )}
              >
                <span className="mt-0.5 text-3xl sm:text-4xl">{type.icon}</span>
                <div className="flex-1">
                  <div className="text-base font-bold text-nbt-text sm:text-lg">{type.label}</div>
                  <div className="mt-1 text-sm text-nbt-muted sm:text-base">{type.description}</div>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nbt-primary text-xs font-bold text-white"
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-10">
          <Button
            variant="primary"
            size="md"
            disabled={!selected || isPending}
            loading={isPending}
            onClick={handleSubmit}
            className="w-full"
          >
            {isPending ? 'Setting things up…' : 'Continue →'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
