import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";
import type { QuizOption } from "./quiz-data";

interface QuestionCardProps {
  question: string;
  options: QuizOption[];
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (option: QuizOption) => void;
}

export function QuestionCard({
  question,
  options,
  questionNumber,
  totalQuestions,
  onAnswer
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      {/* Question header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-block px-4 py-2 mb-4 rounded-full bg-primary/20 border border-primary"
        >
          <span className="text-primary font-semibold">
            Question {questionNumber} of {totalQuestions}
          </span>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {question}
        </h2>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => {
          const IconComponent = (LucideIcons as any)[option.icon] || LucideIcons.Circle;

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAnswer(option)}
              className="group relative p-6 rounded-xl bg-card border-2 border-border hover:border-primary transition-all duration-300 text-left overflow-hidden"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-transparent transition-all duration-300" />

              {/* Circuit pattern overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="2" fill="currentColor" />
                  <line x1="50" y1="50" x2="80" y2="20" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="50" x2="20" y2="80" stroke="currentColor" strokeWidth="1" />
                  <circle cx="80" cy="20" r="3" fill="currentColor" />
                  <circle cx="20" cy="80" r="3" fill="currentColor" />
                </svg>
              </div>

              <div className="relative flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-medium leading-relaxed">
                    {option.text}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
