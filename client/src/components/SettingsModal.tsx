import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetProgress: () => void;
}

const SettingsModal = ({ isOpen, onClose, onResetProgress }: SettingsModalProps) => {
  const { settings, toggleSetting } = useSettings();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const handleReset = () => {
    onResetProgress();
    setShowResetConfirm(false);
  };
  
  // Function to export user data
  const handleExportData = () => {
    const userData = localStorage.getItem('pushupranker_user_data');
    
    if (!userData) {
      return;
    }
    
    // Create a data URL for the user data
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(userData);
    
    // Create a temporary anchor element and trigger a download
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "pushupranker-data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
          <DialogClose className="text-gray-400 hover:text-white" />
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Sound Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Sound & Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="rankUpSound" className="flex items-center cursor-pointer">
                  <i className="ri-volume-up-line mr-2 text-gray-400"></i>
                  <span>Rank Up Sound Effects</span>
                </Label>
                <Switch 
                  id="rankUpSound" 
                  checked={settings.soundEnabled}
                  onCheckedChange={() => toggleSetting('soundEnabled')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="achievementSound" className="flex items-center cursor-pointer">
                  <i className="ri-trophy-line mr-2 text-gray-400"></i>
                  <span>Achievement Notifications</span>
                </Label>
                <Switch 
                  id="achievementSound" 
                  checked={settings.notificationsEnabled}
                  onCheckedChange={() => toggleSetting('notificationsEnabled')}
                />
              </div>
            </div>
          </div>
          
          {/* Display Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Display</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="animationsToggle" className="flex items-center cursor-pointer">
                  <i className="ri-sparkling-line mr-2 text-gray-400"></i>
                  <span>Rank Animations</span>
                </Label>
                <Switch 
                  id="animationsToggle" 
                  checked={settings.animationsEnabled}
                  onCheckedChange={() => toggleSetting('animationsEnabled')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="darkModeToggle" className="flex items-center cursor-pointer">
                  <i className="ri-moon-line mr-2 text-gray-400"></i>
                  <span>Dark Mode</span>
                </Label>
                <Switch 
                  id="darkModeToggle" 
                  checked={settings.darkModeEnabled}
                  onCheckedChange={() => toggleSetting('darkModeEnabled')}
                />
              </div>
            </div>
          </div>
          
          {/* Data Management */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Data Management</h3>
            <div className="space-y-4">
              <Button 
                onClick={handleExportData}
                className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition"
              >
                <i className="ri-download-line mr-2"></i>
                <span>Export Your Data</span>
              </Button>
              
              <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
                <AlertDialogTrigger asChild>
                  <Button 
                    className="w-full flex items-center justify-center bg-red-900 hover:bg-red-800 text-white py-2 px-4 rounded-lg transition"
                  >
                    <i className="ri-delete-bin-line mr-2"></i>
                    <span>Reset Progress</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset All Progress?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      This action cannot be undone. This will permanently delete all your pushup records and reset your rank.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleReset}
                      className="bg-red-900 hover:bg-red-800 text-white"
                    >
                      Yes, Reset Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
