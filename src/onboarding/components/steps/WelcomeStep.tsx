import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import Logo from '../../../shared/components/ui/Logo';
import StarField from '../../../shared/components/ui/StarField';

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
  },
};

export default function WelcomeStep() {
  const navigate = useNavigate();
  const { setCurrentStep } = useOnboarding();

  const handleStart = () => {
    setCurrentStep(1);
    navigate('/profile');
  };

  return (
    <div className="flex min-h-dvh w-full flex-col items-center px-6 pt-16 sm:pt-32">
      <StarField />
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-[600px] w-[600px] rounded-full border border-nbt-primary/20 sm:h-[900px] sm:w-[900px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.1, ease: 'easeOut' }}
          className="absolute h-[400px] w-[400px] rounded-full border border-nbt-primary/30 sm:h-[600px] sm:w-[600px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.2, ease: 'easeOut' }}
          className="absolute h-[200px] w-[200px] rounded-full border border-nbt-primary/40 sm:h-[300px] sm:w-[300px]"
        />
        {/* Central glow blob */}
        <div className="absolute h-64 w-64 rounded-full bg-nbt-primary/10 blur-3xl sm:h-96 sm:w-96" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full flex-col items-center gap-8 text-center sm:gap-10"
      >
        {/* Logo mark */}
        <motion.div variants={logoVariants} className="relative sm:scale-150 sm:my-6">
          <Logo size="lg" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2 rounded-[28px] border border-dashed border-nbt-primary/30"
          />
        </motion.div>

        {/* Wordmark */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1 text-center">
          <h1 className="text-5xl font-black tracking-tight text-nbt-text sm:text-8xl">
            The Next{' '}
            <span className="whitespace-nowrap bg-gradient-to-r from-nbt-primary via-nbt-secondary to-nbt-accent bg-clip-text text-transparent">
              Big Thing
            </span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-xl text-nbt-muted leading-relaxed sm:text-xl"
        >
          Join thousands of builders, creators, and visionaries.
          Set up your profile in under 2 minutes.
        </motion.p>

        {/* Stat pills */}
        <motion.div variants={itemVariants} className="flex gap-4">
          {['10k+ users', '4.9 ★ rating', 'Free forever'].map((stat) => (
            <div
              key={stat}
              className="rounded-full border border-nbt-border bg-nbt-surface px-3 py-1 text-sm font-medium text-nbt-muted sm:px-5 sm:py-2 sm:text-base"
            >
              {stat}
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants}>
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-cta w-full cursor-pointer rounded-2xl px-10 py-4 text-lg font-bold text-white sm:w-auto sm:px-14 sm:py-5 sm:text-xl"
          >
            Get Started →
          </motion.button>
        </motion.div>

      </motion.div>
    </div>
  );
}
