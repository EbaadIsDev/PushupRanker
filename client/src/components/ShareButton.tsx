import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { formatRankName } from '@/lib/rankSystem';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  totalPushups: number;
  maxSet: number;
  tier: string;
  level: number;
}

const ShareButton = ({ totalPushups, maxSet, tier, level }: ShareButtonProps) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { toast } = useToast();
  
  const shareText = `I'm currently at ${formatRankName(tier as any, level)} rank with ${totalPushups} lifetime pushups and a max set of ${maxSet} on PushupRanker.io! 💪`;
  
  const handleShare = async () => {
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My PushupRanker.io Progress',
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        setIsShareModalOpen(true);
      }
    } else {
      // Fallback to copy to clipboard
      setIsShareModalOpen(true);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: 'Copied to clipboard!',
        description: 'Share your progress with friends.',
      });
      setIsShareModalOpen(false);
    });
  };
  
  return (
    <>
      <div className="fixed bottom-4 left-4">
        <Button
          onClick={handleShare}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition"
        >
          <i className="ri-share-forward-line text-xl"></i>
        </Button>
      </div>
      
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Progress</DialogTitle>
            <DialogClose className="text-gray-400 hover:text-white" />
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <p className="bg-gray-900 p-3 rounded-lg text-sm">{shareText}</p>
            
            <div className="flex justify-end">
              <Button
                onClick={copyToClipboard}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <i className="ri-clipboard-line mr-2"></i>
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareButton;
