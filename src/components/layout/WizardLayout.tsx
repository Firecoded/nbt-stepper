import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { useWizard, STEP_ROUTES } from '../../context/WizardContext';
import StepIndicator from './StepIndicator';

const pageVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const pageTransition = {
  duration: 0.2,
  ease: 'easeInOut' as const,
};

export default function WizardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentStep, completedSteps, setCurrentStep, isLoaded } = useWizard();

  // Sync currentStep with route — handles page refresh and direct URL navigation
  useEffect(() => {
    if (!isLoaded) return;
    const routeStep = STEP_ROUTES.indexOf(location.pathname as typeof STEP_ROUTES[number]);
    if (routeStep !== -1 && routeStep !== currentStep) {
      const maxReachable = Math.max(...completedSteps, 0) + 1;
      if (routeStep > maxReachable && routeStep !== 0) {
        navigate(STEP_ROUTES[Math.min(maxReachable, STEP_ROUTES.length - 1)], { replace: true });
        return;
      }
      setCurrentStep(routeStep);
    }
  }, [isLoaded, location.pathname]);

  const isWelcome = location.pathname === '/welcome';
  const isFinish = location.pathname === '/finish';
  const showChrome = !isWelcome && !isFinish;

  if (!isLoaded) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-nbt-border border-t-nbt-primary" />
      </div>
    );
  }

  return (
    <main className={clsx(
      'flex flex-col items-center overflow-x-hidden bg-nbt-bg',
      showChrome ? 'h-dvh' : 'min-h-dvh',
    )}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-nbt-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-nbt-secondary/8 blur-3xl" />
      </div>

      <div className={clsx(
        'relative flex w-full max-w-lg',
        showChrome ? 'h-full flex-col px-4' : '',
      )}>
        {showChrome && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
            className="shrink-0 py-8 flex justify-center"
          >
            <StepIndicator />
          </motion.div>
        )}

        <div
          className={clsx(showChrome && 'flex-1 overflow-y-auto pb-28 sm:pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]')}
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
    </main>
  );
}
