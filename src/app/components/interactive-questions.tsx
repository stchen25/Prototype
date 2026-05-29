import { motion } from "motion/react";
import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { QuizOption } from "./quiz-data";

// Question Type 1: Drag and Rank
interface DragRankProps {
  question: string;
  options: QuizOption[];
  onAnswer: (option: QuizOption) => void;
}

interface DraggableItemProps {
  option: QuizOption;
  index: number;
}

function DraggableCard({ option, index }: DraggableItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { option, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const IconComponent = (LucideIcons as any)[option.icon] || LucideIcons.Circle;

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0, scale: isDragging ? 1.05 : 1 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-xl bg-card border-2 border-primary/50 cursor-grab active:cursor-grabbing hover:border-primary transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <IconComponent className="w-5 h-5 text-primary" />
        </div>
        <p className="text-foreground font-medium text-sm">{option.text}</p>
      </div>
    </motion.div>
  );
}

function DragRankQuestionContent({ question, options, onAnswer }: DragRankProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item: { option: QuizOption; index: number }) => {
      onAnswer(item.option);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{question}</h2>
        <p className="text-muted-foreground text-lg">Drag your top choice into the spotlight! ⭐</p>
      </motion.div>

      {/* Drop zone */}
      <motion.div
        ref={drop}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`mb-8 p-8 rounded-2xl border-4 border-dashed transition-all ${
          isOver ? 'border-primary bg-primary/10 scale-105' : 'border-primary/30 bg-muted/20'
        }`}
      >
        <div className="text-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🎯
          </motion.div>
          <p className="text-xl font-bold text-foreground">Drop Here!</p>
          <p className="text-muted-foreground">Choose what sounds most like you</p>
        </div>
      </motion.div>

      {/* Draggable cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <DraggableCard key={index} option={option} index={index} />
        ))}
      </div>
    </div>
  );
}

export function DragRankQuestion({ question, options, onAnswer }: DragRankProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <DragRankQuestionContent question={question} options={options} onAnswer={onAnswer} />
    </DndProvider>
  );
}

// Question Type 2: Emoji Reaction Scale
interface EmojiScaleProps {
  question: string;
  options: QuizOption[];
  onAnswer: (option: QuizOption) => void;
}

export function EmojiScaleQuestion({ question, options, onAnswer }: EmojiScaleProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const emojis = ["😐", "🙂", "😊", "😄"];
  const labels = ["Not really", "A little", "Pretty much", "Totally me!"];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{question}</h2>
        <p className="text-muted-foreground text-lg">Click the emoji that matches how you feel!</p>
      </motion.div>

      <div className="space-y-8">
        {options.map((option, optionIndex) => {
          const IconComponent = (LucideIcons as any)[option.icon] || LucideIcons.Circle;

          return (
            <motion.div
              key={optionIndex}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: optionIndex * 0.1 }}
              className="p-6 rounded-2xl bg-card border-2 border-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                <p className="text-foreground font-medium flex-1">{option.text}</p>
              </div>

              <div className="flex justify-between gap-2">
                {emojis.map((emoji, emojiIndex) => (
                  <motion.button
                    key={emojiIndex}
                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      // Weight the answer based on emoji selection
                      const weightedOption = {
                        ...option,
                        scores: {
                          technician: option.scores.technician * (emojiIndex + 1) / 4,
                          specialist: option.scores.specialist * (emojiIndex + 1) / 4,
                          integrator: option.scores.integrator * (emojiIndex + 1) / 4,
                        }
                      };
                      onAnswer(weightedOption);
                    }}
                    onMouseEnter={() => setHoveredIndex(optionIndex * 10 + emojiIndex)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="flex-1 p-4 rounded-xl bg-muted/30 hover:bg-primary/20 border-2 border-transparent hover:border-primary transition-all"
                  >
                    <div className="text-4xl mb-2">{emoji}</div>
                    <div className={`text-xs transition-opacity ${
                      hoveredIndex === optionIndex * 10 + emojiIndex ? 'opacity-100' : 'opacity-60'
                    }`}>
                      {labels[emojiIndex]}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Question Type 3: Card Flip Selection
interface CardFlipProps {
  question: string;
  options: QuizOption[];
  onAnswer: (option: QuizOption) => void;
}

export function CardFlipQuestion({ question, options, onAnswer }: CardFlipProps) {
  const [flipped, setFlipped] = useState<number[]>([]);

  const handleFlip = (index: number) => {
    if (!flipped.includes(index)) {
      setFlipped([...flipped, index]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{question}</h2>
        <p className="text-muted-foreground text-lg">Click to reveal, then pick your favorite! 🃏</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {options.map((option, index) => {
          const IconComponent = (LucideIcons as any)[option.icon] || LucideIcons.Circle;
          const isFlipped = flipped.includes(index);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, rotateY: 0 }}
              animate={{ opacity: 1, rotateY: isFlipped ? 180 : 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative h-48 cursor-pointer"
              style={{ perspective: 1000 }}
              onClick={() => {
                if (isFlipped) {
                  onAnswer(option);
                } else {
                  handleFlip(index);
                }
              }}
            >
              {/* Card back */}
              <div
                className={`absolute inset-0 rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center ${
                  isFlipped ? 'hidden' : 'block'
                }`}
              >
                <div className="text-6xl">❓</div>
              </div>

              {/* Card front */}
              <motion.div
                className={`absolute inset-0 rounded-2xl border-2 border-primary bg-card p-4 flex flex-col items-center justify-center text-center ${
                  isFlipped ? 'block' : 'hidden'
                }`}
                style={{ transform: 'rotateY(180deg)' }}
                whileHover={{ scale: 1.05, borderColor: 'var(--neon-cyan)' }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <p className="text-foreground font-medium text-sm">{option.text}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Question Type 4: Battle Choice (This or That)
interface BattleChoiceProps {
  question: string;
  options: QuizOption[];
  onAnswer: (option: QuizOption) => void;
}

export function BattleChoiceQuestion({ question, options, onAnswer }: BattleChoiceProps) {
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);

  // Take first two options for this vs that
  const leftOption = options[0];
  const rightOption = options[1];

  const LeftIcon = (LucideIcons as any)[leftOption.icon] || LucideIcons.Circle;
  const RightIcon = (LucideIcons as any)[rightOption.icon] || LucideIcons.Circle;

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{question}</h2>
        <p className="text-muted-foreground text-lg">Choose your side! ⚡</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Left choice */}
        <motion.button
          onClick={() => onAnswer(leftOption)}
          onMouseEnter={() => setHoveredSide('left')}
          onMouseLeave={() => setHoveredSide(null)}
          whileHover={{ scale: 1.05, x: 10 }}
          whileTap={{ scale: 0.95 }}
          className={`relative p-8 rounded-2xl border-4 transition-all overflow-hidden ${
            hoveredSide === 'left'
              ? 'border-primary bg-primary/20'
              : 'border-primary/30 bg-card'
          }`}
        >
          <div className="absolute top-4 right-4 text-4xl opacity-20">👈</div>
          <div className="relative text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/30 flex items-center justify-center">
              <LeftIcon className="w-10 h-10 text-primary" />
            </div>
            <p className="text-foreground font-bold text-lg">{leftOption.text}</p>
          </div>
        </motion.button>

        {/* Right choice */}
        <motion.button
          onClick={() => onAnswer(rightOption)}
          onMouseEnter={() => setHoveredSide('right')}
          onMouseLeave={() => setHoveredSide(null)}
          whileHover={{ scale: 1.05, x: -10 }}
          whileTap={{ scale: 0.95 }}
          className={`relative p-8 rounded-2xl border-4 transition-all overflow-hidden ${
            hoveredSide === 'right'
              ? 'border-accent bg-accent/20'
              : 'border-accent/30 bg-card'
          }`}
        >
          <div className="absolute top-4 left-4 text-4xl opacity-20">👉</div>
          <div className="relative text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-accent/30 flex items-center justify-center">
              <RightIcon className="w-10 h-10 text-accent" />
            </div>
            <p className="text-foreground font-bold text-lg">{rightOption.text}</p>
          </div>
        </motion.button>
      </div>

      {/* Additional options if more than 2 */}
      {options.length > 2 && (
        <div className="grid grid-cols-2 gap-4">
          {options.slice(2).map((option, index) => {
            const IconComponent = (LucideIcons as any)[option.icon] || LucideIcons.Circle;
            return (
              <motion.button
                key={index}
                onClick={() => onAnswer(option)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-6 rounded-xl border-2 border-border hover:border-primary bg-card hover:bg-primary/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-foreground font-medium text-left">{option.text}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
