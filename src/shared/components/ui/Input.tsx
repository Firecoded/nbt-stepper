import clsx from 'clsx';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export type InputState = 'default' | 'success' | 'error' | 'loading';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  suffix?: ReactNode;
  /**
   * Controls border colour for async validation states.
   * 'error' is also set automatically when the `error` prop is present.
   */
  state?: InputState;
}

const borderClasses: Record<InputState, string> = {
  default: 'border-white/8 focus:border-nbt-primary focus:ring-nbt-primary/50',
  loading: 'border-white/8 focus:border-nbt-primary focus:ring-nbt-primary/50',
  success: 'border-emerald-500/60 focus:ring-emerald-500/40',
  error:   'border-red-500/70 focus:ring-red-500/30',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, suffix, state = 'default', className, id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const resolvedState: InputState = error ? 'error' : state;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-base font-medium text-nbt-text sm:text-sm">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full rounded-xl border bg-nbt-surface-2 px-4 py-3.5 text-base text-nbt-text placeholder-nbt-muted outline-none transition-all duration-200 sm:py-3 sm:text-sm',
              'focus:ring-2',
              borderClasses[resolvedState],
              suffix && 'pr-12',
              className,
            )}
            {...rest}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-nbt-muted">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
