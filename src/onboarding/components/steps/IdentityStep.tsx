import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import { useCheckScreenName } from '../../queries/useCheckScreenName';
import { useSubmitOnboarding } from '../../queries/useSubmitOnboarding';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import NavButtons from '../layout/NavButtons';
import Input, { type InputState } from '../../../shared/components/ui/Input';
import AvatarImage from '../../../shared/components/ui/AvatarImage';
import type { ScreenNameStatus, OnboardingSubmission } from '../../types/onboarding';

import avatar1 from '../../assets/avatars/avatar1.svg';
import avatar2 from '../../assets/avatars/avatar2.svg';
import avatar3 from '../../assets/avatars/avatar3.svg';
import avatar4 from '../../assets/avatars/avatar4.svg';

const DICEBEAR_BASE = 'https://api.dicebear.com/9.x/bottts/svg';

const AVATARS = [
  { id: 'avatar1', dicebearUrl: `${DICEBEAR_BASE}?seed=Nova`,   fallbackSrc: avatar1 },
  { id: 'avatar2', dicebearUrl: `${DICEBEAR_BASE}?seed=Rust`,   fallbackSrc: avatar2 },
  { id: 'avatar3', dicebearUrl: `${DICEBEAR_BASE}?seed=Dune`,   fallbackSrc: avatar3 },
  { id: 'avatar4', dicebearUrl: `${DICEBEAR_BASE}?seed=Orbit`,  fallbackSrc: avatar4 },
];

export default function IdentityStep() {
  const { formData, setStepData, setStepValid, markStepComplete, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const saved = formData.identity;
  const [selectedAvatar, setSelectedAvatar] = useState(saved?.avatarId ?? 'avatar1');
  const [screenName, setScreenName] = useState(saved?.screenName ?? '');

  const debouncedScreenName = useDebounce(screenName, 500);

  const { data: checkResult, isFetching: isChecking, isError: isCheckError } = useCheckScreenName(debouncedScreenName);
  const { mutate: submitOnboarding, isPending: isSubmitting } = useSubmitOnboarding();

  // Derive status from query state rather than managing it manually
  const status: ScreenNameStatus = (() => {
    if (!screenName) return 'idle';
    if (screenName.length < 3) return 'too-short';
    if (screenName !== debouncedScreenName || isChecking) return 'checking';
    if (isCheckError) return 'error';
    if (checkResult?.status === 'available') return 'available';
    if (checkResult?.status === 'unavailable') return 'unavailable';
    return 'idle';
  })();

  const isAvailable = status === 'available';
  const suggestions = checkResult?.status === 'unavailable' ? checkResult.suggestions : [];

  // Report validity up to context
  useEffect(() => {
    setStepValid(isAvailable);
  }, [isAvailable, setStepValid]);

  // Persist when available; clear saved screen name when explicitly invalid
  useEffect(() => {
    if (isAvailable) {
      setStepData('identity', { avatarId: selectedAvatar, screenName });
    } else if (status === 'unavailable' || status === 'too-short') {
      setStepData('identity', { avatarId: selectedAvatar, screenName: '' });
    }
  }, [status, selectedAvatar]);

  const handleScreenNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow alphanumeric — silently strip anything else
    const raw = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    setScreenName(raw);
  };

  const applySuggestion = (suggestion: string) => {
    setScreenName(suggestion);
  };

  const handleCreateAccount = () => {
    if (!isAvailable) return;
    const identity = { avatarId: selectedAvatar, screenName };
    setStepData('identity', identity);

    const submission: OnboardingSubmission = {
      profile: formData.profile!,
      preferences: formData.preferences!,
      identity,
      submittedAt: new Date().toISOString(),
    };

    submitOnboarding(submission, {
      onSuccess: () => {
        markStepComplete(3);
        setCurrentStep(4);
        navigate('/finish');
      },
    });
  };

  const inputState: InputState =
    isAvailable ? 'success' :
    status === 'unavailable' || status === 'too-short' || status === 'error' ? 'error' :
    status === 'checking' ? 'loading' : 'default';

  const statusSuffix =
    status === 'checking' ? (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-nbt-border border-t-nbt-primary" />
    ) : isAvailable ? (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-sm font-bold text-emerald-400"
      >
        ✓
      </motion.span>
    ) : status === 'unavailable' || status === 'too-short' ? (
      <button
        type="button"
        onClick={() => setScreenName('')}
        className="cursor-pointer text-sm text-red-400 hover:text-red-300 transition-colors"
        aria-label="Clear input"
      >
        ✕
      </button>
    ) : null;

  return (
    <div className="rounded-3xl border border-nbt-border bg-nbt-surface p-6 shadow-xl sm:p-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-3xl font-bold text-nbt-text sm:text-4xl">Create your identity</h2>
        <p className="mt-1 text-base text-nbt-muted sm:mt-2 sm:text-xl">
          Choose an avatar and claim your unique screen name.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Avatar picker */}
        <div>
          <p className="mb-3 text-base font-medium text-nbt-text sm:text-lg">Pick your avatar</p>
          <div className="grid grid-cols-4 gap-3">
            {AVATARS.map((avatar) => {
              const selected = selectedAvatar === avatar.id;
              return (
                <motion.button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.id)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className={clsx(
                    'relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl border p-3 transition-all duration-200',
                    selected
                      ? 'border-nbt-primary bg-nbt-primary/10 shadow-lg shadow-nbt-primary/20'
                      : 'border-nbt-border bg-nbt-surface-2 hover:border-nbt-primary/40',
                  )}
                >
                  <AvatarImage
                    dicebearUrl={avatar.dicebearUrl}
                    fallbackSrc={avatar.fallbackSrc}
                    alt={`Avatar option ${avatar.id}`}
                    className="h-16 w-16 sm:h-20 sm:w-20"
                  />
                  {selected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-nbt-primary text-[10px] text-white"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Screen name input */}
        <div className="flex flex-col gap-2">
          <Input
            label="Screen name"
            value={screenName}
            onChange={handleScreenNameChange}
            placeholder="cooluser42"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={20}
            state={inputState}
            suffix={statusSuffix}
          />

          {/* Fixed-height helper area — prevents layout shift as status messages change */}
          <div className="h-12">
            <AnimatePresence mode="wait">
              {status === 'error' && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400"
                >
                  Unable to check availability. Try again.
                </motion.p>
              )}
              {status === 'too-short' && (
                <motion.p
                  key="too-short"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400"
                >
                  Must be at least 3 characters.
                </motion.p>
              )}
              {status === 'checking' && (
                <motion.p
                  key="checking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-nbt-muted"
                >
                  Checking availability...
                </motion.p>
              )}
              {isAvailable && (
                <motion.p
                  key="available"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-emerald-400"
                >
                  @{screenName} is available!
                </motion.p>
              )}
              {status === 'unavailable' && (
                <motion.div
                  key="unavailable"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-2"
                >
                  <p className="text-xs text-red-400">That username is unavailable.</p>
                  {suggestions.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-nbt-muted">Try:</span>
                      {suggestions.map((s) => (
                        <motion.button
                          key={s}
                          type="button"
                          onClick={() => applySuggestion(s)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="cursor-pointer rounded-full border border-nbt-primary/50 bg-nbt-primary/10 px-3 py-1 text-xs font-medium text-nbt-primary transition-colors hover:bg-nbt-primary/20"
                        >
                          @{s}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <NavButtons onNext={handleCreateAccount} loading={isSubmitting} />
      </div>
    </div>
  );
}
