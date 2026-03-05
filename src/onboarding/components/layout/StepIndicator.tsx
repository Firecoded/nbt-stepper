import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../context/OnboardingContext';

const STEPS = [{ index: 1 }, { index: 2 }, { index: 3 }];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6, scale: 0.85 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 22 },
  },
};

const connectorVariants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: {
    opacity: 1,
    scaleX: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 28 },
  },
};

export default function StepIndicator() {
  const { currentStep } = useOnboarding();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex items-center gap-2"
    >
      {STEPS.map((step, i) => {
        const isCompleted = step.index < currentStep;
        const isActive = step.index === currentStep;

        return (
          <motion.div key={step.index} variants={itemVariants} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: isActive ? 1 : 0.85,
                    opacity: isActive || isCompleted ? 1 : 0.4,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={clsx(
                    'flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold sm:h-14 sm:w-14 sm:text-base',
                    isCompleted || isActive
                      ? 'bg-gradient-to-br from-nbt-primary to-nbt-secondary text-white'
                      : 'border-2 border-nbt-border bg-nbt-surface text-nbt-text',
                    isActive && 'shadow-lg shadow-nbt-primary/40',
                  )}
                >
                  {isCompleted ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    >
                      ✓
                    </motion.span>
                  ) : (
                    step.index
                  )}
                </motion.div>

                {isActive && (
                  <motion.div
                    layoutId="stepGlow"
                    className="absolute inset-0 rounded-full bg-nbt-primary/20 blur-md"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </div>

            </div>

            {i < STEPS.length - 1 && (
              <motion.div
                variants={connectorVariants}
                className="h-px w-16 origin-left sm:w-28"
                animate={{
                  background: isCompleted
                    ? 'linear-gradient(90deg, #6366f1, #a855f7)'
                    : 'rgba(58, 58, 92, 1)',
                }}
                transition={{ duration: 0.4 }}
              />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
