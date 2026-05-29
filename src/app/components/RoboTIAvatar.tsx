import { motion } from "motion/react";

interface RoboTIAvatarProps {
  type: 'technician' | 'specialist' | 'integrator';
  color: string;
}

export function RoboTIAvatar({ type, color }: RoboTIAvatarProps) {
  if (type === 'technician') {
    // BUILDER - Hands-on, tool-wielding robot with sturdy build
    return (
      <motion.svg
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="drop-shadow-2xl"
      >
        {/* Glow effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Base platform */}
        <rect x="60" y="170" width="80" height="10" rx="5" fill={color} opacity="0.9" />

        {/* Tool belt/lower body */}
        <rect x="70" y="140" width="60" height="35" rx="6" fill={color} opacity="0.85" />
        <rect x="75" y="145" width="10" height="15" rx="2" fill="#2c3e50" opacity="0.6" />
        <rect x="95" y="145" width="10" height="15" rx="2" fill="#2c3e50" opacity="0.6" />
        <rect x="115" y="145" width="10" height="15" rx="2" fill="#2c3e50" opacity="0.6" />

        {/* Legs - sturdy and solid */}
        <rect x="75" y="165" width="15" height="15" rx="3" fill="#dc2626" />
        <rect x="110" y="165" width="15" height="15" rx="3" fill="#dc2626" />

        {/* Main body - robust with tool pockets */}
        <rect x="60" y="90" width="80" height="55" rx="8" fill={color} opacity="0.95" />
        <circle cx="80" cy="115" r="5" fill="#2c3e50" opacity="0.4" />
        <circle cx="120" cy="115" r="5" fill="#2c3e50" opacity="0.4" />
        <rect x="95" y="110" width="10" height="25" rx="2" fill="#2c3e50" opacity="0.3" />

        {/* Arms - holding tools */}
        <g>
          {/* Left arm with wrench */}
          <rect x="40" y="95" width="12" height="35" rx="6" fill="#3498db" />
          <circle cx="46" cy="132" r="6" fill="#3498db" />
          {/* Wrench */}
          <rect x="35" y="125" width="4" height="20" rx="2" fill="#95a5a6" />
          <circle cx="37" cy="145" r="4" fill="#95a5a6" opacity="0.8" />
        </g>

        <g>
          {/* Right arm with hammer */}
          <rect x="148" y="95" width="12" height="35" rx="6" fill="#3498db" />
          <circle cx="154" cy="132" r="6" fill="#3498db" />
          {/* Hammer */}
          <rect x="152" y="125" width="4" height="18" rx="1" fill="#95a5a6" />
          <rect x="148" y="122" width="12" height="6" rx="2" fill="#7f8c8d" />
        </g>

        {/* Head - industrial look */}
        <rect x="70" y="50" width="60" height="45" rx="8" fill={color} />

        {/* Hard hat detail */}
        <path d="M 70 52 Q 100 45 130 52" stroke={color} strokeWidth="3" fill="none" opacity="0.6" />
        <circle cx="100" cy="48" r="3" fill="#fbbf24" />

        {/* Eyes - focused and determined */}
        <rect x="80" y="65" width="12" height="12" rx="2" fill="#2c3e50" />
        <rect x="108" y="65" width="12" height="12" rx="2" fill="#2c3e50" />
        <motion.rect
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          x="82" y="67" width="8" height="8" rx="1" fill="#fbbf24"
        />
        <motion.rect
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          x="110" y="67" width="8" height="8" rx="1" fill="#fbbf24"
        />

        {/* Mouth - confident grin */}
        <path d="M 82 82 Q 100 88 118 82" stroke="#2c3e50" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Antenna */}
        <line x1="100" y1="50" x2="100" y2="35" stroke={color} strokeWidth="3" />
        <motion.circle
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          cx="100" cy="32" r="5" fill="#fbbf24"
        />
      </motion.svg>
    );
  }

  if (type === 'specialist') {
    // INNOVATOR - Tech-focused robot with screens and circuitry
    return (
      <motion.svg
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="drop-shadow-2xl"
      >
        {/* Base - sleek platform */}
        <ellipse cx="100" cy="175" rx="40" ry="8" fill={color} opacity="0.8" />

        {/* Legs - streamlined */}
        <rect x="80" y="160" width="10" height="20" rx="5" fill={color} opacity="0.9" />
        <rect x="110" y="160" width="10" height="20" rx="5" fill={color} opacity="0.9" />
        <circle cx="85" cy="175" r="5" fill="#3498db" />
        <circle cx="115" cy="175" r="5" fill="#3498db" />

        {/* Body - high-tech with screen */}
        <rect x="65" y="95" width="70" height="70" rx="10" fill={color} opacity="0.95" />

        {/* Central screen display */}
        <rect x="72" y="105" width="56" height="50" rx="4" fill="#1e293b" />
        <motion.g
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <line x1="80" y1="115" x2="105" y2="115" stroke="#3498db" strokeWidth="2" />
          <line x1="80" y1="125" x2="115" y2="125" stroke="#3498db" strokeWidth="2" />
          <line x1="80" y1="135" x2="95" y2="135" stroke="#3498db" strokeWidth="2" />
          <line x1="80" y1="145" x2="110" y2="145" stroke="#3498db" strokeWidth="2" />
        </motion.g>
        <motion.text
          x="78"
          y="120"
          fill="#10b981"
          fontSize="10"
          fontFamily="monospace"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          {'</>'}
        </motion.text>

        {/* Arms - slim and precise */}
        <rect x="45" y="105" width="10" height="40" rx="5" fill="#3498db" />
        <circle cx="50" cy="147" r="5" fill="#3498db" />
        <rect x="145" y="105" width="10" height="40" rx="5" fill="#3498db" />
        <circle cx="150" cy="147" r="5" fill="#3498db" />

        {/* Head - visor style */}
        <rect x="75" y="55" width="50" height="45" rx="6" fill={color} />

        {/* Visor - one continuous display */}
        <rect x="78" y="68" width="44" height="18" rx="3" fill="#1e293b" />
        <motion.rect
          animate={{ x: [78, 95, 78] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          x="78" y="70" width="12" height="14" rx="2" fill={color} opacity="0.6"
        />
        <motion.line
          animate={{ x1: [82, 102, 82], x2: [88, 108, 88] }}
          transition={{ duration: 2, repeat: Infinity }}
          x1="82" y1="77" x2="88" y2="77" stroke="#06b6d4" strokeWidth="2"
        />

        {/* Circuit patterns on head */}
        <line x1="78" y1="62" x2="90" y2="62" stroke="#10b981" strokeWidth="1" opacity="0.5" />
        <line x1="110" y1="62" x2="122" y2="62" stroke="#10b981" strokeWidth="1" opacity="0.5" />
        <circle cx="92" cy="62" r="1.5" fill="#10b981" opacity="0.7" />

        {/* Antenna array */}
        <line x1="90" y1="55" x2="90" y2="40" stroke={color} strokeWidth="2" />
        <line x1="100" y1="55" x2="100" y2="35" stroke={color} strokeWidth="2" />
        <line x1="110" y1="55" x2="110" y2="40" stroke={color} strokeWidth="2" />
        <motion.circle
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
          cx="90" cy="38" r="3" fill="#06b6d4"
        />
        <motion.circle
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          cx="100" cy="33" r="3" fill="#10b981"
        />
        <motion.circle
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
          cx="110" cy="38" r="3" fill="#3498db"
        />
      </motion.svg>
    );
  }

  // ARCHITECT - Strategic planner robot with blueprint aesthetic
  return (
    <motion.svg
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", duration: 0.8 }}
      width="200"
      height="200"
      viewBox="0 0 200 200"
      className="drop-shadow-2xl"
    >
      {/* Base - stable foundation */}
      <rect x="70" y="170" width="60" height="10" rx="5" fill={color} opacity="0.9" />
      <rect x="65" y="165" width="70" height="8" rx="4" fill={color} opacity="0.6" />

      {/* Legs - balanced stance */}
      <rect x="78" y="155" width="12" height="18" rx="4" fill="#dc2626" />
      <rect x="110" y="155" width="12" height="18" rx="4" fill="#dc2626" />
      <circle cx="84" cy="170" r="4" fill="#dc2626" />
      <circle cx="116" cy="170" r="4" fill="#dc2626" />

      {/* Body - organized compartments */}
      <rect x="70" y="100" width="60" height="60" rx="8" fill={color} opacity="0.95" />

      {/* Grid/blueprint overlay on body */}
      <g opacity="0.3">
        <line x1="75" y1="110" x2="125" y2="110" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,2" />
        <line x1="75" y1="125" x2="125" y2="125" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,2" />
        <line x1="75" y1="140" x2="125" y2="140" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,2" />
        <line x1="85" y1="105" x2="85" y2="155" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,2" />
        <line x1="100" y1="105" x2="100" y2="155" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,2" />
        <line x1="115" y1="105" x2="115" y2="155" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,2" />
      </g>

      {/* Organized panels */}
      <rect x="76" y="108" width="18" height="12" rx="2" fill="#1e293b" opacity="0.5" />
      <rect x="106" y="108" width="18" height="12" rx="2" fill="#1e293b" opacity="0.5" />
      <rect x="76" y="128" width="18" height="12" rx="2" fill="#1e293b" opacity="0.5" />
      <rect x="106" y="128" width="18" height="12" rx="2" fill="#1e293b" opacity="0.5" />

      {/* Center status indicator */}
      <circle cx="100" cy="135" r="8" fill="#1e293b" opacity="0.6" />
      <motion.circle
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        cx="100" cy="135" r="5" fill="#10b981"
      />

      {/* Arms - gesturing/planning pose */}
      <g>
        {/* Left arm - extended */}
        <rect x="50" y="110" width="12" height="30" rx="6" fill="#3498db" />
        <rect x="42" y="135" width="12" height="18" rx="6" fill="#3498db" transform="rotate(-45 48 144)" />
        <circle cx="44" cy="150" r="5" fill="#3498db" />
      </g>

      <g>
        {/* Right arm - holding blueprint */}
        <rect x="138" y="110" width="12" height="30" rx="6" fill="#3498db" />
        <rect x="146" y="135" width="12" height="18" rx="6" fill="#3498db" transform="rotate(45 152 144)" />
        <circle cx="156" cy="150" r="5" fill="#3498db" />
        {/* Blueprint/tablet */}
        <rect x="150" y="142" width="16" height="20" rx="2" fill="#e0f2fe" stroke="#3498db" strokeWidth="1" />
        <line x1="152" y1="146" x2="164" y2="146" stroke="#3498db" strokeWidth="0.5" />
        <line x1="152" y1="150" x2="164" y2="150" stroke="#3498db" strokeWidth="0.5" />
        <line x1="152" y1="154" x2="164" y2="154" stroke="#3498db" strokeWidth="0.5" />
      </g>

      {/* Head - thoughtful design */}
      <rect x="77" y="58" width="46" height="47" rx="8" fill={color} />

      {/* Thinking cap detail */}
      <path d="M 77 62 Q 100 54 123 62" stroke={color} strokeWidth="2" fill="none" opacity="0.5" />

      {/* Eyes - analytical */}
      <rect x="84" y="72" width="14" height="14" rx="3" fill="#1e293b" />
      <rect x="102" y="72" width="14" height="14" rx="3" fill="#1e293b" />
      <motion.circle
        animate={{ y: [78, 80, 78] }}
        transition={{ duration: 3, repeat: Infinity }}
        cx="91" cy="79" r="5" fill="#06b6d4"
      />
      <motion.circle
        animate={{ y: [78, 80, 78] }}
        transition={{ duration: 3, repeat: Infinity }}
        cx="109" cy="79" r="5" fill="#06b6d4"
      />

      {/* Concentrated expression */}
      <line x1="83" y1="70" x2="87" y2="68" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <line x1="113" y1="68" x2="117" y2="70" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

      {/* Slight smile */}
      <path d="M 87 92 Q 100 96 113 92" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Antenna with planning signal */}
      <line x1="100" y1="58" x2="100" y2="40" stroke={color} strokeWidth="3" />
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "100px 35px" }}
      >
        <circle cx="100" cy="35" r="6" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
        <line x1="100" y1="29" x2="100" y2="35" stroke="#10b981" strokeWidth="2" />
        <line x1="100" y1="35" x2="106" y2="35" stroke="#10b981" strokeWidth="2" />
      </motion.g>
      <circle cx="100" cy="35" r="4" fill="#10b981" />
    </motion.svg>
  );
}
