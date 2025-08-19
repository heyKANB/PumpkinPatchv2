import { useFarm } from './stores/useFarm';
import { useCoins } from './stores/useCoins';
import { useEquipment } from './stores/useEquipment';
import { useGame } from './stores/useGame';

interface SaveData {
  version: string;
  timestamp: number;
  farm: {
    farmGrid: any[][];
    inventory: {
      seeds: number;
      harvestedPumpkins: number;
    };
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

      const saveData: SaveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        farm: {
          farmGrid: farmState.farmGrid,
          inventory: farmState.playerInventory,
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
        if (saveData.farm.farmGrid) {
          useFarm.getState().setFarmGrid(saveData.farm.farmGrid);
        }
        if (saveData.farm.inventory) {
          useFarm.getState().setInventory(saveData.farm.inventory);
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

      console.log('Game state restored successfully');
    } catch (error) {
      console.error('Failed to restore game state:', error);
    }
  }

  static autoSave(): void {
    // Auto-save every 10 seconds during gameplay
    setInterval(() => {
      const gameState = useGame.getState();
      if (gameState.phase === 'playing') {
        SaveSystem.save();
      }
    }, 10000);
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

// Auto-save when the page is about to be closed
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    SaveSystem.save();
  });

  // Auto-save when the page becomes hidden (mobile app switching)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      SaveSystem.save();
    }
  });
}