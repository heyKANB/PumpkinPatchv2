import { create } from 'zustand';
import { PlayerAvatar, DEFAULT_AVATAR, AvatarColors, AvatarSlot, DEFAULT_AVATAR_COLORS } from '../avatar/types';
import { AVATAR_CATALOG, getItemById } from '../avatar/catalog';
import { useCoins } from './useCoins';

// Legacy interface for backward compatibility
export interface PlayerAppearance {
  bodyColor: string;
  ringColor: string;
  name: string;
}

interface PlayerAppearanceState {
  // New avatar system
  avatar: PlayerAvatar;
  name: string;
  
  // Color management
  setColors: (colors: Partial<AvatarColors>) => void;
  setName: (name: string) => void;
  
  // Cosmetics management
  purchaseItem: (itemId: string) => { success: boolean; message: string };
  equipItem: (itemId: string) => { success: boolean; message: string };
  unequipSlot: (slot: AvatarSlot) => void;
  isItemOwned: (itemId: string) => boolean;
  isItemEquipped: (itemId: string) => boolean;
  getEquippedInSlot: (slot: AvatarSlot) => string | null;
  
  // Utility functions
  resetToDefault: () => void;
  getVisibleSlots: () => AvatarSlot[];
  
  // Legacy compatibility (deprecated)
  appearance: PlayerAppearance;
  setAppearance: (appearance: Partial<PlayerAppearance>) => void;
}

// Predefined color options for free customization
export const AVATAR_COLORS = [
  { name: 'Blue', colors: { skin: '#FDBCB4', hair: '#8B4513', primary: '#4A90E2', accent: '#7B68EE' } },
  { name: 'Green', colors: { skin: '#FDBCB4', hair: '#654321', primary: '#4CAF50', accent: '#2E7D32' } },
  { name: 'Orange', colors: { skin: '#F4C2A1', hair: '#FF6B35', primary: '#FF8C00', accent: '#FF5722' } },
  { name: 'Purple', colors: { skin: '#FDBCB4', hair: '#4A148C', primary: '#9C27B0', accent: '#6A1B9A' } },
  { name: 'Red', colors: { skin: '#FDBCB4', hair: '#8B0000', primary: '#F44336', accent: '#C62828' } },
  { name: 'Pink', colors: { skin: '#FDBCB4', hair: '#FF69B4', primary: '#E91E63', accent: '#AD1457' } },
  { name: 'Teal', colors: { skin: '#E8D5C4', hair: '#2F4F4F', primary: '#009688', accent: '#00695C' } },
  { name: 'Brown', colors: { skin: '#D2B48C', hair: '#654321', primary: '#8D6E63', accent: '#5D4037' } },
  { name: 'Yellow', colors: { skin: '#FDBCB4', hair: '#DAA520', primary: '#FFC107', accent: '#F57C00' } },
  { name: 'Indigo', colors: { skin: '#FDBCB4', hair: '#191970', primary: '#3F51B5', accent: '#303F9F' } }
];

export const usePlayerAppearance = create<PlayerAppearanceState>((set, get) => ({
  // New avatar system
  avatar: DEFAULT_AVATAR,
  name: 'Farmer',
  
  // Color management
  setColors: (colors: Partial<AvatarColors>) => {
    const state = get();
    const updatedAvatar = {
      ...state.avatar,
      colors: { ...state.avatar.colors, ...colors }
    };
    set({ avatar: updatedAvatar });
    saveAvatar(updatedAvatar, state.name);
    console.log('[PlayerAppearance] Colors updated:', colors);
  },
  
  setName: (name: string) => {
    const state = get();
    const trimmedName = name.trim() || 'Farmer';
    set({ name: trimmedName });
    saveAvatar(state.avatar, trimmedName);
    console.log('[PlayerAppearance] Name updated:', trimmedName);
  },
  
  // Cosmetics management
  purchaseItem: (itemId: string) => {
    const state = get();
    const coinsStore = useCoins.getState();
    const item = getItemById(itemId);
    
    if (!item) {
      return { success: false, message: 'Item not found' };
    }
    
    if (state.avatar.ownedItemIds.includes(itemId)) {
      return { success: false, message: 'You already own this item' };
    }
    
    if (item.priceCoins > 0 && !coinsStore.spendCoins(item.priceCoins)) {
      return { success: false, message: 'Not enough coins' };
    }
    
    const updatedAvatar = {
      ...state.avatar,
      ownedItemIds: [...state.avatar.ownedItemIds, itemId]
    };
    
    set({ avatar: updatedAvatar });
    saveAvatar(updatedAvatar, state.name);
    
    console.log(`[PlayerAppearance] Purchased item: ${item.name} for ${item.priceCoins} coins`);
    return { success: true, message: `${item.name} purchased!` };
  },
  
  equipItem: (itemId: string) => {
    const state = get();
    const item = getItemById(itemId);
    
    if (!item) {
      return { success: false, message: 'Item not found' };
    }
    
    if (!state.avatar.ownedItemIds.includes(itemId)) {
      return { success: false, message: 'You must purchase this item first' };
    }
    
    // Unequip any conflicting items
    let updatedEquipped = { ...state.avatar.equipped };
    
    // Handle items that hide other slots
    if (item.hides) {
      item.hides.forEach(hiddenSlot => {
        updatedEquipped[hiddenSlot] = null;
      });
    }
    
    // Handle conflicts
    if (item.conflictsWith) {
      Object.entries(updatedEquipped).forEach(([slot, equippedId]) => {
        if (equippedId && item.conflictsWith!.includes(equippedId)) {
          updatedEquipped[slot as AvatarSlot] = null;
        }
      });
    }
    
    // Equip the new item
    updatedEquipped[item.slot] = itemId;
    
    const updatedAvatar = {
      ...state.avatar,
      equipped: updatedEquipped
    };
    
    set({ avatar: updatedAvatar });
    saveAvatar(updatedAvatar, state.name);
    
    console.log(`[PlayerAppearance] Equipped item: ${item.name}`);
    return { success: true, message: `${item.name} equipped!` };
  },
  
  unequipSlot: (slot: AvatarSlot) => {
    const state = get();
    const updatedEquipped = { ...state.avatar.equipped };
    updatedEquipped[slot] = null;
    
    const updatedAvatar = {
      ...state.avatar,
      equipped: updatedEquipped
    };
    
    set({ avatar: updatedAvatar });
    saveAvatar(updatedAvatar, state.name);
    
    console.log(`[PlayerAppearance] Unequipped slot: ${slot}`);
  },
  
  isItemOwned: (itemId: string) => {
    return get().avatar.ownedItemIds.includes(itemId);
  },
  
  isItemEquipped: (itemId: string) => {
    const equipped = get().avatar.equipped;
    return Object.values(equipped).includes(itemId);
  },
  
  getEquippedInSlot: (slot: AvatarSlot) => {
    return get().avatar.equipped[slot];
  },
  
  getVisibleSlots: () => {
    const state = get();
    const equipped = state.avatar.equipped;
    const hiddenSlots = new Set<AvatarSlot>();
    
    // Check which slots are hidden by equipped items
    Object.values(equipped).forEach(itemId => {
      if (itemId) {
        const item = getItemById(itemId);
        if (item?.hides) {
          item.hides.forEach(slot => hiddenSlots.add(slot));
        }
      }
    });
    
    // Return all slots except hidden ones
    const allSlots: AvatarSlot[] = ['hair', 'hat', 'bandana', 'torso', 'legs', 'faceAccessory', 'back', 'handheld'];
    return allSlots.filter(slot => !hiddenSlots.has(slot));
  },
  
  resetToDefault: () => {
    set({ 
      avatar: DEFAULT_AVATAR,
      name: 'Farmer'
    });
    saveAvatar(DEFAULT_AVATAR, 'Farmer');
    console.log('[PlayerAppearance] Avatar reset to default');
  },
  
  // Legacy compatibility (deprecated)
  get appearance() {
    const state = get();
    return {
      bodyColor: state.avatar.colors.primary,
      ringColor: state.avatar.colors.accent,
      name: state.name
    };
  },
  
  setAppearance: (newAppearance: Partial<PlayerAppearance>) => {
    const state = get();
    
    // Convert legacy appearance to new system
    const colorUpdates: Partial<AvatarColors> = {};
    if (newAppearance.bodyColor) {
      colorUpdates.primary = newAppearance.bodyColor;
    }
    if (newAppearance.ringColor) {
      colorUpdates.accent = newAppearance.ringColor;
    }
    
    const updatedAvatar = {
      ...state.avatar,
      colors: { ...state.avatar.colors, ...colorUpdates }
    };
    
    const updatedName = newAppearance.name || state.name;
    
    set({ 
      avatar: updatedAvatar,
      name: updatedName
    });
    
    saveAvatar(updatedAvatar, updatedName);
    console.log('[PlayerAppearance] Legacy appearance updated:', newAppearance);
  }
}));

// Save avatar data to localStorage
function saveAvatar(avatar: PlayerAvatar, name: string) {
  const saveData = { avatar, name, version: '2.0' };
  localStorage.setItem('pumpkin-farm-player-appearance', JSON.stringify(saveData));
}

// Migration and initialization
function initializeAvatar() {
  const savedData = localStorage.getItem('pumpkin-farm-player-appearance');
  
  if (!savedData) {
    // First time - grant free basic hair
    const updatedAvatar = {
      ...DEFAULT_AVATAR,
      ownedItemIds: ['hair_basic']
    };
    usePlayerAppearance.setState({ 
      avatar: updatedAvatar,
      name: 'Farmer'
    });
    saveAvatar(updatedAvatar, 'Farmer');
    console.log('[PlayerAppearance] First time setup with free basic hair');
    return;
  }
  
  try {
    const parsed = JSON.parse(savedData);
    
    // Check if this is legacy format (version 1.0)
    if (!parsed.version || parsed.bodyColor !== undefined) {
      console.log('[PlayerAppearance] Migrating from legacy format...');
      
      // Migrate legacy format to new system
      const migratedAvatar: PlayerAvatar = {
        colors: {
          skin: DEFAULT_AVATAR_COLORS.skin,
          hair: DEFAULT_AVATAR_COLORS.hair,
          primary: parsed.bodyColor || DEFAULT_AVATAR_COLORS.primary,
          accent: parsed.ringColor || DEFAULT_AVATAR_COLORS.accent
        },
        equipped: DEFAULT_AVATAR.equipped,
        ownedItemIds: ['hair_basic'] // Grant free basic hair
      };
      
      const migratedName = parsed.name || 'Farmer';
      
      usePlayerAppearance.setState({ 
        avatar: migratedAvatar,
        name: migratedName
      });
      saveAvatar(migratedAvatar, migratedName);
      console.log('[PlayerAppearance] Successfully migrated legacy appearance');
    } else {
      // Version 2.0 format - load directly
      usePlayerAppearance.setState({ 
        avatar: parsed.avatar || DEFAULT_AVATAR,
        name: parsed.name || 'Farmer'
      });
      console.log('[PlayerAppearance] Loaded saved avatar:', parsed);
    }
  } catch (error) {
    console.warn('[PlayerAppearance] Failed to load saved avatar, using default:', error);
    const defaultWithHair = {
      ...DEFAULT_AVATAR,
      ownedItemIds: ['hair_basic']
    };
    usePlayerAppearance.setState({ 
      avatar: defaultWithHair,
      name: 'Farmer'
    });
    saveAvatar(defaultWithHair, 'Farmer');
  }
}

// Initialize on import
initializeAvatar();