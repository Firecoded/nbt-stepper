import { motion } from 'framer-motion';

// Seeded PRNG (mulberry32) — deterministic so no hydration mismatch, but looks random
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6d2b79f5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0xdeadbeef);
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: rand() * 100,
  y: rand() * 100,
  size: rand() < 0.15 ? 4 : rand() < 0.4 ? 3 : 2,
  delay: rand() * 5,
  duration: 2.5 + rand() * 3.5,
  glow: rand() < 0.2,
}));

const SPARKLES = [
  { id: 's1', x: 12, y: 18, size: 14, delay: 0, duration: 4 },
  { id: 's2', x: 82, y: 12, size: 18, delay: 1.5, duration: 5 },
  { id: 's3', x: 25, y: 75, size: 12, delay: 0.8, duration: 3.5 },
  { id: 's4', x: 75, y: 70, size: 20, delay: 2.2, duration: 4.5 },
  { id: 's5', x: 55, y: 88, size: 12, delay: 1.0, duration: 3 },
  { id: 's6', x: 90, y: 45, size: 16, delay: 3.0, duration: 5 },
];

export default function StarField() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Glowing dots */}
      {STARS.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            boxShadow: star.glow ? '0 0 6px 2px rgba(255,255,255,0.4)' : undefined,
          }}
          animate={{ opacity: [0.1, 0.85, 0.1] }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Sparkle symbols */}
      {SPARKLES.map((s) => (
        <motion.span
          key={s.id}
          className="absolute select-none text-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: s.size,
            textShadow: '0 0 8px rgba(168, 85, 247, 0.8)',
          }}
          animate={{ opacity: [0.05, 0.7, 0.05], scale: [0.8, 1.1, 0.8] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  );
}
