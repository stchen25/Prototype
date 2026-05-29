import { motion, AnimatePresence } from "motion/react";
import { Flame } from "lucide-react";

interface ComboCounterProps {
  combo: number;
  show: boolean;
}

export function ComboCounter({ combo, show }: ComboCounterProps) {
  if (!show || combo === 0) return null;

  const getComboMessage = (combo: number) => {
    if (combo >= 5) return "ON FIRE! 🔥";
    if (combo >= 3) return "STREAK! ⚡";
    return "NICE! ✨";
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, y: -50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0, y: 50, opacity: 0 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-40"
        >
          <motion.div
            className="px-6 py-3 rounded-full bg-gradient-to-r from-accent to-primary border-2 border-primary shadow-lg shadow-primary/50"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: combo >= 3 ? Infinity : 0,
              repeatDelay: 0.5,
            }}
          >
            <div className="flex items-center gap-2">
              {combo >= 3 && (
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Flame className="w-5 h-5 text-primary-foreground" />
                </motion.div>
              )}
              <span className="text-lg font-bold text-primary-foreground">
                {combo}x {getComboMessage(combo)}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
