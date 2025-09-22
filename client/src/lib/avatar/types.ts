import { ReactNode } from 'react';

// Avatar slot types - where items can be equipped
export type AvatarSlot = 
  | 'hair' 
  | 'hat' 
  | 'bandana' 
  | 'torso' 
  | 'legs' 
  | 'faceAccessory' 
  | 'back' 
  | 'handheld';

// Item rarity levels
export type ItemRarity = 'common' | 'rare' | 'epic';

// Color palette for free customization
export interface AvatarColors {
  skin: string;
  hair: string;
  primary: string;  // Main clothing color
  accent: string;   // Secondary/accent color
}

// Transform data for positioning items on the character
export interface AttachTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

// Individual cosmetic item definition
export interface AvatarItem {
  id: string;
  name: string;
  slot: AvatarSlot;
  priceCoins: number;
  unlockLevel?: number;
  rarity: ItemRarity;
  seasonalTag?: string;
  tintable?: boolean; // Can be colored with player's color palette
  description: string;
  // Rendering function that returns a React Three Fiber component
  render: (props: { colors: AvatarColors }) => ReactNode;
  // Transform for positioning on the character
  attach: AttachTransform;
  // Slots that this item hides when equipped (e.g., hat hides hair)
  hides?: AvatarSlot[];
  // Items this conflicts with (can't be worn together)
  conflictsWith?: string[];
}

// Player's complete avatar configuration
export interface PlayerAvatar {
  colors: AvatarColors;
  equipped: Record<AvatarSlot, string | null>;
  ownedItemIds: string[];
}

// Default avatar state
export const DEFAULT_AVATAR_COLORS: AvatarColors = {
  skin: '#FDBCB4',
  hair: '#8B4513',
  primary: '#4A90E2',
  accent: '#7B68EE'
};

export const DEFAULT_AVATAR: PlayerAvatar = {
  colors: DEFAULT_AVATAR_COLORS,
  equipped: {
    hair: null,
    hat: null,
    bandana: null,
    torso: null,
    legs: null,
    faceAccessory: null,
    back: null,
    handheld: null
  },
  ownedItemIds: []
};

// Helper function to get rarity color
export function getRarityColor(rarity: ItemRarity): string {
  switch (rarity) {
    case 'common': return '#9CA3AF';
    case 'rare': return '#3B82F6';
    case 'epic': return '#8B5CF6';
    default: return '#9CA3AF';
  }
}

// Helper function to get rarity display name
export function getRarityName(rarity: ItemRarity): string {
  switch (rarity) {
    case 'common': return 'Common';
    case 'rare': return 'Rare';
    case 'epic': return 'Epic';
    default: return 'Common';
  }
}