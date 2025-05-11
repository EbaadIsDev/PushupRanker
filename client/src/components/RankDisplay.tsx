import { useEffect, useRef } from 'react';
import { RANK_DETAILS, formatRankName } from '@/lib/rankSystem';
import { motion } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';

interface RankDisplayProps {
  tier: string;
  level: number;
  progress: number;
  totalPushups: number;
  maxSet: number;
  nextThreshold: number | null;
}

const RankDisplay = ({ 
  tier, 
  level, 
  progress, 
  totalPushups, 
  maxSet, 
  nextThreshold 
}: RankDisplayProps) => {
  const circleRef = useRef<SVGCircleElement | null>(null);
  const { settings } = useSettings();
  
  // Update progress ring
  useEffect(() => {
    if (circleRef.current) {
      const circle = circleRef.current;
      const radius = Number(circle.getAttribute('r'));
      const circumference = 2 * Math.PI * radius;
      
      const offset = circumference - (progress / 100) * circumference;
      circle.style.strokeDashoffset = offset.toString();
    }
  }, [progress]);

  // Get rank details
  const rankTier = tier as keyof typeof RANK_DETAILS;
  const rankDetails = RANK_DETAILS[rankTier] || RANK_DETAILS.bronze;

  // Create a style for the glow effect
  const glowStyle = {
    boxShadow: `0 0 15px ${rankDetails.glowColor}`
  };

  return (
    <section id="rankDisplay" className="mb-10">
      <div className="text-center mb-6">
        <h2 className="text-xl text-gray-300 mb-2">YOUR CURRENT RANK</h2>
        <motion.div 
          id="currentRank" 
          className="inline-block relative"
          animate={settings.animationsEnabled ? { scale: [1, 1.02, 1] } : {}}
          transition={{ 
            repeat: Infinity, 
            repeatType: "reverse", 
            duration: 2 
          }}
        >
          <div 
            className={`bg-gray-800 p-5 rounded-full h-44 w-44 flex items-center justify-center border-4 ${rankDetails.borderColor}`}
            style={glowStyle}
          >
            <div className="text-center">
              {/* Rank Icon */}
              <i className={`ri-award-line text-5xl ${rankDetails.iconColor} mb-1`}></i>
              {/* Rank Title */}
              <h3 className={`font-bold text-2xl uppercase ${rankDetails.color} tracking-wider`}>
                {rankTier.charAt(0).toUpperCase() + rankTier.slice(1)}
              </h3>
              {/* Rank Level */}
              <span className="text-sm text-gray-400">LEVEL {level}</span>
            </div>
          </div>
          {/* Animated Ring Progress */}
          <svg width="180" height="180" viewBox="0 0 180 180" className="absolute top-0 left-0">
            <circle cx="90" cy="90" r="80" fill="none" stroke="#2D3748" strokeWidth="8" />
            <circle 
              ref={circleRef}
              className="progress-ring-circle" 
              cx="90" 
              cy="90" 
              r="80" 
              fill="none" 
              stroke={rankDetails.glowColor.replace('rgba', 'rgb').replace(/, .*\)/, ')')}
              strokeWidth="8" 
              strokeDasharray="502.4" 
              strokeDashoffset="200.96" 
              style={{
                transition: 'stroke-dashoffset 0.35s',
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
              }}
            />
          </svg>
        </motion.div>
      </div>
      
      {/* Rank Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">LIFETIME PUSHUPS</p>
          <p className="text-3xl font-bold text-white">{totalPushups}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">MAX SINGLE SET</p>
          <p className="text-3xl font-bold text-white">{maxSet}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">NEXT RANK AT</p>
          <p className="text-3xl font-bold text-purple-500">
            {nextThreshold && nextThreshold > 0 ? nextThreshold : 'MAX'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default RankDisplay;
