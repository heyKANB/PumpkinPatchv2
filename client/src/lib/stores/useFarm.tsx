import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { FARM_SIZE } from "../constants";

export type PumpkinStage = 'seed' | 'sprout' | 'growing' | 'mature';

export interface Pumpkin {
  stage: PumpkinStage;
  plantedTime: number;
  lastGrowthTime: number;
}

export interface FarmPlot {
  pumpkin: Pumpkin | null;
}

export interface PlayerInventory {
  seeds: number;
  harvestedPumpkins: number;
}

interface FarmState {
  farmGrid: FarmPlot[][];
  playerInventory: PlayerInventory;
  
  // Actions
  initializeFarm: () => void;
  plantPumpkin: (row: number, col: number) => boolean;
  harvestPumpkin: (row: number, col: number) => boolean;
  updateGrowth: () => void;
  getTotalPumpkinsByStage: () => Record<PumpkinStage, number>;
  
  // Save/Load actions
  setFarmGrid: (grid: FarmPlot[][]) => void;
  setInventory: (inventory: PlayerInventory) => void;
}

const createEmptyGrid = (): FarmPlot[][] => {
  return Array(FARM_SIZE).fill(null).map(() =>
    Array(FARM_SIZE).fill(null).map(() => ({
      pumpkin: null
    }))
  );
};

const GROWTH_STAGES: PumpkinStage[] = ['seed', 'sprout', 'growing', 'mature'];
const GROWTH_TIME_MS = 5000; // 5 seconds per stage

export const useFarm = create<FarmState>()(
  subscribeWithSelector((set, get) => ({
    farmGrid: createEmptyGrid(),
    playerInventory: {
      seeds: 10, // Start with 10 seeds
      harvestedPumpkins: 0,
    },
    
    initializeFarm: () => {
      set({
        farmGrid: createEmptyGrid(),
        playerInventory: {
          seeds: 10,
          harvestedPumpkins: 0,
        }
      });
    },
    
    plantPumpkin: (row: number, col: number) => {
      const state = get();
      
      // Check if we have seeds and the plot is empty
      if (state.playerInventory.seeds <= 0 || 
          row < 0 || row >= FARM_SIZE || 
          col < 0 || col >= FARM_SIZE ||
          state.farmGrid[row][col].pumpkin !== null) {
        return false;
      }
      
      const now = Date.now();
      const newGrid = state.farmGrid.map((farmRow, rowIndex) =>
        farmRow.map((plot, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return {
              pumpkin: {
                stage: 'seed' as PumpkinStage,
                plantedTime: now,
                lastGrowthTime: now,
              }
            };
          }
          return plot;
        })
      );
      
      set({
        farmGrid: newGrid,
        playerInventory: {
          ...state.playerInventory,
          seeds: state.playerInventory.seeds - 1,
        }
      });
      
      return true;
    },
    
    harvestPumpkin: (row: number, col: number) => {
      const state = get();
      
      // Check if the plot has a mature pumpkin
      if (row < 0 || row >= FARM_SIZE || 
          col < 0 || col >= FARM_SIZE ||
          state.farmGrid[row][col].pumpkin?.stage !== 'mature') {
        return false;
      }
      
      const newGrid = state.farmGrid.map((farmRow, rowIndex) =>
        farmRow.map((plot, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return { pumpkin: null };
          }
          return plot;
        })
      );
      
      set({
        farmGrid: newGrid,
        playerInventory: {
          ...state.playerInventory,
          harvestedPumpkins: state.playerInventory.harvestedPumpkins + 1,
          seeds: state.playerInventory.seeds + 2, // Get 2 seeds from each harvested pumpkin
        }
      });
      
      return true;
    },
    
    updateGrowth: () => {
      const state = get();
      const now = Date.now();
      let hasChanges = false;
      
      const newGrid = state.farmGrid.map(farmRow =>
        farmRow.map(plot => {
          if (!plot.pumpkin || plot.pumpkin.stage === 'mature') {
            return plot;
          }
          
          const timeSinceLastGrowth = now - plot.pumpkin.lastGrowthTime;
          
          if (timeSinceLastGrowth >= GROWTH_TIME_MS) {
            const currentStageIndex = GROWTH_STAGES.indexOf(plot.pumpkin.stage);
            const nextStageIndex = Math.min(currentStageIndex + 1, GROWTH_STAGES.length - 1);
            
            if (nextStageIndex > currentStageIndex) {
              hasChanges = true;
              return {
                pumpkin: {
                  ...plot.pumpkin,
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
    
    getTotalPumpkinsByStage: () => {
      const state = get();
      const counts: Record<PumpkinStage, number> = {
        seed: 0,
        sprout: 0,
        growing: 0,
        mature: 0,
      };
      
      state.farmGrid.forEach(row => {
        row.forEach(plot => {
          if (plot.pumpkin) {
            counts[plot.pumpkin.stage]++;
          }
        });
      });
      
      return counts;
    },
    
    // Save/Load actions
    setFarmGrid: (grid: FarmPlot[][]) => {
      set({ farmGrid: grid });
    },
    
    setInventory: (inventory: PlayerInventory) => {
      set({ playerInventory: inventory });
    },
  }))
);
