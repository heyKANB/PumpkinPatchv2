import { create } from 'zustand';

export interface XPActivity {
  type: 'plant' | 'harvest' | 'repair' | 'exploration' | 'achievement';
  name: string;
  baseXP: number;
  description: string;
}

export interface XPGain {
  activity: XPActivity;
  amount: number;
  timestamp: number;
}

interface XPState {
  currentXP: number;
  level: number;
  totalXPEarned: number;
  recentGains: XPGain[];
  
  // Actions
  addXP: (activity: XPActivity, bonusMultiplier?: number) => void;
  getXPForNextLevel: () => number;
  getXPProgress: () => number;
  getLevelProgress: () => { current: number; needed: number; percentage: number };
  clearRecentGains: () => void;
  setXP: (xp: number) => void;
  setLevel: (level: number) => void;
}

// XP Activities Configuration
export const XP_ACTIVITIES: Record<string, XPActivity> = {
  PLANT_SEED: {
    type: 'plant',
    name: 'Plant Seed',
    baseXP: 5,
    description: 'Plant a pumpkin seed in the soil'
  },
  HARVEST_PUMPKIN: {
    type: 'harvest',
    name: 'Harvest Pumpkin',
    baseXP: 15,
    description: 'Harvest a fully grown pumpkin'
  },
  REPAIR_EQUIPMENT: {
    type: 'repair',
    name: 'Repair Equipment',
    baseXP: 25,
    description: 'Successfully repair farm equipment'
  },
  FIRST_PLANT: {
    type: 'achievement',
    name: 'First Sprout',
    baseXP: 50,
    description: 'Plant your very first seed'
  },
  FIRST_HARVEST: {
    type: 'achievement',
    name: 'First Harvest',
    baseXP: 100,
    description: 'Harvest your first pumpkin'
  },
  MASS_HARVEST: {
    type: 'achievement',
    name: 'Bountiful Harvest',
    baseXP: 75,
    description: 'Harvest 5 pumpkins in quick succession'
  }
};

// Calculate XP needed for a specific level
const calculateXPForLevel = (level: number): number => {
  // Progressive XP requirement: 100 * level^1.5
  return Math.floor(100 * Math.pow(level, 1.5));
};

// Calculate total XP needed to reach a level
const calculateTotalXPForLevel = (level: number): number => {
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += calculateXPForLevel(i);
  }
  return totalXP;
};

// Calculate level from total XP
const calculateLevelFromXP = (totalXP: number): number => {
  let level = 1;
  let xpAccumulated = 0;
  
  while (true) {
    const xpNeededForNextLevel = calculateXPForLevel(level);
    if (xpAccumulated + xpNeededForNextLevel > totalXP) {
      break;
    }
    xpAccumulated += xpNeededForNextLevel;
    level++;
  }
  
  return level;
};

export const useXP = create<XPState>((set, get) => ({
  currentXP: 0,
  level: 1,
  totalXPEarned: 0,
  recentGains: [],

  addXP: (activity: XPActivity, bonusMultiplier: number = 1) => {
    const state = get();
    const xpGained = Math.floor(activity.baseXP * bonusMultiplier);
    const newTotalXP = state.totalXPEarned + xpGained;
    const newLevel = calculateLevelFromXP(newTotalXP);
    const totalXPForCurrentLevel = calculateTotalXPForLevel(newLevel);
    const currentXP = newTotalXP - totalXPForCurrentLevel;
    
    const xpGain: XPGain = {
      activity,
      amount: xpGained,
      timestamp: Date.now()
    };

    // Check for level up
    const leveledUp = newLevel > state.level;
    
    set({
      currentXP,
      level: newLevel,
      totalXPEarned: newTotalXP,
      recentGains: [...state.recentGains.slice(-4), xpGain] // Keep last 5 gains
    });

    // Log XP gain and level up
    console.log(`[XP] Gained ${xpGained} XP for ${activity.name}${bonusMultiplier > 1 ? ` (${bonusMultiplier}x bonus)` : ''}`);
    if (leveledUp) {
      console.log(`[XP] Level up! Now level ${newLevel}`);
    }

    return { gained: xpGained, leveledUp, newLevel };
  },

  getXPForNextLevel: () => {
    const state = get();
    return calculateXPForLevel(state.level);
  },

  getXPProgress: () => {
    const state = get();
    const xpForNextLevel = calculateXPForLevel(state.level);
    return Math.min((state.currentXP / xpForNextLevel) * 100, 100);
  },

  getLevelProgress: () => {
    const state = get();
    const needed = calculateXPForLevel(state.level);
    const current = state.currentXP;
    const percentage = (current / needed) * 100;
    
    return {
      current,
      needed,
      percentage: Math.min(percentage, 100)
    };
  },

  clearRecentGains: () => {
    set({ recentGains: [] });
  },

  setXP: (totalXP: number) => {
    const newLevel = calculateLevelFromXP(totalXP);
    const totalXPForCurrentLevel = calculateTotalXPForLevel(newLevel);
    const currentXP = totalXP - totalXPForCurrentLevel;
    
    set({
      currentXP,
      level: newLevel,
      totalXPEarned: totalXP
    });
  },

  setLevel: (level: number) => {
    const totalXPForLevel = calculateTotalXPForLevel(level);
    set({
      currentXP: 0,
      level,
      totalXPEarned: totalXPForLevel
    });
  }
}));