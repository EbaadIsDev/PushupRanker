import { PROGRESSION_RANKS, RANK_DETAILS } from '@/lib/rankSystem';
import { motion } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';

interface RankProgressionPathProps {
  currentTier: string;
  totalPushups: number;
}

const RankProgressionPath = ({ currentTier, totalPushups }: RankProgressionPathProps) => {
  const { settings } = useSettings();

  return (
    <section id="progressionPath" className="mb-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Rank Progression Path</h2>
      
      <div className="relative max-w-4xl mx-auto">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 transform -translate-y-1/2"></div>
        
        {/* Rank Progression */}
        <div className="flex justify-between relative">
          {PROGRESSION_RANKS.map((rank, index) => {
            const isActive = rank.tier === currentTier || totalPushups >= rank.threshold;
            const isNext = !isActive && PROGRESSION_RANKS.findIndex(r => r.tier === currentTier) === index - 1;
            const isFuture = !isActive && !isNext;
            
            const rankDetails = RANK_DETAILS[rank.tier];
            
            return (
              <motion.div 
                key={rank.tier}
                className={`z-10 text-center ${isNext ? 'opacity-80' : isFuture ? 'opacity-60' : ''}`}
                whileHover={settings.animationsEnabled ? { scale: 1.05 } : {}}
              >
                <div className={`w-16 h-16 mx-auto bg-gray-800 rounded-full border-4 ${isActive ? rankDetails.borderColor : 'border-gray-700'} flex items-center justify-center mb-2`}>
                  <i className={`ri-award-fill text-2xl ${rankDetails.iconColor}`}></i>
                </div>
                <p className={`font-bold text-xs ${rankDetails.color} uppercase`}>{rank.tier}</p>
                <p className="text-xs text-gray-400">{rank.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RankProgressionPath;
