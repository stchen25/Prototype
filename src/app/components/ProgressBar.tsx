import { motion } from "motion/react";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-6">
      {/* Progress header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary">{current}</span>
          </div>
          <span className="text-sm font-semibold text-foreground">Round {current} of {total}</span>
        </div>
        <span className="text-sm font-semibold text-primary">{Math.round(percentage)}%</span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-muted rounded-lg overflow-hidden border border-border">
        <motion.div
          className="absolute top-0 left-0 h-full bg-primary rounded-lg"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Segment markers */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: total - 1 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 border-r border-background/30"
                style={{ marginRight: i === total - 2 ? 0 : '1px' }}
              />
            ))}
          </div>
        </motion.div>

        {/* Progress indicator */}
        {percentage > 0 && percentage < 100 && (
          <div
            className="absolute top-0 h-full w-1 bg-white/80"
            style={{ left: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
}
