import { useFarm } from './stores/useFarm';
import { useCoins } from './stores/useCoins';
import { useEquipment } from './stores/useEquipment';
import { useGame } from './stores/useGame';
import { useXP } from './stores/useXP';

interface SaveData {
  version: string;
  timestamp: number;
  farm: {
    farmGrid: any[][];
    inventory: {
      seeds: number;
      harvestedPumpkins: number;
    };
    isFirstPlant: boolean;
    isFirstHarvest: boolean;
    consecutiveHarvests: number;
    lastHarvestTime: number;
  };
  coins: {
    count: number;
  };
  equipment: {
    items: any[];
  };
  game: {
    phase: string;
    lastPlayTime: number;
  };
  xp: {
    currentXP: number;
    level: number;
    totalXPEarned: number;
  };
}

const SAVE_KEY = 'pumpkin-farm-save';
const SAVE_VERSION = '1.0.0';

export class SaveSystem {
  static save(): void {
    try {
      const farmState = useFarm.getState();
      const coinsState = useCoins.getState();
      const equipmentState = useEquipment.getState();
      const gameState = useGame.getState();
      const xpState = useXP.getState();

      const saveData: SaveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        farm: {
          farmGrid: farmState.farmGrid,
          inventory: farmState.playerInventory,
          isFirstPlant: farmState.isFirstPlant,
          isFirstHarvest: farmState.isFirstHarvest,
          consecutiveHarvests: farmState.consecutiveHarvests,
          lastHarvestTime: farmState.lastHarvestTime,
        },
        coins: {
          count: coinsState.coins,
        },
        equipment: {
          items: equipmentState.equipment,
        },
        game: {
          phase: gameState.phase,
          lastPlayTime: Date.now(),
        },
        xp: {
          currentXP: xpState.currentXP,
          level: xpState.level,
          totalXPEarned: xpState.totalXPEarned,
        }
      };

      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      console.log('Game progress saved successfully');
    } catch (error) {
      console.error('Failed to save game progress:', error);
    }
  }

  static load(): SaveData | null {
    try {
      const saveString = localStorage.getItem(SAVE_KEY);
      if (!saveString) {
        console.log('No save data found - starting fresh game');
        return null;
      }

      const saveData: SaveData = JSON.parse(saveString);
      
      // Version compatibility check
      if (saveData.version !== SAVE_VERSION) {
        console.warn('Save data version mismatch - may need migration');
      }

      console.log('Save data loaded successfully', {
        timestamp: new Date(saveData.timestamp).toISOString(),
        version: saveData.version
      });

      return saveData;
    } catch (error) {
      console.error('Failed to load game progress:', error);
      return null;
    }
  }

  static restore(saveData: SaveData): void {
    try {
      // Restore farm state
      if (saveData.farm) {
        const farmStore = useFarm.getState();
        if (saveData.farm.farmGrid) {
          farmStore.setFarmGrid(saveData.farm.farmGrid);
        }
        if (saveData.farm.inventory) {
          farmStore.setInventory(saveData.farm.inventory);
        }
        // Restore XP-related farm state
        if (saveData.farm.isFirstPlant !== undefined || 
            saveData.farm.isFirstHarvest !== undefined ||
            saveData.farm.consecutiveHarvests !== undefined ||
            saveData.farm.lastHarvestTime !== undefined) {
          farmStore.setXPState({
            isFirstPlant: saveData.farm.isFirstPlant ?? true,
            isFirstHarvest: saveData.farm.isFirstHarvest ?? true,
            consecutiveHarvests: saveData.farm.consecutiveHarvests ?? 0,
            lastHarvestTime: saveData.farm.lastHarvestTime ?? 0
          });
        }
      }

      // Restore coins
      if (saveData.coins) {
        useCoins.getState().setCoins(saveData.coins.count);
      }

      // Restore equipment state
      if (saveData.equipment && saveData.equipment.items) {
        useEquipment.getState().setItems(saveData.equipment.items);
      }

      // Restore game state
      if (saveData.game) {
        if (saveData.game.phase) {
          useGame.getState().setPhase(saveData.game.phase as any);
        }
      }

      // Restore XP state
      if (saveData.xp) {
        const xpStore = useXP.getState();
        xpStore.setXP(saveData.xp.totalXPEarned);
      }

      console.log('Game state restored successfully');
    } catch (error) {
      console.error('Failed to restore game state:', error);
    }
  }

  static autoSave(): void {
    // Save immediately
    SaveSystem.save();
    
    // Set up auto-save every 10 seconds
    setInterval(() => {
      SaveSystem.save();
    }, 10000);

    // Save when the page is about to unload
    window.addEventListener('beforeunload', () => {
      SaveSystem.save();
    });

    // Save when the page becomes hidden (mobile background)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        SaveSystem.save();
      }
    });
  }



  static clearSave(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
      console.log('Save data cleared');
    } catch (error) {
      console.error('Failed to clear save data:', error);
    }
  }

  static hasSave(): boolean {
    try {
      return localStorage.getItem(SAVE_KEY) !== null;
    } catch (error) {
      return false;
    }
  }
}

