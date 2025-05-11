import { useState } from 'react';
import Header from '@/components/Header';
import RankDisplay from '@/components/RankDisplay';
import PushupForm from '@/components/PushupForm';
import RankProgressionPath from '@/components/RankProgressionPath';
import RankBenefits from '@/components/RankBenefits';
import StatsModal from '@/components/StatsModal';
import SettingsModal from '@/components/SettingsModal';
import RankUpNotification from '@/components/RankUpNotification';
import ShareButton from '@/components/ShareButton';
import { useUserData } from '@/hooks/useUserData';
import { PushupSubmission } from '@shared/schema';
import { getNextRankThreshold, PROGRESSION_RANKS } from '@/lib/rankSystem';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  const { 
    userData, 
    isLoading, 
    addPushupRecord, 
    resetProgress, 
    getWeeklyStats,
    showRankUpNotification,
    newRank
  } = useUserData();
  
  const weeklyStats = userData ? getWeeklyStats() : null;
  
  // Handle pushup form submission
  const handlePushupSubmit = async (data: PushupSubmission) => {
    const result = await addPushupRecord(data);
    return result;
  };
  
  // Get next rank tier
  const getNextRankTier = (): string | null => {
    if (!userData) return null;
    
    const currentIndex = PROGRESSION_RANKS.findIndex(rank => rank.tier === userData.currentRankTier);
    if (currentIndex === -1 || currentIndex === PROGRESSION_RANKS.length - 1) return null;
    
    return PROGRESSION_RANKS[currentIndex + 1].tier;
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <span className="ml-2">Loading your progress...</span>
      </div>
    );
  }
  
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
          <p>Unable to load your pushup data.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-900 text-gray-100 font-sans min-h-screen">
      <Header 
        onStatsOpen={() => setIsStatsModalOpen(true)}
        onSettingsOpen={() => setIsSettingsModalOpen(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RankDisplay 
          tier={userData.currentRankTier}
          level={userData.currentRankLevel}
          progress={userData.currentProgress}
          totalPushups={userData.totalPushups}
          maxSet={userData.maxSet}
          nextThreshold={getNextRankThreshold({
            tier: userData.currentRankTier as any,
            level: userData.currentRankLevel,
            progress: userData.currentProgress,
            nextThreshold: 0 // Will be calculated by component
          }) || 0}
        />
        
        <PushupForm onSubmit={handlePushupSubmit} />
        
        <RankProgressionPath 
          currentTier={userData.currentRankTier}
          totalPushups={userData.totalPushups}
        />
        
        <RankBenefits 
          tier={userData.currentRankTier}
          nextTier={getNextRankTier()}
        />
      </main>
      
      {/* Modals */}
      <StatsModal 
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        userData={userData}
        weeklyStats={weeklyStats}
      />
      
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onResetProgress={resetProgress}
      />
      
      {/* Floating Elements */}
      <RankUpNotification 
        show={showRankUpNotification}
        tier={newRank.tier}
        level={newRank.level}
      />
      
      <ShareButton 
        totalPushups={userData.totalPushups}
        maxSet={userData.maxSet}
        tier={userData.currentRankTier}
        level={userData.currentRankLevel}
      />
    </div>
  );
};

export default Home;
