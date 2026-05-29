import { useState } from "react";
import { motion } from "motion/react";
import { QuizStart } from "./components/QuizStart";
import { ResultsScreen } from "./components/ResultsScreen";
import { RobotBuilder } from "./components/RobotBuilder";
import { LevelUpTransition } from "./components/LevelUpTransition";
import { ConveyorBeltQuiz } from "./components/ConveyorBeltQuiz";
import { interestRounds, careerResults, type Interest } from "./components/interests-data";

type QuizState = 'start' | 'quiz' | 'levelup' | 'results';

export default function App() {
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [currentRound, setCurrentRound] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [itemsSorted, setItemsSorted] = useState(0);
  const [scores, setScores] = useState({
    technician: 0,
    specialist: 0,
    integrator: 0
  });

  // Calculate total items across all rounds
  const totalItems = interestRounds.reduce((sum, round) => sum + round.interests.length, 0);
  // Calculate robot building progress based on items sorted
  const robotProgress = itemsSorted / totalItems;

  const handleStart = () => {
    setQuizState('quiz');
    setCurrentRound(0);
    setItemsSorted(0);
    setScores({ technician: 0, specialist: 0, integrator: 0 });
  };

  const handleRoundComplete = (selections: { likes: Interest[]; dislikes: Interest[] }) => {
    // Calculate scores from liked items
    selections.likes.forEach(interest => {
      setScores(prev => ({
        technician: prev.technician + interest.scores.technician,
        specialist: prev.specialist + interest.scores.specialist,
        integrator: prev.integrator + interest.scores.integrator
      }));
    });

    // Show level-up transition
    setShowLevelUp(true);
  };

  const handleLevelUpComplete = () => {
    setShowLevelUp(false);

    // Move to next round or show results
    if (currentRound < interestRounds.length - 1) {
      setCurrentRound(prev => prev + 1);
    } else {
      setQuizState('results');
    }
  };

  const handleRestart = () => {
    setQuizState('start');
    setCurrentRound(0);
    setItemsSorted(0);
    setScores({ technician: 0, specialist: 0, integrator: 0 });
  };

  // Determine the career result based on scores
  const getResult = () => {
    const maxScore = Math.max(scores.technician, scores.specialist, scores.integrator);

    if (scores.technician === maxScore) {
      return careerResults.technician;
    } else if (scores.specialist === maxScore) {
      return careerResults.specialist;
    } else {
      return careerResults.integrator;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center px-4 py-2 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {quizState === 'start' && <QuizStart onStart={handleStart} />}

        {showLevelUp && (
          <LevelUpTransition
            level={currentRound + 1}
            onComplete={handleLevelUpComplete}
          />
        )}

        {quizState === 'quiz' && !showLevelUp && (
          <div className="w-full max-w-7xl mx-auto px-4 py-2">
            {/* Compact header with progress */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{currentRound + 1}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Round {currentRound + 1} of {interestRounds.length}</h3>
                  <p className="text-xs text-muted-foreground">Sort items to build your robot</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-semibold text-primary">{Math.round(((currentRound + 1) / interestRounds.length) * 100)}% Complete</span>
              </div>
            </div>

            {/* Main layout - Robot on top, conveyor below */}
            <div className="flex flex-col items-center gap-4">
              {/* Robot Building Area - Top Center */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center bg-gradient-to-b from-muted to-card border-2 border-primary/30 rounded-lg p-6 shadow-lg"
              >
                <div className="text-center">
                  <RobotBuilder progress={robotProgress} celebrateCount={itemsSorted} />
                </div>
              </motion.div>

              {/* Sorting Area - Below Robot */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl"
              >
                <ConveyorBeltQuiz
                  interests={interestRounds[currentRound].interests}
                  onComplete={handleRoundComplete}
                  onItemSorted={() => setItemsSorted(prev => prev + 1)}
                  questionNumber={currentRound + 1}
                  totalQuestions={interestRounds.length}
                />
              </motion.div>
            </div>
          </div>
        )}

        {quizState === 'results' && (
          <ResultsScreen result={getResult()} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
}