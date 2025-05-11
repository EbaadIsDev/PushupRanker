import { RANK_DETAILS } from '@/lib/rankSystem';

interface RankBenefitsProps {
  tier: string;
  nextTier: string | null;
}

const RankBenefits = ({ tier, nextTier }: RankBenefitsProps) => {
  // Get current rank details
  const rankTier = tier as keyof typeof RANK_DETAILS;
  const rankDetails = RANK_DETAILS[rankTier] || RANK_DETAILS.bronze;
  
  // Get next rank details if available
  const nextRankTier = nextTier as keyof typeof RANK_DETAILS | null;
  const nextRankDetails = nextRankTier ? RANK_DETAILS[nextRankTier] : null;
  
  return (
    <section id="rankBenefits" className="mb-10">
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Current Rank Benefits</h2>
        <div className="space-y-3">
          {rankDetails.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start">
              <i className="ri-check-line text-purple-500 text-xl mr-2 mt-0.5"></i>
              <p>{benefit}</p>
            </div>
          ))}
          
          {nextRankDetails && (
            <div className="mt-6">
              <h3 className={`text-lg font-semibold mb-2 ${nextRankDetails.color}`}>
                Next Rank Unlocks:
              </h3>
              {nextRankDetails.nextRankBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <i className="ri-lock-line text-gray-500 text-xl mr-2 mt-0.5"></i>
                  <p className="text-gray-400">{benefit}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RankBenefits;
