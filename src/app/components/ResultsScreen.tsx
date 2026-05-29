import { motion } from "motion/react";
import { Award, Sparkles, TrendingUp, RotateCcw, Briefcase } from "lucide-react";
import type { CareerResult } from "./interests-data";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { RoboTIAvatar } from "./RoboTIAvatar";

interface ResultsScreenProps {
  result: CareerResult;
  onRestart: () => void;
}

export function ResultsScreen({ result, onRestart }: ResultsScreenProps) {
  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#f7931e', '#3498db', '#dc2626', '#16a34a']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#f7931e', '#3498db', '#dc2626', '#16a34a']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-5xl mx-auto px-4"
    >
      {/* Header */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-3 px-8 py-3 rounded-lg bg-muted border border-border mb-6">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-2xl font-semibold text-foreground">
            Your Robo-TI Result
          </span>
        </div>
      </motion.div>

      {/* Main result card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative bg-card border-2 rounded-lg p-8 mb-8 overflow-hidden shadow-lg"
        style={{ borderColor: result.color }}
      >
        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5" style={{ backgroundColor: result.color }} />

        <div className="relative">
          {/* Robo-TI Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="flex flex-col items-center mb-6"
          >
            <div className="relative mb-4">
              <div
                className="absolute inset-0 blur-2xl opacity-40"
                style={{ backgroundColor: result.color }}
              />
              <RoboTIAvatar type={result.type} color={result.color} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mt-2 mb-4 text-foreground">
              {result.roboTI}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl text-center leading-relaxed">
              {result.description}
            </p>
          </motion.div>

          {/* Traits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6" style={{ color: result.color }} />
              <h3 className="text-xl font-bold text-foreground">Your Strengths</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.traits.map((trait, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: result.color }}
                  />
                  <span className="text-foreground">{trait}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Robotics Career Competencies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-6 h-6" style={{ color: result.color }} />
              <h3 className="text-xl font-bold text-foreground">Robotics Career Competencies</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.careers.map((career, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: result.color }}
                  />
                  <span className="text-foreground font-medium">{career}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Career Path */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="p-4 rounded-lg bg-muted/30 border-l-4"
            style={{ borderLeftColor: result.color }}
          >
            <div className="flex items-start gap-3">
              <TrendingUp className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: result.color }} />
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Your Career Path</h3>
                <p className="text-foreground/90 leading-relaxed">{result.careerPath}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <motion.button
          onClick={onRestart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold shadow-md hover:shadow-lg transition-shadow"
        >
          <RotateCcw className="w-5 h-5" />
          Take Quiz Again
        </motion.button>

        <motion.a
          href="https://www.roboticscareer.org/careers"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-shadow"
        >
          <Award className="w-5 h-5" />
          Explore Careers
        </motion.a>
      </motion.div>

      {/* Achievement banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0 }}
        className="mt-8 p-4 rounded-lg bg-muted border border-border"
      >
        <p className="text-center text-foreground">
          🏆 <span className="font-semibold">Achievement Unlocked:</span> Career Path Discovered!
        </p>
      </motion.div>
    </motion.div>
  );
}
