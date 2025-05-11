import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AnonymousUserData, PushupSubmission } from '@shared/schema';
import { formatRankName, RANK_DETAILS } from '@/lib/rankSystem';
import { motion } from 'framer-motion';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: AnonymousUserData | null;
  weeklyStats: {
    weeklyData: { day: string; count: number }[];
    weeklyTotal: number;
    avgPerDay: number;
    bestDay: string;
    currentStreak: number;
  } | null;
}

const StatsModal = ({ isOpen, onClose, userData, weeklyStats }: StatsModalProps) => {
  if (!userData || !weeklyStats) return null;

  // Find max count to normalize chart bars
  const maxCount = Math.max(...weeklyStats.weeklyData.map(day => day.count), 1);
  
  // Get current rank details for styling
  const rankTier = userData.currentRankTier as keyof typeof RANK_DETAILS;
  const rankDetails = RANK_DETAILS[rankTier];
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Your Pushup Stats</DialogTitle>
          <DialogClose className="text-gray-400 hover:text-white" />
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Weekly Progress */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Weekly Progress</h3>
            <div className="h-48 bg-gray-900 rounded-lg p-4 flex items-end justify-between space-x-2">
              {/* Chart Bars */}
              {weeklyStats.weeklyData.map((day, index) => {
                const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                // Highlight current day
                const isToday = new Date().getDay() === index;
                const barColor = isToday ? 'bg-purple-600' : 'bg-purple-800 bg-opacity-30';
                
                return (
                  <div key={day.day} className="flex-1 flex flex-col justify-end items-center">
                    <motion.div 
                      className={`w-full ${barColor} rounded-t-sm`} 
                      style={{ height: `${height}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                    <span className="text-xs mt-2">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Weekly Total</p>
              <p className="text-2xl font-bold">{weeklyStats.weeklyTotal}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Avg. Per Day</p>
              <p className="text-2xl font-bold">{weeklyStats.avgPerDay}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Best Day</p>
              <p className="text-2xl font-bold">{weeklyStats.bestDay}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Current Streak</p>
              <p className="text-2xl font-bold">{weeklyStats.currentStreak} days</p>
            </div>
          </div>
          
          {/* Recent History */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Recent History</h3>
            <div className="space-y-3">
              {userData.history.slice(0, 5).map((entry, index) => {
                const date = new Date(entry.timestamp);
                const isToday = new Date().toDateString() === date.toDateString();
                const isYesterday = new Date(Date.now() - 86400000).toDateString() === date.toDateString();
                
                let dateLabel = isToday ? 'Today' : isYesterday ? 'Yesterday' : 
                  `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
                
                const timeLabel = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div key={index} className="bg-gray-900 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{entry.count} pushups</p>
                      <p className="text-sm text-gray-400">
                        {dateLabel}, {timeLabel} - {entry.difficultyLevel.charAt(0).toUpperCase() + entry.difficultyLevel.slice(1)}
                      </p>
                    </div>
                    <div className={rankDetails.iconColor}>
                      <i className="ri-medal-line text-xl"></i>
                    </div>
                  </div>
                );
              })}
              
              {userData.history.length === 0 && (
                <div className="bg-gray-900 p-3 rounded-lg text-center">
                  <p className="text-gray-400">No history yet. Start recording your pushups!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatsModal;
