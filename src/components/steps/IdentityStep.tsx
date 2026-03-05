import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWizard } from '../../context/WizardContext';
import { wizardService } from '../../services/wizardService';
import NavButtons from '../layout/NavButtons';
import Input, { type InputState } from '../ui/Input';
import type { ScreenNameStatus } from '../../types/wizard';
import type { WizardSubmission } from '../../types/wizard';

import avatar1 from '../../assets/avatars/avatar1.svg';
import avatar2 from '../../assets/avatars/avatar2.svg';
import avatar3 from '../../assets/avatars/avatar3.svg';
import avatar4 from '../../assets/avatars/avatar4.svg';

const AVATARS = [
  { id: 'avatar1', src: avatar1, label: 'Indigo' },
  { id: 'avatar2', src: avatar2, label: 'Violet' },
  { id: 'avatar3', src: avatar3, label: 'Rose' },
  { id: 'avatar4', src: avatar4, label: 'Teal' },
];

export default function IdentityStep() {
  const { formData, setStepData, setStepValid, markStepComplete, setCurrentStep } = useWizard();
  const navigate = useNavigate();

  const saved = formData.identity;
  const [selectedAvatar, setSelectedAvatar] = useState(saved?.avatarId ?? 'avatar1');
  const [screenName, setScreenName] = useState(saved?.screenName ?? '');
  const [status, setStatus] = useState<ScreenNameStatus>('idle');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAvailable = status === 'available';

  // Re-run availability check on mount if a screen name was previously saved
  useEffect(() => {
    if (saved?.screenName) {
      runCheck(saved.screenName);
    }
  }, []);

  // Report validity: available screen name required
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

  const runCheck = useCallback(async (value: string) => {
    if (!value) {
      setStatus('idle');
      return;
    }
    if (value.length < 3) {
      setStatus('too-short');
      return;
    }
    setStatus('checking');
    setSuggestions([]);
    const result = await wizardService.checkScreenName(value);
    if (result.status === 'available') {
      setStatus('available');
    } else {
      setStatus('unavailable');
      setSuggestions(result.suggestions);
    }
  }, []);

  const handleScreenNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow alphanumeric — silently strip anything else
    const raw = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    setScreenName(raw);

    if (!raw) {
      setStatus('idle');
      setSuggestions([]);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    // Any edit drops out of available/unavailable immediately
    setStatus('typing');
    setSuggestions([]);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runCheck(raw);
    }, 500);
  };

  const applySuggestion = (suggestion: string) => {
    setScreenName(suggestion);
    setStatus('typing');
    setSuggestions([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runCheck(suggestion);
    }, 300);
  };

  const handleCreateAccount = async () => {
    if (!isAvailable) return;
    const identity = { avatarId: selectedAvatar, screenName };
    setStepData('identity', identity);

    setIsSubmitting(true);
    try {
      const submission: WizardSubmission = {
        profile: formData.profile!,
        preferences: formData.preferences!,
        identity,
        submittedAt: new Date().toISOString(),
      };
      await wizardService.submit(submission);
      markStepComplete(3);
      setCurrentStep(4);
      navigate('/finish');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputState: InputState =
    status === 'available' ? 'success' :
    status === 'unavailable' || status === 'too-short' ? 'error' :
    status === 'checking' ? 'loading' : 'default';

  const statusSuffix =
    status === 'checking' ? (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-nbt-border border-t-nbt-primary" />
    ) : status === 'available' ? (
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
        onClick={() => {
          setScreenName('');
          setStatus('idle');
          setSuggestions([]);
          if (debounceRef.current) clearTimeout(debounceRef.current);
        }}
        className="cursor-pointer text-sm text-red-400 hover:text-red-300 transition-colors"
        aria-label="Clear input"
      >
        ✕
      </button>
    ) : null;

  return (
    <div className="rounded-3xl border border-nbt-border bg-nbt-surface p-6 shadow-xl sm:p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-nbt-text sm:text-2xl">Create your identity</h2>
        <p className="mt-1 text-base text-nbt-muted sm:text-sm">
          Choose an avatar and claim your unique screen name.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Avatar picker */}
        <div>
          <p className="mb-3 text-base font-medium text-nbt-text sm:text-sm">Pick your avatar</p>
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
                  <img
                    src={avatar.src}
                    alt={avatar.label}
                    className="h-12 w-12 rounded-full"
                  />
                  <span className={clsx('text-xs font-medium', selected ? 'text-nbt-text' : 'text-nbt-muted')}>
                    {avatar.label}
                  </span>
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
              {status === 'available' && (
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
                  <p className="text-xs text-red-400">
                    That username is unavailable.
                  </p>
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

        {/* Nav — uses custom onNext to trigger submit */}
        <NavButtons onNext={handleCreateAccount} loading={isSubmitting} />
      </div>
    </div>
  );
}
