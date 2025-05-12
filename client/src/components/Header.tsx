import StatsModal from './StatsModal';
import SettingsModal from './SettingsModal';

interface HeaderProps {
  onStatsOpen: () => void;
  onSettingsOpen: () => void;
}

const Header = ({ onStatsOpen, onSettingsOpen }: HeaderProps) => {
  return (
    <header className="relative bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <i className="ri-boxing-line text-purple-500 text-3xl mr-2"></i>
              <h1 className="text-2xl font-bold text-white">PushupRanker<span className="text-purple-500">.io</span></h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onStatsOpen}
              className="flex items-center text-gray-300 hover:text-white transition"
            >
              <i className="ri-bar-chart-2-line mr-1"></i>
              <span className="hidden sm:inline">Stats</span>
            </button>
            <button 
              onClick={onSettingsOpen}
              className="flex items-center text-gray-300 hover:text-white transition"
            >
              <i className="ri-settings-3-line mr-1"></i>
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
