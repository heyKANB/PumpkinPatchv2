import { create } from 'zustand';

export interface PlayerAppearance {
  bodyColor: string;
  ringColor: string;
  name: string;
}

interface PlayerAppearanceState {
  appearance: PlayerAppearance;
  setAppearance: (appearance: Partial<PlayerAppearance>) => void;
  resetToDefault: () => void;
}

const DEFAULT_APPEARANCE: PlayerAppearance = {
  bodyColor: '#4A90E2',
  ringColor: '#4A90E2',
  name: 'Farmer'
};

// Predefined appearance options
export const AVATAR_COLORS = [
  { name: 'Blue', body: '#4A90E2', ring: '#4A90E2' },
  { name: 'Green', body: '#4CAF50', ring: '#4CAF50' },
  { name: 'Orange', body: '#FF8C00', ring: '#FF8C00' },
  { name: 'Purple', body: '#9C27B0', ring: '#9C27B0' },
  { name: 'Red', body: '#F44336', ring: '#F44336' },
  { name: 'Pink', body: '#E91E63', ring: '#E91E63' },
  { name: 'Teal', body: '#009688', ring: '#009688' },
  { name: 'Brown', body: '#8D6E63', ring: '#8D6E63' },
  { name: 'Yellow', body: '#FFC107', ring: '#FFC107' },
  { name: 'Indigo', body: '#3F51B5', ring: '#3F51B5' }
];

export const usePlayerAppearance = create<PlayerAppearanceState>((set, get) => ({
  appearance: DEFAULT_APPEARANCE,
  
  setAppearance: (newAppearance: Partial<PlayerAppearance>) => {
    const currentAppearance = get().appearance;
    const updatedAppearance = { ...currentAppearance, ...newAppearance };
    set({ appearance: updatedAppearance });
    
    // Save to localStorage
    localStorage.setItem('pumpkin-farm-player-appearance', JSON.stringify(updatedAppearance));
    console.log('[PlayerAppearance] Appearance updated:', updatedAppearance);
  },
  
  resetToDefault: () => {
    set({ appearance: DEFAULT_APPEARANCE });
    localStorage.setItem('pumpkin-farm-player-appearance', JSON.stringify(DEFAULT_APPEARANCE));
    console.log('[PlayerAppearance] Appearance reset to default');
  },
}));

// Load saved appearance on initialization
const savedAppearance = localStorage.getItem('pumpkin-farm-player-appearance');
if (savedAppearance) {
  try {
    const parsed = JSON.parse(savedAppearance);
    usePlayerAppearance.setState({ appearance: { ...DEFAULT_APPEARANCE, ...parsed } });
    console.log('[PlayerAppearance] Loaded saved appearance:', parsed);
  } catch (error) {
    console.warn('[PlayerAppearance] Failed to load saved appearance, using default');
  }
}