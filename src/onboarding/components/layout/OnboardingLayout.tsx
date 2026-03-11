import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { useQueryClient } from '@tanstack/react-query';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTelemetry } from '../../hooks/useTelemetry';
import { FINISH_PATH, QUALIFY_PATH } from '../../config/steps';
import StepIndicator from './StepIndicator';
import DevPanel from '../../../shared/components/dev/DevPanel';
import ErrorView from '../../../shared/components/ui/ErrorView';

const pageVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const pageTransition = {
  duration: 0.2,
  ease: 'easeInOut' as const,
};

export default function OnboardingLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentStepId,
    completedStepIds,
    setCurrentStepId,
    isLoaded,
    isLoadError,
    activeFormSteps,
  } = useOnboarding();
  const queryClient = useQueryClient();
  const { track } = useTelemetry();
  const [devErrorView, setDevErrorView] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const stepIdx = activeFormSteps.findIndex((s) => s.path === location.pathname);

    if (stepIdx === -1) return; // /qualify or /finish — not a guarded form step

    if (stepIdx > 0) {
      const prevStep = activeFormSteps[stepIdx - 1];
      if (!completedStepIds.includes(prevStep.id)) {
        const firstIncomplete = activeFormSteps.find((s) => !completedStepIds.includes(s.id));
        navigate(firstIncomplete?.path ?? QUALIFY_PATH, { replace: true });
        return;
      }
    }

    setCurrentStepId(activeFormSteps[stepIdx].id);
  }, [isLoaded, location.pathname, activeFormSteps, completedStepIds]);

  useEffect(() => {
    if (currentStepId) track({ name: 'step_viewed', properties: { stepId: currentStepId } });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepId]);

  const isFinish = location.pathname === FINISH_PATH;
  const isQualify = location.pathname === QUALIFY_PATH;
  const showStepper = !isFinish && !isQualify;

  if (isLoadError || devErrorView) {
    return (
      <ErrorView
        onRetry={() => {
          setDevErrorView(false);
          queryClient.invalidateQueries({ queryKey: ['onboarding', 'progress'] });
        }}
      />
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-nbt-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-nbt-border border-t-nbt-primary" />
      </div>
    );
  }

  return (
    <main className={clsx(
      'flex flex-col items-center overflow-x-hidden bg-nbt-bg',
      showStepper ? 'h-dvh' : 'min-h-dvh',
    )}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-nbt-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-nbt-secondary/8 blur-3xl" />
      </div>

      <div className={clsx(
        'relative flex w-full max-w-2xl',
        showStepper ? 'h-full flex-col px-4 sm:px-8' : '',
      )}>
        {showStepper && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
            className="shrink-0 py-8 sm:py-16 flex justify-center"
          >
            <StepIndicator />
          </motion.div>
        )}

        <div
          className={clsx(showStepper && 'flex-1 overflow-y-auto pb-28 sm:pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]')}
          style={{ display: 'grid' }}
        >
          <AnimatePresence>
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              style={{ gridArea: '1 / 1' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Uncomment the guard below before deploying to production */}
      {/* import.meta.env.DEV && */ true && (
        <DevPanel onTriggerErrorView={() => setDevErrorView(true)} />
      )}
    </main>
  );
}
