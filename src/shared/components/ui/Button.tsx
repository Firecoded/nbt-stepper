import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-nbt-primary to-nbt-secondary text-white shadow-lg shadow-nbt-primary/25 hover:shadow-nbt-primary/40',
  secondary:
    'bg-nbt-surface-2 border border-nbt-border text-nbt-text hover:border-nbt-primary/50',
  ghost: 'text-nbt-muted hover:text-nbt-text',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm sm:px-7 sm:py-3.5 sm:text-base',
  lg: 'px-8 py-4 text-base sm:px-10 sm:py-5 sm:text-lg',
};

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={clsx(
        'relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200',
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && 'cursor-not-allowed opacity-40',
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </motion.button>
  );
}
