import clsx from 'clsx';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  preferencesSchema,
  type PreferencesFormValues,
  ROLES,
  INTERESTS,
} from '../../schemas/preferencesSchema';
import { useOnboarding } from '../../context/OnboardingContext';
import NavButtons from '../layout/NavButtons';

const ROLE_ICONS: Record<string, string> = {
  Developer: '⚡',
  Designer: '✦',
  Founder: '🚀',
  Marketer: '📈',
};

export default function PreferencesStep() {
  const { formData, setStepData, setStepValid, setCurrentStep, markStepComplete } = useOnboarding();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: formData.preferences ?? { role: '', interests: [] },
    mode: 'onChange',
  });

  useEffect(() => {
    setStepValid(isValid);
  }, [isValid, setStepValid]);

  const values = watch();
  useEffect(() => {
    if (isValid) {
      setStepData('preferences', values);
    }
  }, [values.role, JSON.stringify(values.interests), isValid]);

  const onSubmit = (data: PreferencesFormValues) => {
    setStepData('preferences', data);
    markStepComplete(2);
    setCurrentStep(3);
    navigate('/identity');
  };

  return (
    <div className="rounded-3xl border border-nbt-border bg-nbt-surface p-6 shadow-xl sm:p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-nbt-text sm:text-2xl">What describes you?</h2>
        <p className="mt-1 text-base text-nbt-muted sm:text-sm">
          Help us personalise your experience.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Role selector */}
        <div>
          <p className="mb-3 text-base font-medium text-nbt-text sm:text-sm">I am a...</p>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ROLES.map((role) => {
                  const selected = field.value === role;
                  return (
                    <motion.button
                      key={role}
                      type="button"
                      onClick={() => field.onChange(role)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className={clsx(
                        'flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200',
                        selected
                          ? 'border-nbt-primary bg-nbt-primary/10 shadow-md shadow-nbt-primary/20'
                          : 'border-nbt-border bg-nbt-surface-2 hover:border-nbt-primary/40',
                      )}
                    >
                      <span className="text-2xl">{ROLE_ICONS[role]}</span>
                      <span className={clsx('text-base font-semibold sm:text-sm', selected ? 'text-nbt-text' : 'text-nbt-muted')}>
                        {role}
                      </span>
                      {selected && (
                        <motion.svg
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring' as const, stiffness: 400, damping: 20 }}
                          className="ml-auto h-4 w-4 shrink-0 text-nbt-primary"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 8l3.5 3.5L13 4" />
                        </motion.svg>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          />
        </div>

        {/* Interests multi-select */}
        <div>
          <p className="mb-3 text-base font-medium text-nbt-text sm:text-sm">
            I care about... <span className="text-nbt-muted">(pick at least one)</span>
          </p>
          <Controller
            name="interests"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => {
                  const selected = field.value.includes(interest);
                  return (
                    <motion.button
                      key={interest}
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        const next = selected
                          ? field.value.filter((i) => i !== interest)
                          : [...field.value, interest];
                        field.onChange(next);
                      }}
                      className={clsx(
                        'cursor-pointer rounded-full border px-4 py-2 text-base font-medium transition-all duration-200 sm:py-1.5 sm:text-sm',
                        selected
                          ? 'border-nbt-secondary bg-nbt-secondary/15 text-nbt-text shadow-sm shadow-nbt-secondary/20'
                          : 'border-nbt-border bg-nbt-surface-2 text-nbt-muted hover:border-nbt-secondary/50',
                      )}
                    >
                      {interest}
                    </motion.button>
                  );
                })}
              </div>
            )}
          />
        </div>

        <NavButtons onNext={handleSubmit(onSubmit)} />
      </form>
    </div>
  );
}
