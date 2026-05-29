import { useState, useEffect } from "react";
import { motion, useAnimation } from "motion/react";

interface RobotBuilderProps {
  progress: number; // 0 to 1
  celebrateCount?: number; // increments each time an item is sorted
}

const SPARKLE_COUNT = 8;

function Sparkle({ index, active }: { index: number; active: boolean }) {
  const angle = (index / SPARKLE_COUNT) * 360;
  const rad = (angle * Math.PI) / 180;
  const tx = Math.cos(rad) * 60;
  const ty = Math.sin(rad) * 60;

  return (
    <motion.div
      className="absolute"
      style={{ left: "50%", top: "50%", width: 8, height: 8, marginLeft: -4, marginTop: -4 }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={
        active
          ? { x: tx, y: ty, opacity: [0, 1, 0], scale: [0, 1.2, 0] }
          : { x: 0, y: 0, opacity: 0, scale: 0 }
      }
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <svg width="8" height="8" viewBox="0 0 8 8">
        <polygon
          points="4,0 5,3 8,3 5.5,5 6.5,8 4,6 1.5,8 2.5,5 0,3 3,3"
          fill={index % 3 === 0 ? "#f7931e" : index % 3 === 1 ? "#3498db" : "#dc2626"}
        />
      </svg>
    </motion.div>
  );
}

export function RobotBuilder({ progress, celebrateCount = 0 }: RobotBuilderProps) {
  const [celebrating, setCelebrating] = useState(false);
  const [eyeFlash, setEyeFlash] = useState(false);
  const robotControls = useAnimation();

  useEffect(() => {
    if (celebrateCount === 0) return;

    // Bounce + wobble the robot
    robotControls.start({
      y: [0, -18, 4, -8, 0],
      rotate: [0, -6, 6, -3, 0],
      transition: { duration: 0.5, ease: "easeOut" },
    });

    // Flash eyes
    setEyeFlash(true);
    const eyeTimer = setTimeout(() => setEyeFlash(false), 500);

    // Burst sparkles
    setCelebrating(true);
    const sparkleTimer = setTimeout(() => setCelebrating(false), 600);

    return () => {
      clearTimeout(eyeTimer);
      clearTimeout(sparkleTimer);
    };
  }, [celebrateCount]);

  const parts = [
    { name: "base", threshold: 0, color: "#f7931e" },
    { name: "leftLeg", threshold: 0.125, color: "#dc2626" },
    { name: "rightLeg", threshold: 0.25, color: "#dc2626" },
    { name: "body", threshold: 0.375, color: "#f7931e" },
    { name: "leftArm", threshold: 0.5, color: "#3498db" },
    { name: "rightArm", threshold: 0.625, color: "#3498db" },
    { name: "head", threshold: 0.75, color: "#f7931e" },
    { name: "antenna", threshold: 0.875, color: "#3498db" },
  ];

  const visibleParts = parts.filter((part) => progress >= part.threshold);

  return (
    <div className="relative inline-block">
      {/* Sparkle burst layer */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        {Array.from({ length: SPARKLE_COUNT }).map((_, i) => (
          <Sparkle key={i} index={i} active={celebrating} />
        ))}
      </div>

      <motion.div
        animate={robotControls}
        className="relative"
        style={{ display: "inline-block" }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          {/* Robot SVG */}
          <svg width="180" height="240" viewBox="0 0 120 160" className="drop-shadow-2xl">
            {/* Base */}
            {visibleParts.some((p) => p.name === "base") && (
              <motion.rect
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                x="40"
                y="140"
                width="40"
                height="8"
                rx="4"
                fill={parts[0].color}
              />
            )}

            {/* Left Leg */}
            {visibleParts.some((p) => p.name === "leftLeg") && (
              <motion.g
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                style={{ transformOrigin: "45px 110px" }}
              >
                <rect x="42" y="110" width="8" height="30" rx="4" fill={parts[1].color} />
                <circle cx="46" cy="138" r="4" fill={parts[1].color} />
              </motion.g>
            )}

            {/* Right Leg */}
            {visibleParts.some((p) => p.name === "rightLeg") && (
              <motion.g
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                style={{ transformOrigin: "75px 110px" }}
              >
                <rect x="70" y="110" width="8" height="30" rx="4" fill={parts[2].color} />
                <circle cx="74" cy="138" r="4" fill={parts[2].color} />
              </motion.g>
            )}

            {/* Body */}
            {visibleParts.some((p) => p.name === "body") && (
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ transformOrigin: "60px 85px" }}
              >
                <rect x="35" y="65" width="50" height="45" rx="8" fill={parts[3].color} opacity="0.9" />
                <circle cx="50" cy="85" r="3" fill="#0a0e27" />
                <circle cx="70" cy="85" r="3" fill="#0a0e27" />
                <rect x="45" y="95" width="30" height="3" rx="1.5" fill="#0a0e27" opacity="0.5" />
              </motion.g>
            )}

            {/* Left Arm */}
            {visibleParts.some((p) => p.name === "leftArm") && (
              <motion.g
                initial={{ opacity: 0, x: -20, rotate: -45 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                style={{ transformOrigin: "30px 75px" }}
              >
                <rect x="22" y="70" width="6" height="25" rx="3" fill={parts[4].color} />
                <circle cx="25" cy="96" r="4" fill={parts[4].color} />
              </motion.g>
            )}

            {/* Right Arm */}
            {visibleParts.some((p) => p.name === "rightArm") && (
              <motion.g
                initial={{ opacity: 0, x: 20, rotate: 45 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                style={{ transformOrigin: "90px 75px" }}
              >
                <rect x="92" y="70" width="6" height="25" rx="3" fill={parts[5].color} />
                <circle cx="95" cy="96" r="4" fill={parts[5].color} />
              </motion.g>
            )}

            {/* Head */}
            {visibleParts.some((p) => p.name === "head") && (
              <motion.g
                initial={{ opacity: 0, y: -20, scale: 0 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{ transformOrigin: "60px 45px" }}
              >
                <rect x="40" y="30" width="40" height="35" rx="6" fill={parts[6].color} />
                <circle cx="50" cy="45" r="5" fill="#0a0e27" />
                <circle cx="70" cy="45" r="5" fill="#0a0e27" />
                {/* Eye glow — flashes bright on celebrate */}
                <motion.circle
                  cx="50"
                  cy="45"
                  r="2"
                  animate={eyeFlash ? { r: [2, 4, 2], opacity: [1, 1, 1] } : { r: 2, opacity: 1 }}
                  fill={eyeFlash ? "#ffffff" : "#00d9ff"}
                  transition={{ duration: 0.25 }}
                />
                <motion.circle
                  cx="70"
                  cy="45"
                  r="2"
                  animate={eyeFlash ? { r: [2, 4, 2], opacity: [1, 1, 1] } : { r: 2, opacity: 1 }}
                  fill={eyeFlash ? "#ffffff" : "#00d9ff"}
                  transition={{ duration: 0.25 }}
                />
                {/* Mouth — turns into a smile on celebrate */}
                <motion.path
                  d={eyeFlash ? "M 48 57 Q 60 63 72 57" : "M 48 57 L 72 57"}
                  stroke="#0a0e27"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.6"
                  transition={{ duration: 0.2 }}
                />
              </motion.g>
            )}

            {/* Antenna */}
            {visibleParts.some((p) => p.name === "antenna") && (
              <motion.g
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <line x1="60" y1="30" x2="60" y2="15" stroke={parts[7].color} strokeWidth="2" />
                <motion.circle
                  cx="60"
                  cy="12"
                  r="4"
                  fill={celebrating ? "#ffffff" : parts[7].color}
                  animate={celebrating ? { scale: [1, 1.8, 1] } : { scale: [1, 1.3, 1] }}
                  transition={
                    celebrating
                      ? { duration: 0.3 }
                      : { duration: 1, repeat: Infinity }
                  }
                />
                <motion.circle
                  cx="60"
                  cy="12"
                  r="6"
                  fill={celebrating ? "#ffffff" : parts[7].color}
                  opacity="0.3"
                  animate={
                    celebrating
                      ? { scale: [1, 2.5, 1], opacity: [0.3, 0, 0.3] }
                      : { scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }
                  }
                  transition={
                    celebrating
                      ? { duration: 0.4 }
                      : { duration: 1, repeat: Infinity }
                  }
                />
              </motion.g>
            )}
          </svg>
        </motion.div>

        {/* Ambient floating particles (after halfway built) */}
        {progress > 0.5 && (
          <>
            <motion.div
              className="absolute top-16 -left-3 w-2 h-2 rounded-full bg-primary"
              animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-32 -right-3 w-2 h-2 rounded-full bg-accent"
              animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}
