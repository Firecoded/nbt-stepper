import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useOnboarding } from '../../context/OnboardingContext';
import { FORM_STEP_IDS, HOME_PATH } from '../../config/steps';
import AvatarImage from '../../../shared/components/ui/AvatarImage';
import StarField from '../../../shared/components/ui/StarField';

import avatar1 from '../../assets/avatars/avatar1.svg';
import avatar2 from '../../assets/avatars/avatar2.svg';
import avatar3 from '../../assets/avatars/avatar3.svg';
import avatar4 from '../../assets/avatars/avatar4.svg';

const DICEBEAR_BASE = 'https://api.dicebear.com/9.x/bottts/svg';

const AVATAR_MAP: Record<string, { dicebearUrl: string; fallbackSrc: string }> = {
  avatar1: { dicebearUrl: `${DICEBEAR_BASE}?seed=Nova`,  fallbackSrc: avatar1 },
  avatar2: { dicebearUrl: `${DICEBEAR_BASE}?seed=Rust`,  fallbackSrc: avatar2 },
  avatar3: { dicebearUrl: `${DICEBEAR_BASE}?seed=Dune`,  fallbackSrc: avatar3 },
  avatar4: { dicebearUrl: `${DICEBEAR_BASE}?seed=Orbit`, fallbackSrc: avatar4 },
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 280, damping: 24 },
  },
};

export default function FinishStep() {
  const { formData, resetWizard, activeFormSteps } = useOnboarding();
  const navigate = useNavigate();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    // Log all collected data keyed by whichever steps were active in this session
    const collected = Object.fromEntries(
      activeFormSteps.map((s) => [s.id, formData[s.id as keyof typeof formData]])
    );
    console.log('NBT Onboarding Complete:', collected);

    // Two-burst confetti from the sides
    const shared = {
      particleCount: 60,
      spread: 70,
      colors: ['#6366f1', '#a855f7', '#ec4899', '#14b8a6', '#f9fafb'],
      startVelocity: 45,
      ticks: 200,
    };
    confetti({ ...shared, origin: { x: 0.15, y: 0.6 } });
    setTimeout(() => confetti({ ...shared, origin: { x: 0.85, y: 0.6 } }), 150);
  }, []);

  const handleStartOver = () => {
    resetWizard();
    navigate(HOME_PATH);
  };

  const identity = formData[FORM_STEP_IDS.identity];
  const avatar = identity?.avatarId ? AVATAR_MAP[identity.avatarId] : null;

  return (
    <div className="flex w-full flex-col items-center px-4 pt-12 sm:pt-20">
      <StarField />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-2xl flex-col items-center gap-8 sm:gap-10"
      >
        {/* Hero */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 text-center sm:gap-6">
          {avatar && (
            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-nbt-primary/20 to-nbt-secondary/20 p-3 shadow-2xl shadow-nbt-primary/20 ring-1 ring-nbt-primary/30 sm:p-4">
                <AvatarImage
                  dicebearUrl={avatar.dicebearUrl}
                  fallbackSrc={avatar.fallbackSrc}
                  alt="Your avatar"
                  className="h-24 w-24 sm:h-36 sm:w-36"
                />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' as const, stiffness: 400, damping: 15 }}
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm shadow-lg sm:h-10 sm:w-10 sm:text-base"
              >
                ✓
              </motion.div>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-black text-nbt-text sm:text-5xl">
              Welcome aboard
              {identity?.screenName && (
                <>
                  ,{' '}
                  <span className="bg-gradient-to-r from-nbt-primary to-nbt-secondary bg-clip-text text-transparent">
                    @{identity.screenName}
                  </span>
                </>
              )}
              !
            </h1>
            <p className="mt-2 text-nbt-muted sm:mt-3 sm:text-xl">You're all set. Your account has been created.</p>
          </div>
        </motion.div>

        {/* Summary cards — rendered in the order the server specified */}
        <div className="w-full space-y-3 sm:space-y-4">
          {activeFormSteps.map((step) => {
            if (step.id === FORM_STEP_IDS.profile) {
              const d = formData[FORM_STEP_IDS.profile];
              if (!d) return null;
              return (
                <motion.div key={step.id} variants={itemVariants} className="rounded-2xl border border-nbt-border bg-nbt-surface p-4 sm:p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-nbt-muted sm:text-sm">Profile</p>
                  <p className="font-semibold text-nbt-text sm:text-lg">{d.firstName} {d.lastName}</p>
                  <p className="text-sm text-nbt-muted sm:text-base">{d.email}</p>
                </motion.div>
              );
            }

            if (step.id === FORM_STEP_IDS.preferences) {
              const d = formData[FORM_STEP_IDS.preferences];
              if (!d) return null;
              return (
                <motion.div key={step.id} variants={itemVariants} className="rounded-2xl border border-nbt-border bg-nbt-surface p-4 sm:p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-nbt-muted sm:text-sm">Preferences</p>
                  <p className="font-semibold text-nbt-text sm:text-lg">{d.role}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5 sm:mt-2 sm:gap-2">
                    {d.interests.map((interest) => (
                      <span key={interest} className="rounded-full border border-nbt-border bg-nbt-surface-2 px-2.5 py-0.5 text-xs text-nbt-muted sm:px-3 sm:py-1 sm:text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            }

            if (step.id === 'business-details') {
              const d = formData['business-details'];
              if (!d) return null;
              return (
                <motion.div key={step.id} variants={itemVariants} className="rounded-2xl border border-nbt-border bg-nbt-surface p-4 sm:p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-nbt-muted sm:text-sm">Business</p>
                  <p className="font-semibold text-nbt-text sm:text-lg">{d.companyName}</p>
                  <p className="mt-0.5 text-sm text-nbt-muted sm:text-base">{d.industry}</p>
                </motion.div>
              );
            }

            if (step.id === FORM_STEP_IDS.identity) {
              if (!identity) return null;
              return (
                <motion.div key={step.id} variants={itemVariants} className="rounded-2xl border border-nbt-border bg-nbt-surface p-4 sm:p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-nbt-muted sm:text-sm">Identity</p>
                  <p className="font-semibold text-nbt-text sm:text-lg">@{identity.screenName}</p>
                </motion.div>
              );
            }

            return null;
          })}
        </div>

        <motion.div variants={itemVariants} className="flex flex-col items-center gap-2 pb-12">
          <motion.button
            onClick={handleStartOver}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer rounded-xl border border-nbt-border bg-nbt-surface-2 px-6 py-2.5 text-sm font-medium text-nbt-muted transition-colors hover:border-nbt-primary/40 hover:text-nbt-text sm:px-8 sm:py-3 sm:text-base"
          >
            Restart Onboarding
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
