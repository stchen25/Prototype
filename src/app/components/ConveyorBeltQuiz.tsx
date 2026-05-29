import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import * as LucideIcons from "lucide-react";
import { ThumbsUp, ThumbsDown, Package } from "lucide-react";

interface Interest {
  id: string;
  text: string;
  icon: string;
  category: string;
  scores: {
    technician: number;
    specialist: number;
    integrator: number;
  };
}

interface ConveyorBeltQuizProps {
  interests: Interest[];
  onComplete: (selections: {
    likes: Interest[];
    dislikes: Interest[];
  }) => void;
  onItemSorted?: () => void;
  questionNumber: number;
  totalQuestions: number;
}

interface DraggableInterestProps {
  interest: Interest;
  onDrop: () => void;
}

function DraggableInterest({
  interest,
  onDrop,
}: DraggableInterestProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "interest",
    item: { interest },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        onDrop();
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const IconComponent =
    (LucideIcons as any)[interest.icon] || LucideIcons.Circle;

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 1, scale: 1, rotate: 0 }}
      animate={{
        opacity: isDragging ? 0.5 : 1,
        scale: isDragging ? 1.1 : 1,
        rotate: isDragging ? 5 : 0,
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="flex-shrink-0 w-36 h-36 p-3 rounded-lg bg-card border-2 border-border cursor-grab active:cursor-grabbing hover:border-primary hover:shadow-lg transition-all shadow-md"
      style={{
        boxShadow: isDragging
          ? "0 8px 24px rgba(247, 147, 30, 0.3)"
          : undefined,
      }}
    >
      <div className="flex flex-col items-center justify-center h-full text-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <IconComponent className="w-5 h-5 text-primary" />
        </div>
        <p className="text-foreground font-semibold text-xs leading-tight">
          {interest.text}
        </p>
      </div>
    </motion.div>
  );
}

interface DropBinProps {
  type: "like" | "dislike";
  onDrop: (interest: Interest) => void;
  count: number;
}

function DropBin({ type, onDrop, count }: DropBinProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "interest",
    drop: (item: { interest: Interest }) => {
      onDrop(item.interest);
      return { type };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isLike = type === "like";
  const bgColor = isLike ? "bg-primary/5" : "bg-muted";
  const borderColor = isLike
    ? "border-primary"
    : "border-border";
  const hoverBg = isLike ? "bg-primary/10" : "bg-muted";

  return (
    <motion.div
      ref={drop}
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isOver ? 1.02 : 1,
      }}
      className={`relative h-full min-h-[180px] rounded-lg border-2 border-dashed ${borderColor} ${bgColor} ${
        isOver && canDrop ? hoverBg : ""
      } transition-all duration-300 flex flex-col items-center justify-center p-3 shadow-md`}
    >
      {/* Highlight when hovering */}
      {isOver && canDrop && (
        <div
          className={`absolute inset-0 rounded-lg ${isLike ? "bg-primary/5" : "bg-secondary/5"} border-2 ${isLike ? "border-primary" : "border-secondary"}`}
        />
      )}

      <div className="relative z-10 flex flex-col items-center justify-center gap-2">
        {isLike ? (
          <motion.div
            initial={{ rotate: 0, scale: 1 }}
            animate={{
              rotate: isOver ? [0, -10, 10, 0] : 0,
              scale: isOver ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <ThumbsUp className="w-10 h-10 text-primary" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ rotate: 0, scale: 1 }}
            animate={{
              rotate: isOver ? [0, -10, 10, 0] : 0,
              scale: isOver ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <ThumbsDown className="w-10 h-10 text-muted-foreground" />
          </motion.div>
        )}

        <div className="text-center">
          <h3 className="font-bold text-foreground text-sm">
            {isLike ? "I Like This!" : "Not For Me"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {isOver ? "Drop here!" : "Drag here"}
          </p>
        </div>

        {/* Counter */}
        {count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-2 -right-2 w-7 h-7 rounded-full ${
              isLike ? "bg-primary" : "bg-secondary"
            } border-2 border-background flex items-center justify-center`}
          >
            <span
              className={`text-sm font-bold ${isLike ? "text-primary-foreground" : "text-secondary-foreground"}`}
            >
              {count}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function ConveyorBeltQuizContent({
  interests,
  onComplete,
  onItemSorted,
  questionNumber,
  totalQuestions,
}: ConveyorBeltQuizProps) {
  const [conveyor, setConveyor] =
    useState<Interest[]>(interests);
  const [likes, setLikes] = useState<Interest[]>([]);
  const [dislikes, setDislikes] = useState<Interest[]>([]);
  const [conveyorPosition, setConveyorPosition] = useState(0);
  const [itemPositions, setItemPositions] = useState<
    Record<string, number>
  >({});

  // Initialize item positions
  useEffect(() => {
    const positions: Record<string, number> = {};
    interests.forEach((interest, index) => {
      positions[interest.id] = -200 - index * 300; // Start off-screen to the left, spaced out
    });
    setItemPositions(positions);
  }, [interests]);

  // Animate conveyor belt background
  useEffect(() => {
    const interval = setInterval(() => {
      setConveyorPosition((prev) => (prev - 3) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Move items across the conveyor belt
  useEffect(() => {
    const interval = setInterval(() => {
      setItemPositions((prev) => {
        const updated = { ...prev };
        const containerWidth =
          typeof window !== "undefined"
            ? window.innerWidth
            : 1200;

        Object.keys(updated).forEach((id) => {
          // Only move items still on conveyor
          if (conveyor.some((i) => i.id === id)) {
            updated[id] += 1.5; // Move 1.5px per frame

            // Loop back when item goes off screen
            if (updated[id] > containerWidth + 100) {
              updated[id] = -300; // Reset to left side
            }
          }
        });
        return updated;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [conveyor]);

  const handleDrop = (
    interest: Interest,
    type: "like" | "dislike",
  ) => {
    // Remove from conveyor
    setConveyor((prev) =>
      prev.filter((i) => i.id !== interest.id),
    );

    // Add to appropriate bin
    if (type === "like") {
      setLikes((prev) => [...prev, interest]);
    } else {
      setDislikes((prev) => [...prev, interest]);
    }

    // Notify parent that an item was sorted
    onItemSorted?.();
  };

  // Auto-advance when all items are sorted
  useEffect(() => {
    if (conveyor.length === 0 && interests.length > 0) {
      setTimeout(() => {
        onComplete({ likes, dislikes });
      }, 800);
    }
  }, [
    conveyor.length,
    interests.length,
    likes,
    dislikes,
    onComplete,
  ]);

  const removeFromConveyor = (interestId: string) => {
    setConveyor((prev) =>
      prev.filter((i) => i.id !== interestId),
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-3">
        <h3 className="text-base font-bold text-foreground">
          Sort Your Interests
        </h3>
        <p className="text-xs text-muted-foreground">
          Drag from belt to bins on either side
        </p>
      </div>

      {/* Bins and Conveyor Belt - side by side */}
      <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 items-center">
        {/* Left Bin - I Like This */}
        <DropBin
          type="like"
          onDrop={(interest) => handleDrop(interest, "like")}
          count={likes.length}
        />

        {/* Conveyor Belt - Center */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative bg-muted rounded-lg border-2 border-border overflow-hidden shadow-inner"
          style={{ height: "180px" }}
        >
          {/* Conveyor belt texture */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 10px,
                var(--border) 10px,
                var(--border) 11px
              )`,
              backgroundPosition: `${conveyorPosition}px 0`,
            }}
          />

          {/* Movement arrows */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-around px-2 pointer-events-none">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-xl text-primary/15"
            >
              ➜
            </motion.div>
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, 8, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: 0.4,
              }}
              className="text-xl text-primary/15"
            >
              ➜
            </motion.div>
          </div>

          {/* Conveyor items - positioned absolutely to move across */}
          <div className="relative h-full">
            {conveyor.length > 0 ? (
              conveyor.map((interest) => {
                const position =
                  itemPositions[interest.id] || 0;
                return (
                  <div
                    key={interest.id}
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{
                      left: `${position}px`,
                      transition: "none", // Smooth animation via position updates
                    }}
                  >
                    <DraggableInterest
                      interest={interest}
                      onDrop={() =>
                        removeFromConveyor(interest.id)
                      }
                    />
                  </div>
                );
              })
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Package className="w-12 h-12 text-primary mb-2" />
                </motion.div>
                <p className="text-lg font-bold text-foreground mb-1">
                  All Sorted! 🎉
                </p>
                <motion.p
                  initial={{ opacity: 0.5 }}
                  className="text-xs text-primary font-semibold"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  Next round...
                </motion.p>
              </motion.div>
            )}
          </div>

          {/* Belt indicators */}
          <div className="absolute top-2 left-2 right-2 flex justify-between z-10">
            <div className="text-[10px] text-muted-foreground font-semibold bg-background/80 px-2 py-0.5 rounded">
              ← BELT →
            </div>
            <div className="text-[10px] text-primary font-semibold bg-background/80 px-2 py-0.5 rounded">
              {conveyor.length} left
            </div>
          </div>
        </motion.div>

        {/* Right Bin - Not For Me */}
        <DropBin
          type="dislike"
          onDrop={(interest) => handleDrop(interest, "dislike")}
          count={dislikes.length}
        />
      </div>
    </div>
  );
}

export function ConveyorBeltQuiz(props: ConveyorBeltQuizProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <ConveyorBeltQuizContent {...props} />
    </DndProvider>
  );
}