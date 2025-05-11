// Rank tiers and their corresponding color and icon classes
export type RankTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface RankInfo {
  tier: RankTier;
  level: number;
  progress: number; // 0-100
  nextThreshold: number | null;
}

interface RankTierDetails {
  color: string;
  iconColor: string;
  glowColor: string;
  borderColor: string;
  benefits: string[];
  nextRankBenefits: string[];
}

export const RANK_THRESHOLDS = {
  BRONZE_1: 0,
  BRONZE_2: 10,
  BRONZE_3: 25,
  SILVER_1: 50,
  SILVER_2: 75,
  GOLD_1: 100,
  GOLD_2: 150,
  PLATINUM_1: 200,
  PLATINUM_2: 250,
  DIAMOND: 300,
};

export const RANK_DETAILS: Record<RankTier, RankTierDetails> = {
  bronze: {
    color: 'text-amber-700',
    iconColor: 'text-amber-700',
    glowColor: 'rgba(180, 83, 9, 0.7)',
    borderColor: 'border-amber-700',
    benefits: [
      'Access to Bronze tier challenges and workouts',
      'Bronze badge display on your profile and shared achievements',
      'Entry-level health tips and progression strategies'
    ],
    nextRankBenefits: [
      'Silver tier challenges with advanced progressions',
      'Detailed performance analytics and history tracking'
    ]
  },
  silver: {
    color: 'text-gray-400',
    iconColor: 'text-gray-400',
    glowColor: 'rgba(156, 163, 175, 0.7)',
    borderColor: 'border-gray-400',
    benefits: [
      'Access to Silver tier challenges and workouts',
      'Silver badge display on your profile',
      'Detailed weekly statistics tracking',
      'Custom workout suggestions'
    ],
    nextRankBenefits: [
      'Gold tier exclusive training programs',
      'Monthly performance reports and insights'
    ]
  },
  gold: {
    color: 'text-yellow-400',
    iconColor: 'text-yellow-400',
    glowColor: 'rgba(250, 204, 21, 0.7)',
    borderColor: 'border-yellow-400',
    benefits: [
      'Access to Gold tier exclusive training programs',
      'Gold badge display on your profile',
      'Monthly performance reports',
      'Advanced fitness metrics tracking',
      'Personalized training advice'
    ],
    nextRankBenefits: [
      'Platinum tier expert training routines',
      'Premium performance analytics dashboard'
    ]
  },
  platinum: {
    color: 'text-gray-300',
    iconColor: 'text-gray-300',
    glowColor: 'rgba(209, 213, 219, 0.7)',
    borderColor: 'border-gray-300',
    benefits: [
      'Access to Platinum tier expert training routines',
      'Platinum badge display on your profile',
      'Premium performance analytics dashboard',
      'Exclusive challenges and achievements',
      'Advanced recovery strategies'
    ],
    nextRankBenefits: [
      'Diamond tier elite training system',
      'Complete performance optimization suite'
    ]
  },
  diamond: {
    color: 'text-sky-300',
    iconColor: 'text-sky-300',
    glowColor: 'rgba(125, 211, 252, 0.7)',
    borderColor: 'border-sky-300',
    benefits: [
      'Access to Diamond tier elite training system',
      'Diamond badge display on your profile',
      'Complete performance optimization suite',
      'Custom achievement tracking',
      'Elite training techniques and strategies',
      'Lifetime achievement status'
    ],
    nextRankBenefits: []
  }
};

// Progression path ranks
export const PROGRESSION_RANKS = [
  { tier: 'bronze' as RankTier, threshold: RANK_THRESHOLDS.BRONZE_1, label: '10+ Pushups' },
  { tier: 'silver' as RankTier, threshold: RANK_THRESHOLDS.SILVER_1, label: '50+ Pushups' },
  { tier: 'gold' as RankTier, threshold: RANK_THRESHOLDS.GOLD_1, label: '100+ Pushups' },
  { tier: 'platinum' as RankTier, threshold: RANK_THRESHOLDS.PLATINUM_1, label: '200+ Pushups' },
  { tier: 'diamond' as RankTier, threshold: RANK_THRESHOLDS.DIAMOND, label: '300+ Pushups' },
];

// Get rank from pushup count
export function calculateRank(totalPushups: number, maxSet: number): RankInfo {
  // Use the max between total pushups and max set to determine rank
  const count = Math.max(totalPushups, maxSet);
  
  // Default to Bronze 1
  let tier: RankTier = 'bronze';
  let level = 1;
  let progress = 0;
  let nextThreshold = RANK_THRESHOLDS.BRONZE_2;
  
  if (count < RANK_THRESHOLDS.BRONZE_2) {
    // Beginner: 0-9 pushups
    tier = 'bronze';
    level = 1;
    progress = count * 10; // 0-90% within Bronze level 1
    nextThreshold = RANK_THRESHOLDS.BRONZE_2;
  } else if (count < RANK_THRESHOLDS.BRONZE_3) {
    // Bronze level 2: 10-24 pushups
    tier = 'bronze';
    level = 2;
    progress = (count - RANK_THRESHOLDS.BRONZE_2) * (100 / (RANK_THRESHOLDS.BRONZE_3 - RANK_THRESHOLDS.BRONZE_2));
    nextThreshold = RANK_THRESHOLDS.BRONZE_3;
  } else if (count < RANK_THRESHOLDS.SILVER_1) {
    // Bronze level 3: 25-49 pushups
    tier = 'bronze';
    level = 3;
    progress = (count - RANK_THRESHOLDS.BRONZE_3) * (100 / (RANK_THRESHOLDS.SILVER_1 - RANK_THRESHOLDS.BRONZE_3));
    nextThreshold = RANK_THRESHOLDS.SILVER_1;
  } else if (count < RANK_THRESHOLDS.SILVER_2) {
    // Silver level 1: 50-74 pushups
    tier = 'silver';
    level = 1;
    progress = (count - RANK_THRESHOLDS.SILVER_1) * (100 / (RANK_THRESHOLDS.SILVER_2 - RANK_THRESHOLDS.SILVER_1));
    nextThreshold = RANK_THRESHOLDS.SILVER_2;
  } else if (count < RANK_THRESHOLDS.GOLD_1) {
    // Silver level 2: 75-99 pushups
    tier = 'silver';
    level = 2;
    progress = (count - RANK_THRESHOLDS.SILVER_2) * (100 / (RANK_THRESHOLDS.GOLD_1 - RANK_THRESHOLDS.SILVER_2));
    nextThreshold = RANK_THRESHOLDS.GOLD_1;
  } else if (count < RANK_THRESHOLDS.GOLD_2) {
    // Gold level 1: 100-149 pushups
    tier = 'gold';
    level = 1;
    progress = (count - RANK_THRESHOLDS.GOLD_1) * (100 / (RANK_THRESHOLDS.GOLD_2 - RANK_THRESHOLDS.GOLD_1));
    nextThreshold = RANK_THRESHOLDS.GOLD_2;
  } else if (count < RANK_THRESHOLDS.PLATINUM_1) {
    // Gold level 2: 150-199 pushups
    tier = 'gold';
    level = 2;
    progress = (count - RANK_THRESHOLDS.GOLD_2) * (100 / (RANK_THRESHOLDS.PLATINUM_1 - RANK_THRESHOLDS.GOLD_2));
    nextThreshold = RANK_THRESHOLDS.PLATINUM_1;
  } else if (count < RANK_THRESHOLDS.PLATINUM_2) {
    // Platinum level 1: 200-249 pushups
    tier = 'platinum';
    level = 1;
    progress = (count - RANK_THRESHOLDS.PLATINUM_1) * (100 / (RANK_THRESHOLDS.PLATINUM_2 - RANK_THRESHOLDS.PLATINUM_1));
    nextThreshold = RANK_THRESHOLDS.PLATINUM_2;
  } else if (count < RANK_THRESHOLDS.DIAMOND) {
    // Platinum level 2: 250-299 pushups
    tier = 'platinum';
    level = 2;
    progress = (count - RANK_THRESHOLDS.PLATINUM_2) * (100 / (RANK_THRESHOLDS.DIAMOND - RANK_THRESHOLDS.PLATINUM_2));
    nextThreshold = RANK_THRESHOLDS.DIAMOND;
  } else {
    // Diamond tier: 300+ pushups
    tier = 'diamond';
    level = Math.min(5, 1 + Math.floor((count - RANK_THRESHOLDS.DIAMOND) / 100));
    progress = ((count - RANK_THRESHOLDS.DIAMOND) % 100) * (100 / 100);
    nextThreshold = RANK_THRESHOLDS.DIAMOND + (level * 100);
    
    // Cap at Diamond level 5
    if (level === 5) {
      progress = 100;
      nextThreshold = null;
    }
  }
  
  return {
    tier,
    level,
    progress: Math.min(100, Math.floor(progress)),
    nextThreshold
  };
}

// Get the next rank threshold
export function getNextRankThreshold(rank: RankInfo): number | null {
  return rank.nextThreshold;
}

// Get formatted rank name
export function formatRankName(tier: RankTier, level: number): string {
  return `${tier.charAt(0).toUpperCase() + tier.slice(1)} Level ${level}`;
}

// Difficulty levels and their modifiers for pushup count
export const DIFFICULTY_LEVELS = [
  { value: 'standard', label: 'Standard', modifier: 1.0 },
  { value: 'knee', label: 'Knee Pushups', modifier: 0.5 },
  { value: 'incline', label: 'Incline', modifier: 0.7 },
  { value: 'decline', label: 'Decline', modifier: 1.3 },
  { value: 'diamond', label: 'Diamond', modifier: 1.5 },
  { value: 'oneArm', label: 'One Arm', modifier: 2.0 },
];

// Get effective pushup count based on difficulty
export function getEffectivePushupCount(count: number, difficultyLevel: string): number {
  const difficulty = DIFFICULTY_LEVELS.find(d => d.value === difficultyLevel);
  if (!difficulty) return count;
  return Math.round(count * difficulty.modifier);
}
