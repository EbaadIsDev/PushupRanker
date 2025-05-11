import { useEffect } from 'react';
import { RANK_DETAILS, formatRankName } from '@/lib/rankSystem';
import { motion, AnimatePresence } from 'framer-motion';

interface RankUpNotificationProps {
  show: boolean;
  tier: string;
  level: number;
}

const RankUpNotification = ({ show, tier, level }: RankUpNotificationProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-700 to-indigo-600 p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <i className="ri-medal-line text-2xl text-white"></i>
            </div>
            <div>
              <h3 className="font-bold text-white">New Rank Achieved!</h3>
              <p className="text-sm text-gray-200">
                You've ranked up to {formatRankName(tier as any, level)}!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RankUpNotification;
