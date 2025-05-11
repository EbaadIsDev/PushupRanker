import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import StatsModal from './StatsModal';
import SettingsModal from './SettingsModal';
import AuthForms from './AuthForms';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onStatsOpen: () => void;
  onSettingsOpen: () => void;
}

const Header = ({ onStatsOpen, onSettingsOpen }: HeaderProps) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch user profile
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['/api/profile'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/profile');
        return response.json();
      } catch (error) {
        return null;
      }
    },
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/logout').then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: 'Logged Out',
        description: 'You have been logged out successfully',
      });
      refetchProfile();
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isAuthenticated = profile?.success;
  const username = profile?.user?.username;

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

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300 hidden md:inline">
                  Welcome, <span className="text-purple-400 font-semibold">{username}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  <i className="ri-logout-box-line mr-1"></i>
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center bg-purple-700 hover:bg-purple-800"
              >
                <i className="ri-user-line mr-1"></i>
                <span>Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthForms
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={() => refetchProfile()}
      />
    </header>
  );
};

export default Header;
