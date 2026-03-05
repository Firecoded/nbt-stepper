import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useOnboarding } from '../../context/OnboardingContext';

import avatar1 from '../../assets/avatars/avatar1.svg';
import avatar2 from '../../assets/avatars/avatar2.svg';
import avatar3 from '../../assets/avatars/avatar3.svg';
import avatar4 from '../../assets/avatars/avatar4.svg';

const AVATAR_MAP: Record<string, string> = { avatar1, avatar2, avatar3, avatar4 };

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
  const { formData, resetWizard } = useOnboarding();
  const navigate = useNavigate();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    console.log('NBT Onboarding Complete:', {
      profile: formData.profile,
      preferences: formData.preferences,
      identity: formData.identity,
    });

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
    navigate('/welcome');
  };

  const avatarSrc = formData.identity?.avatarId
    ? AVATAR_MAP[formData.identity.avatarId]
    : null;

  return (
    <div className="flex w-full flex-col items-center px-4 pt-12 sm:pt-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-lg flex-col items-center gap-6"
      >
        {/* Hero */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-3 text-center">
          {avatarSrc && (
            <div className="relative">
              <img
                src={avatarSrc}
                alt="Your avatar"
                className="h-24 w-24 rounded-full ring-4 ring-nbt-primary/50 shadow-2xl shadow-nbt-primary/30"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' as const, stiffness: 400, damping: 15 }}
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm shadow-lg"
              >
                ✓
              </motion.div>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-black text-nbt-text sm:text-4xl">
              Welcome aboard
              {formData.identity?.screenName && (
                <>
                  ,{' '}
                  <span className="bg-gradient-to-r from-nbt-primary to-nbt-secondary bg-clip-text text-transparent">
                    @{formData.identity.screenName}
                  </span>
                </>
              )}
              !
            </h1>
            <p className="mt-2 text-nbt-muted">You're all set. Your account has been created.</p>
          </div>
        </motion.div>

        {/* Summary cards */}
        <div className="w-full space-y-3">
          {formData.profile && (
            <motion.div
              variants={itemVariants}
              className="rounded-2xl border border-nbt-border bg-nbt-surface p-4"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-nbt-muted">Profile</p>
              <p className="font-semibold text-nbt-text">
                {formData.profile.firstName} {formData.profile.lastName}
              </p>
              <p className="text-sm text-nbt-muted">{formData.profile.email}</p>
            </motion.div>
          )}

          {formData.preferences && (
            <motion.div
              variants={itemVariants}
              className="rounded-2xl border border-nbt-border bg-nbt-surface p-4"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-nbt-muted">Preferences</p>
              <p className="font-semibold text-nbt-text">{formData.preferences.role}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {formData.preferences.interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full border border-nbt-border bg-nbt-surface-2 px-2.5 py-0.5 text-xs text-nbt-muted"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {formData.identity && (
            <motion.div
              variants={itemVariants}
              className="rounded-2xl border border-nbt-border bg-nbt-surface p-4"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-nbt-muted">Identity</p>
              <p className="font-semibold text-nbt-text">@{formData.identity.screenName}</p>
            </motion.div>
          )}
        </div>

        <motion.div variants={itemVariants} className="flex flex-col items-center gap-2 pb-12">
          <motion.button
            onClick={handleStartOver}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer rounded-xl border border-nbt-border bg-nbt-surface-2 px-6 py-2.5 text-sm font-medium text-nbt-muted transition-colors hover:border-nbt-primary/40 hover:text-nbt-text"
          >
            Restart Onboarding
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
