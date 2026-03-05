import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWizard } from '../../context/WizardContext';
import Logo from '../ui/Logo';

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
  const { setCurrentStep } = useWizard();

  const handleStart = () => {
    setCurrentStep(1);
    navigate('/profile');
  };

  return (
    <div className="flex min-h-dvh w-full flex-col items-center px-6 pt-16 sm:pt-24">
      {/* Decorative rings — anchored to page centre so they always look good */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-[600px] w-[600px] rounded-full border border-nbt-primary/20"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.1, ease: 'easeOut' }}
          className="absolute h-[400px] w-[400px] rounded-full border border-nbt-primary/30"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.2, ease: 'easeOut' }}
          className="absolute h-[200px] w-[200px] rounded-full border border-nbt-primary/40"
        />
        {/* Central glow blob */}
        <div className="absolute h-64 w-64 rounded-full bg-nbt-primary/10 blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full flex-col items-center gap-8 text-center"
      >
        {/* Logo mark */}
        <motion.div variants={logoVariants} className="relative">
          <Logo size="lg" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2 rounded-[28px] border border-dashed border-nbt-primary/30"
          />
        </motion.div>

        {/* Wordmark */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1 text-center">
          <h1 className="text-5xl font-black tracking-tight text-nbt-text sm:text-6xl">
            The Next{' '}
            <span className="whitespace-nowrap bg-gradient-to-r from-nbt-primary via-nbt-secondary to-nbt-accent bg-clip-text text-transparent">
              Big Thing
            </span>
          </h1>
          <p className="text-base font-semibold tracking-widest text-nbt-muted uppercase">
            Your journey starts here
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-xl text-nbt-muted leading-relaxed sm:text-base"
        >
          Join thousands of builders, creators, and visionaries.
          Set up your profile in under 2 minutes.
        </motion.p>

        {/* Stat pills */}
        <motion.div variants={itemVariants} className="flex gap-4">
          {['10k+ users', '4.9 ★ rating', 'Free forever'].map((stat) => (
            <div
              key={stat}
              className="rounded-full border border-nbt-border bg-nbt-surface px-3 py-1 text-sm font-medium text-nbt-muted"
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
            className="btn-cta w-full cursor-pointer rounded-2xl px-10 py-4 text-lg font-bold text-white sm:w-auto sm:text-base"
          >
            Get Started →
          </motion.button>
        </motion.div>

      </motion.div>
    </div>
  );
}
