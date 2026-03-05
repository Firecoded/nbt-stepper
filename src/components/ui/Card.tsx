import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  hoverable?: boolean;
}

export default function Card({
  children,
  className,
  onClick,
  selected = false,
  hoverable = false,
}: CardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverable ? { scale: 1.02 } : {}}
      whileTap={hoverable && onClick ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={clsx(
        'rounded-2xl border p-4 transition-all duration-200',
        selected
          ? 'border-nbt-primary bg-nbt-primary/10 shadow-md shadow-nbt-primary/20'
          : 'border-nbt-border bg-nbt-surface-2',
        hoverable && 'cursor-pointer hover:border-nbt-primary/50',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
