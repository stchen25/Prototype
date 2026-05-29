import { motion } from "motion/react";
import { Play, Cpu, Zap, Target } from "lucide-react";

interface QuizStartProps {
  onStart: () => void;
}

export function QuizStart({ onStart }: QuizStartProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto px-4 text-center"
    >
      {/* Animated robot icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 1, bounce: 0.3 }}
        className="relative inline-block mb-8"
      >
        <div className="w-32 h-32 rounded-lg bg-primary/10 border-2 border-primary flex items-center justify-center shadow-lg">
          <Cpu className="w-16 h-16 text-primary" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">
          Robo-TI Career Quiz
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          Discover Your Robotics Manufacturing Personality
        </p>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <div className="p-6 rounded-lg bg-card border border-border shadow-sm">
          <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2 text-center">Drag & Drop</h3>
          <p className="text-sm text-muted-foreground text-center">Sort your interests!</p>
        </div>

        <div className="p-6 rounded-lg bg-card border border-border shadow-sm">
          <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-accent/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground mb-2 text-center">Build a Robot</h3>
          <p className="text-sm text-muted-foreground text-center">Watch it grow!</p>
        </div>

        <div className="p-6 rounded-lg bg-card border border-border shadow-sm">
          <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[#dc2626]/10 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-[#dc2626]" />
          </div>
          <h3 className="font-semibold text-foreground mb-2 text-center">Find Your Path</h3>
          <p className="text-sm text-muted-foreground text-center">Discover robotics careers!</p>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="max-w-2xl mx-auto mb-10"
      >
        <div className="p-6 rounded-lg bg-muted border border-border">
          <p className="text-foreground leading-relaxed mb-3">
            Are you a hands-on <span className="text-[#f7931e] font-semibold">BUILDER</span>,
            a tech-savvy <span className="text-[#3498db] font-semibold">INNOVATOR</span>,
            or a strategic <span className="text-[#dc2626] font-semibold">ARCHITECT</span>?
          </p>
          <p className="text-muted-foreground">
            Sort activities from a conveyor belt into "I Like This!" or "Not For Me" bins.
            As you sort, build your own robot and discover which robotics career matches your interests!
          </p>
        </div>
      </motion.div>

      {/* Start button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.9, type: "spring" }}
        className="relative"
      >
        <motion.button
          onClick={onStart}
          className="inline-flex items-center gap-3 px-10 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-xl shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Play className="w-6 h-6" />
          <span>Start Quiz</span>
        </motion.button>

        <p className="text-center text-muted-foreground text-sm mt-4">
          Discover your robotics career path
        </p>
      </motion.div>

      {/* Circuit decoration */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ zIndex: -1 }}>
        <defs>
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="2" fill="currentColor" />
            <line x1="50" y1="50" x2="80" y2="20" stroke="currentColor" strokeWidth="1" />
            <line x1="50" y1="50" x2="20" y2="80" stroke="currentColor" strokeWidth="1" />
            <circle cx="80" cy="20" r="3" fill="currentColor" />
            <circle cx="20" cy="80" r="3" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>
    </motion.div>
  );
}
