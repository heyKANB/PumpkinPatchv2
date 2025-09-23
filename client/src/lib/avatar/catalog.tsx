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
  ),

  // Additional Hair Styles
  buzzCut: ({ colors }: { colors: AvatarColors }) => (
    <mesh position={[0, 0.85, 0]}>
      <sphereGeometry args={[0.35, 8, 6]} />
      <meshLambertMaterial color={colors.hair} />
    </mesh>
  ),

  ponytail: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0, 0.9, 0]}>
      <mesh>
        <sphereGeometry args={[0.4, 8, 6]} />
        <meshLambertMaterial color={colors.hair} />
      </mesh>
      {/* Ponytail */}
      <mesh position={[0, -0.1, -0.4]}>
        <cylinderGeometry args={[0.15, 0.08, 0.6, 8]} />
        <meshLambertMaterial color={colors.hair} />
      </mesh>
    </group>
  ),

  mohawk: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0, 0.9, 0]}>
      <mesh>
        <sphereGeometry args={[0.35, 8, 6]} />
        <meshLambertMaterial color={colors.hair} />
      </mesh>
      {/* Mohawk spike */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.15, 0.8, 8]} />
        <meshLambertMaterial color={colors.hair} />
      </mesh>
    </group>
  ),

  // Additional Hats
  beret: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0, 1.0, 0]}>
      <mesh>
        <sphereGeometry args={[0.45, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshLambertMaterial color={colors.primary} />
      </mesh>
      <mesh position={[0.2, 0.1, 0]}>
        <sphereGeometry args={[0.05]} />
        <meshLambertMaterial color={colors.accent} />
      </mesh>
    </group>
  ),

  topHat: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0, 1.2, 0]}>
      {/* Hat crown */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 8]} />
        <meshLambertMaterial color={colors.primary} />
      </mesh>
      {/* Hat brim */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 12]} />
        <meshLambertMaterial color={colors.primary} />
      </mesh>
    </group>
  ),

  helmet: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0, 0.95, 0]}>
      <mesh>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshLambertMaterial color={colors.primary} />
      </mesh>
      {/* Visor */}
      <mesh position={[0, 0, 0.4]}>
        <boxGeometry args={[0.6, 0.15, 0.05]} />
        <meshLambertMaterial color={colors.accent} />
      </mesh>
    </group>
  ),

  // Additional Bandanas
  neckBandana: ({ colors }: { colors: AvatarColors }) => (
    <mesh position={[0, 0.2, 0.2]}>
      <boxGeometry args={[0.4, 0.15, 0.05]} />
      <meshLambertMaterial color={colors.primary} />
    </mesh>
  ),

  faceMask: ({ colors }: { colors: AvatarColors }) => (
    <mesh position={[0, 0.5, 0.35]}>
      <boxGeometry args={[0.3, 0.2, 0.05]} />
      <meshLambertMaterial color={colors.primary} />
    </mesh>
  ),

  // Additional Torso Items
  tuxedo: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0, 0, 0]}>
      <mesh>
        <boxGeometry args={[0.8, 1.2, 0.6]} />
        <meshLambertMaterial color={colors.primary} />
      </mesh>
      {/* Bow tie */}
      <mesh position={[0, 0.4, 0.3]}>
        <boxGeometry args={[0.15, 0.08, 0.05]} />
        <meshLambertMaterial color={colors.accent} />
      </mesh>
    </group>
  ),

  apron: ({ colors }: { colors: AvatarColors }) => (
    <mesh position={[0, -0.1, 0.32]}>
      <boxGeometry args={[0.7, 1.0, 0.05]} />
      <meshLambertMaterial color={colors.primary} />
    </mesh>
  ),

  flannel: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0, 0, 0]}>
      <mesh>
        <boxGeometry args={[0.9, 1.3, 0.65]} />
        <meshLambertMaterial color={colors.primary} />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 0.5, 0.32]}>
        <boxGeometry args={[0.4, 0.2, 0.05]} />
        <meshLambertMaterial color={colors.accent} />
      </mesh>
    </group>
  ),

  // Additional Face Accessories
  monocle: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0.1, 0.65, 0.3]}>
      <mesh>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 8]} />
        <meshLambertMaterial color="#E5E7EB" transparent opacity={0.3} />
      </mesh>
      {/* Frame */}
      <mesh>
        <torusGeometry args={[0.08, 0.01, 6, 12]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
    </group>
  ),

  eyePatch: ({ colors }: { colors: AvatarColors }) => (
    <mesh position={[-0.12, 0.65, 0.3]}>
      <cylinderGeometry args={[0.1, 0.1, 0.02, 8]} />
      <meshLambertMaterial color={colors.primary} />
    </mesh>
  ),

  // Additional Handheld Items
  shovel: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0.6, 0, 0]} rotation={[0, 0, -0.3]}>
      {/* Handle */}
      <mesh>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      {/* Shovel blade */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.2, 0.3, 0.05]} />
        <meshLambertMaterial color="#9CA3AF" />
      </mesh>
    </group>
  ),

  wateringCan: ({ colors }: { colors: AvatarColors }) => (
    <group position={[0.5, -0.2, 0]}>
      {/* Can body */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.18, 0.3, 8]} />
        <meshLambertMaterial color={colors.primary} />
      </mesh>
      {/* Spout */}
      <mesh position={[0.2, 0.1, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.02, 0.03, 0.25, 6]} />
        <meshLambertMaterial color={colors.primary} />
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
  },
  {
    id: 'handheld_shovel',
    name: 'Garden Shovel',
    slot: 'handheld',
    priceCoins: 120,
    rarity: 'common',
    description: 'Perfect for digging and planting',
    tintable: false,
    render: ItemRenderers.shovel,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },
  {
    id: 'handheld_watering_can',
    name: 'Watering Can',
    slot: 'handheld',
    priceCoins: 90,
    rarity: 'common',
    description: 'Keep your crops hydrated',
    tintable: true,
    render: ItemRenderers.wateringCan,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },

  // === ADDITIONAL HAIR STYLES ===
  {
    id: 'hair_buzz_cut',
    name: 'Buzz Cut',
    slot: 'hair',
    priceCoins: 50,
    rarity: 'common',
    description: 'Short and practical',
    tintable: true,
    render: ItemRenderers.buzzCut,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },
  {
    id: 'hair_ponytail',
    name: 'Ponytail',
    slot: 'hair',
    priceCoins: 85,
    rarity: 'common',
    description: 'Tied back and ready for work',
    tintable: true,
    render: ItemRenderers.ponytail,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },
  {
    id: 'hair_mohawk',
    name: 'Mohawk',
    slot: 'hair',
    priceCoins: 180,
    rarity: 'rare',
    description: 'Bold and rebellious style',
    tintable: true,
    render: ItemRenderers.mohawk,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },

  // === ADDITIONAL HATS ===
  {
    id: 'hat_beret',
    name: 'Beret',
    slot: 'hat',
    priceCoins: 110,
    rarity: 'common',
    description: 'Sophisticated French style',
    tintable: true,
    render: ItemRenderers.beret,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
    hides: ['hair']
  },
  {
    id: 'hat_top_hat',
    name: 'Top Hat',
    slot: 'hat',
    priceCoins: 250,
    rarity: 'epic',
    description: 'Elegant formal headwear',
    tintable: true,
    render: ItemRenderers.topHat,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
    hides: ['hair']
  },
  {
    id: 'hat_helmet',
    name: 'Safety Helmet',
    slot: 'hat',
    priceCoins: 160,
    rarity: 'rare',
    description: 'Protection for hard work',
    tintable: true,
    render: ItemRenderers.helmet,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
    hides: ['hair']
  },

  // === ADDITIONAL BANDANAS ===
  {
    id: 'bandana_neck',
    name: 'Neck Bandana',
    slot: 'bandana',
    priceCoins: 45,
    rarity: 'common',
    description: 'Classic cowboy accessory',
    tintable: true,
    render: ItemRenderers.neckBandana,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },
  {
    id: 'bandana_face_mask',
    name: 'Face Mask',
    slot: 'bandana',
    priceCoins: 75,
    rarity: 'common',
    description: 'Stay protected while farming',
    tintable: true,
    render: ItemRenderers.faceMask,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },

  // === ADDITIONAL TORSO CLOTHING ===
  {
    id: 'torso_tuxedo',
    name: 'Formal Tuxedo',
    slot: 'torso',
    priceCoins: 400,
    rarity: 'epic',
    description: 'Dressed to impress',
    tintable: true,
    render: ItemRenderers.tuxedo,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },
  {
    id: 'torso_apron',
    name: 'Farm Apron',
    slot: 'torso',
    priceCoins: 80,
    rarity: 'common',
    description: 'Keep your clothes clean',
    tintable: true,
    render: ItemRenderers.apron,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },
  {
    id: 'torso_flannel',
    name: 'Flannel Shirt',
    slot: 'torso',
    priceCoins: 140,
    rarity: 'common',
    description: 'Cozy and comfortable',
    tintable: true,
    render: ItemRenderers.flannel,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },

  // === ADDITIONAL FACE ACCESSORIES ===
  {
    id: 'face_monocle',
    name: 'Monocle',
    slot: 'faceAccessory',
    priceCoins: 200,
    rarity: 'rare',
    description: 'Distinguished eyewear',
    tintable: false,
    render: ItemRenderers.monocle,
    attach: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  },
  {
    id: 'face_eye_patch',
    name: 'Eye Patch',
    slot: 'faceAccessory',
    priceCoins: 150,
    rarity: 'rare',
    description: 'Arrr, matey!',
    tintable: true,
    render: ItemRenderers.eyePatch,
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