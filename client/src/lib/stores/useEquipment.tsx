import { create } from 'zustand';
import { useXP, XP_ACTIVITIES } from './useXP';

interface Equipment {
  id: string;
  type: 'tractor' | 'watering_can' | 'hoe';
  position: [number, number, number];
  durability: number; // 0-100
  lastMaintained: number;
  repairCost: number;
}

interface EquipmentStore {
  equipment: Equipment[];
  selectedEquipment: Equipment | null;
  maintenanceGameActive: boolean;
  
  // Actions
  initializeEquipment: () => void;
  selectEquipment: (equipment: Equipment | null) => void;
  repairEquipment: (equipmentId: string, newDurability: number) => void;
  degradeEquipment: () => void;
  setMaintenanceGameActive: (active: boolean) => void;
  setItems: (equipment: Equipment[]) => void;
}

export const useEquipment = create<EquipmentStore>((set, get) => ({
  equipment: [],
  selectedEquipment: null,
  maintenanceGameActive: false,

  initializeEquipment: () => {
    const initialEquipment: Equipment[] = [
      {
        id: 'tractor-1',
        type: 'tractor',
        position: [-6, 0, 4],
        durability: 85,
        lastMaintained: Date.now(),
        repairCost: 50
      },
      {
        id: 'watering-can-1',
        type: 'watering_can',
        position: [6, 0, 4],
        durability: 70,
        lastMaintained: Date.now() - 300000, // 5 minutes ago
        repairCost: 20
      },
      {
        id: 'hoe-1',
        type: 'hoe',
        position: [8, 0, 4],
        durability: 45,
        lastMaintained: Date.now() - 600000, // 10 minutes ago
        repairCost: 30
      }
    ];
    
    set({ equipment: initialEquipment });
  },

  selectEquipment: (equipment) => {
    set({ selectedEquipment: equipment });
  },

  repairEquipment: (equipmentId, newDurability) => {
    console.log(`[Equipment Store] Repairing equipment: ${equipmentId}, new durability: ${newDurability}`);
    
    // Award XP for equipment repair
    const xpStore = useXP.getState();
    xpStore.addXP(XP_ACTIVITIES.REPAIR_EQUIPMENT);
    
    set(state => {
      const updatedEquipment = state.equipment.map(item => {
        if (item.id === equipmentId) {
          console.log(`[Equipment Store] Found equipment ${equipmentId}: ${item.durability}% -> ${newDurability}%`);
          return { ...item, durability: newDurability, lastMaintained: Date.now() };
        }
        return item;
      });
      
      console.log('[Equipment Store] Updated equipment array:', updatedEquipment);
      
      return {
        equipment: updatedEquipment,
        selectedEquipment: null,
        maintenanceGameActive: false
      };
    });
  },

  degradeEquipment: () => {
    const now = Date.now();
    set(state => ({
      equipment: state.equipment.map(item => {
        // Equipment degrades over time (1 durability per minute of use)
        const timeSinceLastMaintenance = now - item.lastMaintained;
        const minutesSinceLastMaintenance = timeSinceLastMaintenance / 60000;
        const degradation = Math.floor(minutesSinceLastMaintenance / 2); // Slow degradation
        
        const newDurability = Math.max(0, item.durability - degradation);
        
        return {
          ...item,
          durability: newDurability,
          lastMaintained: item.durability !== newDurability ? now : item.lastMaintained
        };
      })
    }));
  },

  setMaintenanceGameActive: (active) => {
    set({ maintenanceGameActive: active });
  },

  setItems: (equipment: Equipment[]) => {
    set({ equipment });
  }
}));