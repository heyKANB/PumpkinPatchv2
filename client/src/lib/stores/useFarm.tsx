import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { FARM_SIZE } from "../constants";
import { useXP, XP_ACTIVITIES } from "./useXP";

export type CropType = 'pumpkin' | 'corn';
export type CropStage = 'seed' | 'sprout' | 'growing' | 'mature';

export interface Crop {
  type: CropType;
  stage: CropStage;
  plantedTime: number;
  lastGrowthTime: number;
}

export interface FarmPlot {
  crop: Crop | null;
}

export interface CropSeeds {
  pumpkin: number;
  corn: number;
}

export interface HarvestedCrops {
  pumpkin: number;
  corn: number;
}

export interface UnlockedCrops {
  pumpkin: boolean;
  corn: boolean;
}

export interface PlayerInventory {
  seeds: CropSeeds;
  harvestedCrops: HarvestedCrops;
  unlockedCrops: UnlockedCrops;
  selectedCropType: CropType;
}

interface FarmState {
  farmGrid: FarmPlot[][];
  playerInventory: PlayerInventory;
  isFirstPlant: boolean;
  isFirstHarvest: boolean;
  consecutiveHarvests: number;
  lastHarvestTime: number;
  
  // Actions
  initializeFarm: () => void;
  plantCrop: (row: number, col: number, cropType?: CropType) => boolean;
  harvestCrop: (row: number, col: number) => boolean;
  sellCrop: (cropType: CropType) => boolean;
  unlockCrop: (cropType: CropType) => boolean;
  purchaseSeeds: (cropType: CropType, quantity: number) => boolean;
  setSelectedCropType: (cropType: CropType) => void;
  updateGrowth: () => void;
  getTotalCropsByStage: () => Record<CropType, Record<CropStage, number>>;
  
  // Save/Load actions
  setFarmGrid: (grid: FarmPlot[][]) => void;
  setInventory: (inventory: PlayerInventory) => void;
  setXPState: (xpState: { isFirstPlant: boolean; isFirstHarvest: boolean; consecutiveHarvests: number; lastHarvestTime: number }) => void;
}

const createEmptyGrid = (): FarmPlot[][] => {
  return Array(FARM_SIZE).fill(null).map(() =>
    Array(FARM_SIZE).fill(null).map(() => ({
      crop: null
    }))
  );
};

const GROWTH_STAGES: CropStage[] = ['seed', 'sprout', 'growing', 'mature'];

// Growth times per stage in milliseconds
const CROP_GROWTH_TIMES: Record<CropType, number> = {
  pumpkin: 5000, // 5 seconds per stage
  corn: 12000,   // 12 seconds per stage (considerably longer)
};

// Crop unlock requirements
export const CROP_UNLOCK_LEVELS: Record<CropType, number> = {
  pumpkin: 1,
  corn: 5,
};

// Crop unlock costs
export const CROP_UNLOCK_COSTS: Record<CropType, number> = {
  pumpkin: 0,  // Free
  corn: 50,    // 50 coins
};

// Seed costs
export const SEED_COSTS: Record<CropType, number> = {
  pumpkin: 0,  // Free (as before)
  corn: 2,     // 2 coins each
};

export const useFarm = create<FarmState>()(
  subscribeWithSelector((set, get) => ({
    farmGrid: createEmptyGrid(),
    playerInventory: {
      seeds: {
        pumpkin: 10, // Start with 10 pumpkin seeds
        corn: 0,
      },
      harvestedCrops: {
        pumpkin: 0,
        corn: 0,
      },
      unlockedCrops: {
        pumpkin: true,  // Pumpkins are unlocked from start
        corn: false,    // Corn needs to be unlocked
      },
      selectedCropType: 'pumpkin' as CropType,
    },
    isFirstPlant: true,
    isFirstHarvest: true,
    consecutiveHarvests: 0,
    lastHarvestTime: 0,
    
    initializeFarm: () => {
      set({
        farmGrid: createEmptyGrid(),
        playerInventory: {
          seeds: {
            pumpkin: 10,
            corn: 0,
          },
          harvestedCrops: {
            pumpkin: 0,
            corn: 0,
          },
          unlockedCrops: {
            pumpkin: true,
            corn: false,
          },
          selectedCropType: 'pumpkin' as CropType,
        },
        isFirstPlant: true,
        isFirstHarvest: true,
        consecutiveHarvests: 0,
        lastHarvestTime: 0,
      });
    },
    
    plantCrop: (row: number, col: number, cropType?: CropType) => {
      const state = get();
      const selectedCrop = cropType || state.playerInventory.selectedCropType;
      
      // Check if we have seeds and the plot is empty
      if (state.playerInventory.seeds[selectedCrop] <= 0 || 
          row < 0 || row >= FARM_SIZE || 
          col < 0 || col >= FARM_SIZE ||
          state.farmGrid[row][col].crop !== null ||
          !state.playerInventory.unlockedCrops[selectedCrop]) {
        return false;
      }
      
      const now = Date.now();
      const newGrid = state.farmGrid.map((farmRow, rowIndex) =>
        farmRow.map((plot, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return {
              crop: {
                type: selectedCrop,
                stage: 'seed' as CropStage,
                plantedTime: now,
                lastGrowthTime: now,
              }
            };
          }
          return plot;
        })
      );
      
      // Award XP for planting
      const xpStore = useXP.getState();
      if (state.isFirstPlant) {
        xpStore.addXP(XP_ACTIVITIES.FIRST_PLANT);
        set({
          farmGrid: newGrid,
          playerInventory: {
            ...state.playerInventory,
            seeds: {
              ...state.playerInventory.seeds,
              [selectedCrop]: state.playerInventory.seeds[selectedCrop] - 1,
            },
          },
          isFirstPlant: false
        });
      } else {
        xpStore.addXP(XP_ACTIVITIES.PLANT_SEED);
        set({
          farmGrid: newGrid,
          playerInventory: {
            ...state.playerInventory,
            seeds: {
              ...state.playerInventory.seeds,
              [selectedCrop]: state.playerInventory.seeds[selectedCrop] - 1,
            },
          }
        });
      }
      
      return true;
    },
    
    harvestCrop: (row: number, col: number) => {
      const state = get();
      
      // Check if the plot has a mature crop
      if (row < 0 || row >= FARM_SIZE || 
          col < 0 || col >= FARM_SIZE ||
          state.farmGrid[row][col].crop?.stage !== 'mature') {
        return false;
      }
      
      const crop = state.farmGrid[row][col].crop!;
      const newGrid = state.farmGrid.map((farmRow, rowIndex) =>
        farmRow.map((plot, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return { crop: null };
          }
          return plot;
        })
      );
      
      // Award XP for harvesting
      const xpStore = useXP.getState();
      const now = Date.now();
      const timeSinceLastHarvest = now - state.lastHarvestTime;
      
      // Check for consecutive harvests (within 10 seconds)
      let newConsecutiveHarvests = timeSinceLastHarvest < 10000 ? state.consecutiveHarvests + 1 : 1;
      
      if (state.isFirstHarvest) {
        xpStore.addXP(XP_ACTIVITIES.FIRST_HARVEST);
        set({
          farmGrid: newGrid,
          playerInventory: {
            ...state.playerInventory,
            harvestedCrops: {
              ...state.playerInventory.harvestedCrops,
              [crop.type]: state.playerInventory.harvestedCrops[crop.type] + 1,
            },
            seeds: {
              ...state.playerInventory.seeds,
              [crop.type]: state.playerInventory.seeds[crop.type] + (crop.type === 'pumpkin' ? 2 : 1), // Pumpkins give 2 seeds, corn gives 1
            },
          },
          isFirstHarvest: false,
          consecutiveHarvests: newConsecutiveHarvests,
          lastHarvestTime: now
        });
      } else {
        xpStore.addXP(XP_ACTIVITIES.HARVEST_PUMPKIN);
        
        // Award bonus XP for mass harvest
        if (newConsecutiveHarvests >= 5) {
          xpStore.addXP(XP_ACTIVITIES.MASS_HARVEST);
          newConsecutiveHarvests = 0; // Reset counter after achievement
        }
        
        set({
          farmGrid: newGrid,
          playerInventory: {
            ...state.playerInventory,
            harvestedCrops: {
              ...state.playerInventory.harvestedCrops,
              [crop.type]: state.playerInventory.harvestedCrops[crop.type] + 1,
            },
            seeds: {
              ...state.playerInventory.seeds,
              [crop.type]: state.playerInventory.seeds[crop.type] + (crop.type === 'pumpkin' ? 2 : 1),
            },
          },
          consecutiveHarvests: newConsecutiveHarvests,
          lastHarvestTime: now
        });
      }
      
      return true;
    },
    
    updateGrowth: () => {
      const state = get();
      const now = Date.now();
      let hasChanges = false;
      
      const newGrid = state.farmGrid.map(farmRow =>
        farmRow.map(plot => {
          if (!plot.crop || plot.crop.stage === 'mature') {
            return plot;
          }
          
          const timeSinceLastGrowth = now - plot.crop.lastGrowthTime;
          const growthTime = CROP_GROWTH_TIMES[plot.crop.type];
          
          if (timeSinceLastGrowth >= growthTime) {
            const currentStageIndex = GROWTH_STAGES.indexOf(plot.crop.stage);
            const nextStageIndex = Math.min(currentStageIndex + 1, GROWTH_STAGES.length - 1);
            
            if (nextStageIndex > currentStageIndex) {
              hasChanges = true;
              return {
                crop: {
                  ...plot.crop,
                  stage: GROWTH_STAGES[nextStageIndex],
                  lastGrowthTime: now,
                }
              };
            }
          }
          
          return plot;
        })
      );
      
      if (hasChanges) {
        set({ farmGrid: newGrid });
      }
    },
    
    getTotalCropsByStage: () => {
      const state = get();
      const counts: Record<CropType, Record<CropStage, number>> = {
        pumpkin: { seed: 0, sprout: 0, growing: 0, mature: 0 },
        corn: { seed: 0, sprout: 0, growing: 0, mature: 0 },
      };
      
      state.farmGrid.forEach(row => {
        row.forEach(plot => {
          if (plot.crop) {
            counts[plot.crop.type][plot.crop.stage]++;
          }
        });
      });
      
      return counts;
    },
    
    sellCrop: (cropType: CropType) => {
      const state = get();
      
      // Check if we have crops to sell
      if (state.playerInventory.harvestedCrops[cropType] <= 0) {
        return false;
      }
      
      set({
        playerInventory: {
          ...state.playerInventory,
          harvestedCrops: {
            ...state.playerInventory.harvestedCrops,
            [cropType]: state.playerInventory.harvestedCrops[cropType] - 1,
          },
        }
      });
      
      console.log(`[Farm] Sold 1 ${cropType}. Remaining: ${state.playerInventory.harvestedCrops[cropType] - 1}`);
      return true;
    },
    
    // Save/Load actions
    setFarmGrid: (grid: FarmPlot[][]) => {
      set({ farmGrid: grid });
    },
    
    unlockCrop: (cropType: CropType) => {
      const state = get();
      
      // Check if already unlocked
      if (state.playerInventory.unlockedCrops[cropType]) {
        return false;
      }
      
      set({
        playerInventory: {
          ...state.playerInventory,
          unlockedCrops: {
            ...state.playerInventory.unlockedCrops,
            [cropType]: true,
          },
        }
      });
      
      console.log(`[Farm] Unlocked ${cropType} crop!`);
      return true;
    },
    
    purchaseSeeds: (cropType: CropType, quantity: number) => {
      const state = get();
      
      set({
        playerInventory: {
          ...state.playerInventory,
          seeds: {
            ...state.playerInventory.seeds,
            [cropType]: state.playerInventory.seeds[cropType] + quantity,
          },
        }
      });
      
      console.log(`[Farm] Purchased ${quantity} ${cropType} seeds`);
      return true;
    },
    
    setSelectedCropType: (cropType: CropType) => {
      const state = get();
      if (state.playerInventory.unlockedCrops[cropType]) {
        set({
          playerInventory: {
            ...state.playerInventory,
            selectedCropType: cropType,
          }
        });
      }
    },
    
    setInventory: (inventory: PlayerInventory) => {
      set({ playerInventory: inventory });
    },
    
    setXPState: (xpState: { isFirstPlant: boolean; isFirstHarvest: boolean; consecutiveHarvests: number; lastHarvestTime: number }) => {
      set({ 
        isFirstPlant: xpState.isFirstPlant,
        isFirstHarvest: xpState.isFirstHarvest,
        consecutiveHarvests: xpState.consecutiveHarvests,
        lastHarvestTime: xpState.lastHarvestTime
      });
    },
  }))
);
