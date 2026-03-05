import clsx from 'clsx';

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  size?: LogoSize;
  showWordmark?: boolean;
  showAbbrev?: boolean;
  className?: string;
}

const iconSizes: Record<LogoSize, string> = {
  sm: 'h-8 w-8 rounded-xl text-sm',
  md: 'h-11 w-11 rounded-2xl text-base',
  lg: 'h-20 w-20 rounded-3xl text-2xl',
};

const wordmarkSizes: Record<LogoSize, string> = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-3xl',
};

export default function Logo({ size = 'md', showWordmark = false, showAbbrev = true, className }: LogoProps) {
  return (
    <div className={clsx('flex items-center gap-3', className)}>
      {showAbbrev && (
        <div
          className={clsx(
            'flex shrink-0 items-center justify-center bg-gradient-to-br from-nbt-primary to-nbt-secondary shadow-lg shadow-nbt-primary/30',
            iconSizes[size],
          )}
        >
          <span className="font-black tracking-tighter text-white">NBT</span>
        </div>
      )}

      {showWordmark && (
        <span className={clsx('font-black tracking-tight text-nbt-text', wordmarkSizes[size])}>
          The Next{' '}
          <span className="bg-gradient-to-r from-nbt-primary via-nbt-secondary to-nbt-accent bg-clip-text text-transparent">
            Big Thing
          </span>
        </span>
      )}
    </div>
  );
}
