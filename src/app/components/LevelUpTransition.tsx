import { motion } from "motion/react";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Zap } from "lucide-react";

interface LevelUpTransitionProps {
  level: number;
  onComplete: () => void;
}

export function LevelUpTransition({ level, onComplete }: LevelUpTransitionProps) {
  useEffect(() => {
    // Quick confetti burst
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f7931e', '#3498db', '#dc2626', '#16a34a']
    });

    // Auto-complete after animation
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 2 }}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: [0, 1.2, 1], rotate: 0 }}
        transition={{ duration: 0.6, times: [0, 0.6, 1] }}
        className="relative"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" />

        {/* Main badge */}
        <div className="relative w-48 h-48 rounded-full bg-primary border-4 border-primary flex flex-col items-center justify-center shadow-xl">
          <Zap className="w-12 h-12 text-primary-foreground mb-2" />
          <div className="text-2xl font-bold text-primary-foreground mb-1">ROUND {level}</div>
          <div className="text-lg text-primary-foreground font-semibold">COMPLETE!</div>
        </div>

        {/* Expanding rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-accent"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </motion.div>
    </motion.div>
  );
}
