import * as THREE from 'three';
import { AvatarItem, AvatarColors } from './types';

// Procedural cosmetic item renderers using React Three Fiber primitives
const ItemRenderers = {
  // HAIR STYLES
  basicHair: ({ colors }: { colors: AvatarColors }) => (
    <mesh position={[0, 0.9, 0]}>
      <sphereGeometry args={[0.45, 8, 6]} />
      <meshLambertMaterial color={colors.hair} />
    </mesh>
  ),

  spikeyHair: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0, 0.9, 0]}>
      <mesh>
        <sphereGeometry args={[0.4, 8, 6]} />
        <meshLambertMaterial color={colors.hair} />
      </mesh>
      {/* Spiky bits */}
      <mesh position={[0.2, 0.2, 0.1]}>
        <coneGeometry args={[0.08, 0.3, 4]} />
        <meshLambertMaterial color={colors.hair} />
      </mesh>
      <mesh position={[-0.15, 0.25, 0.2]}>
        <coneGeometry args={[0.06, 0.25, 4]} />
        <meshLambertMaterial color={colors.hair} />
      </mesh>
      <mesh position={[0.1, 0.3, -0.2]}>
        <coneGeometry args={[0.07, 0.2, 4]} />
        <meshLambertMaterial color={colors.hair} />
      </mesh>
    </group>
  ),

  longHair: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0, 0.8, 0]}>
      <mesh>
        <sphereGeometry args={[0.4, 8, 6]} />
        <meshLambertMaterial color={colors.hair} />
      </mesh>
      {/* Long hair flowing down */}
      <mesh position={[0, -0.3, -0.2]}>
        <cylinderGeometry args={[0.25, 0.35, 0.8, 8]} />
        <meshLambertMaterial color={colors.hair} />
      </mesh>
    </group>
  ),

  // HATS
  cowboyHat: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0, 1.1, 0]}>
      {/* Hat crown */}
      <mesh>
        <cylinderGeometry args={[0.25, 0.3, 0.4, 8]} />
        <meshLambertMaterial color={colors.primary} />
      </mesh>
      {/* Hat brim */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.05, 12]} />
        <meshLambertMaterial color={colors.primary} />
      </mesh>
      {/* Hat band */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.08, 8]} />
        <meshLambertMaterial color={colors.accent} />
      </mesh>
    </group>
  ),

  baseballCap: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0, 1.0, 0]}>
      {/* Cap crown */}
      <mesh>
        <sphereGeometry args={[0.4, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        <meshLambertMaterial color={colors.primary} />
      </mesh>
      {/* Visor */}
      <mesh position={[0, 0, 0.4]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.05, 8]} />
        <meshLambertMaterial color={colors.primary} />
      </mesh>
    </group>
  ),

  witchHat: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0, 1.2, 0]}>
      {/* Hat cone */}
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.3, 1.2, 8]} />
        <meshLambertMaterial color="#2D1B69" />
      </mesh>
      {/* Hat brim */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 12]} />
        <meshLambertMaterial color="#2D1B69" />
      </mesh>
    </group>
  ),

  // BANDANAS
  headBandana: ({ colors }: { colors: AvatarColors }) => (
    <mesh position={[0, 0.8, 0]} rotation={[0, 0, 0]}>
      <torusGeometry args={[0.4, 0.08, 8, 16]} />
      <meshLambertMaterial color={colors.accent} />
    </mesh>
  ),

  // TORSO CLOTHING
  cowboyVest: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0, 0, 0]}>
      {/* Vest body */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.4, 0.8, 8]} />
        <meshLambertMaterial color={colors.primary} />
      </mesh>
      {/* Vest fringe */}
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.42, 0.35, 0.1, 8]} />
        <meshLambertMaterial color={colors.accent} />
      </mesh>
    </group>
  ),

  ghostSheet: ({ colors }: { colors: AvatarColors }) => (
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[0.45, 0.5, 1.2, 8]} />
      <meshLambertMaterial color="#F8F9FA" transparent opacity={0.9} />
    </mesh>
  ),

  lederhosen: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0, 0, 0]}>
      {/* Lederhosen base */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.4, 0.6, 8]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      {/* Suspenders */}
      <mesh position={[0.15, 0.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
      <mesh position={[-0.15, 0.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
    </group>
  ),

  // FACE ACCESSORIES
  sunglasses: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0, 0.65, 0.3]}>
      {/* Left lens */}
      <mesh position={[-0.15, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.02, 8]} />
        <meshLambertMaterial color="#1F2937" />
      </mesh>
      {/* Right lens */}
      <mesh position={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.02, 8]} />
        <meshLambertMaterial color="#1F2937" />
      </mesh>
      {/* Bridge */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 6]} />
        <meshLambertMaterial color="#4B5563" />
      </mesh>
    </group>
  ),

  // HANDHELD ITEMS
  farmingHoe: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0.6, 0, 0]} rotation={[0, 0, -0.3]}>
      {/* Handle */}
      <mesh>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      {/* Hoe blade */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.3, 0.05, 0.1]} />
        <meshLambertMaterial color="#9CA3AF" />
      </mesh>
    </group>
  )
};

// Avatar item catalog - all available cosmetic items
export const AVATAR_CATALOG: AvatarItem[] = [
  // === HAIR STYLES ===
  {
    id: 'hair_basic',
    name: 'Basic Hair',
    slot: 'hair',
    priceCoins: 0, // Free starter
    rarity: 'common',
    description: 'Simple rounded hair style',
    tintable: true,
    render: ItemRenderers.basicHair,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },
  {
    id: 'hair_spiky',
    name: 'Spiky Hair',
    slot: 'hair',
    priceCoins: 75,
    rarity: 'common',
    description: 'Edgy spikes for a bold look',
    tintable: true,
    render: ItemRenderers.spikeyHair,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },
  {
    id: 'hair_long',
    name: 'Long Hair',
    slot: 'hair',
    priceCoins: 100,
    rarity: 'rare',
    description: 'Flowing long hair',
    tintable: true,
    render: ItemRenderers.longHair,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },

  // === HATS ===
  {
    id: 'hat_cowboy',
    name: 'Cowboy Hat',
    slot: 'hat',
    priceCoins: 150,
    rarity: 'rare',
    description: 'Yeehaw! Perfect for the ranch',
    tintable: true,
    render: ItemRenderers.cowboyHat,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
    hides: ['hair']
  },
  {
    id: 'hat_baseball',
    name: 'Baseball Cap',
    slot: 'hat',
    priceCoins: 80,
    rarity: 'common',
    description: 'Classic sports cap',
    tintable: true,
    render: ItemRenderers.baseballCap,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
    hides: ['hair']
  },
  {
    id: 'hat_witch',
    name: 'Witch Hat',
    slot: 'hat',
    priceCoins: 300,
    rarity: 'epic',
    seasonalTag: 'halloween',
    description: 'Spellbinding Halloween headwear',
    tintable: false,
    render: ItemRenderers.witchHat,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
    hides: ['hair']
  },

  // === BANDANAS ===
  {
    id: 'bandana_head',
    name: 'Head Bandana',
    slot: 'bandana',
    priceCoins: 60,
    rarity: 'common',
    description: 'Stylish headband',
    tintable: true,
    render: ItemRenderers.headBandana,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },

  // === TORSO CLOTHING ===
  {
    id: 'torso_cowboy_vest',
    name: 'Cowboy Vest',
    slot: 'torso',
    priceCoins: 200,
    rarity: 'rare',
    description: 'Authentic western vest with fringe',
    tintable: true,
    render: ItemRenderers.cowboyVest,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },
  {
    id: 'torso_ghost_sheet',
    name: 'Ghost Sheet',
    slot: 'torso',
    priceCoins: 250,
    rarity: 'epic',
    seasonalTag: 'halloween',
    description: 'Spooky ghost costume',
    tintable: false,
    render: ItemRenderers.ghostSheet,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },
  {
    id: 'torso_lederhosen',
    name: 'Lederhosen',
    slot: 'torso',
    priceCoins: 350,
    rarity: 'epic',
    description: 'Traditional German leather outfit',
    tintable: false,
    render: ItemRenderers.lederhosen,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },

  // === FACE ACCESSORIES ===
  {
    id: 'face_sunglasses',
    name: 'Cool Sunglasses',
    slot: 'faceAccessory',
    priceCoins: 120,
    rarity: 'rare',
    description: 'Stay cool in the farm sun',
    tintable: false,
    render: ItemRenderers.sunglasses,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },

  // === HANDHELD ITEMS ===
  {
    id: 'handheld_hoe',
    name: 'Farming Hoe',
    slot: 'handheld',
    priceCoins: 100,
    rarity: 'common',
    description: 'Essential farming tool',
    tintable: false,
    render: ItemRenderers.farmingHoe,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  }
];

// Helper functions for catalog management
export function getItemById(id: string): AvatarItem | undefined {
  return AVATAR_CATALOG.find(item => item.id === id);
}

export function getItemsBySlot(slot: string): AvatarItem[] {
  return AVATAR_CATALOG.filter(item => item.slot === slot);
}

export function getItemsByRarity(rarity: string): AvatarItem[] {
  return AVATAR_CATALOG.filter(item => item.rarity === rarity);
}

export function getSeasonalItems(season?: string): AvatarItem[] {
  if (!season) return AVATAR_CATALOG.filter(item => !item.seasonalTag);
  return AVATAR_CATALOG.filter(item => item.seasonalTag === season);
}

export function getAffordableItems(coins: number): AvatarItem[] {
  return AVATAR_CATALOG.filter(item => item.priceCoins <= coins);
}