import React from 'react';
import { usePlayerAppearance } from '../lib/stores/usePlayerAppearance';
import { getItemById } from '../lib/avatar/catalog';
import { AvatarSlot } from '../lib/avatar/types';

interface AvatarRendererProps {
  // Optional position offset for the entire avatar
  position?: [number, number, number];
}

export default function AvatarRenderer({ position = [0, 0, 0] }: AvatarRendererProps) {
  const { avatar, name, getVisibleSlots } = usePlayerAppearance();
  const { colors, equipped } = avatar;

  // Get visible slots (slots not hidden by other equipped items)
  const visibleSlots = React.useMemo(() => getVisibleSlots(), [equipped]);

  // Render equipped items for visible slots
  const renderEquippedItem = React.useCallback((slot: AvatarSlot) => {
    const itemId = equipped[slot];
    
    if (!itemId || !visibleSlots.includes(slot)) {
      return null;
    }

    const item = getItemById(itemId);
    if (!item) {
      console.warn(`[AvatarRenderer] Item not found: ${itemId}`);
      return null;
    }

    // Apply position offset from the AvatarRenderer
    const itemPosition: [number, number, number] = [
      position[0] + item.attach.position[0],
      position[1] + item.attach.position[1],
      position[2] + item.attach.position[2]
    ];

    return (
      <group 
        key={`${slot}-${itemId}`}
        position={itemPosition}
        rotation={item.attach.rotation}
        scale={item.attach.scale}
      >
        {item.render({ colors })}
      </group>
    );
  }, [equipped, visibleSlots, position, colors]);

  return (
    <group position={position}>
      {/* Render base character body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.3, 1]} />
        <meshLambertMaterial color={colors.skin} />
      </mesh>

      {/* Character indicator ring */}
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1]} />
        <meshBasicMaterial color={colors.accent} transparent opacity={0.3} />
      </mesh>

      {/* Render all equipped cosmetic items */}
      {React.useMemo(() => 
        (Object.keys(equipped) as AvatarSlot[]).map(slot => renderEquippedItem(slot)),
        [equipped, renderEquippedItem]
      )}

      {/* Player name display (optional, for multiplayer or debugging) */}
      {name && name !== 'Farmer' && (
        <group position={[0, 2, 0]}>
          <mesh>
            <planeGeometry args={[2, 0.3]} />
            <meshBasicMaterial color="white" transparent opacity={0.8} />
          </mesh>
          {/* Text would need a text rendering solution - for now just a placeholder */}
        </group>
      )}
    </group>
  );
}

// Separate component for rendering avatar previews (used in UI)
interface AvatarPreviewProps {
  avatar: ReturnType<typeof usePlayerAppearance.getState>['avatar'];
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  showNameplate?: boolean;
}

export function AvatarPreview({ 
  avatar, 
  scale = 1, 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  showNameplate = false 
}: AvatarPreviewProps) {
  const { colors, equipped } = avatar;

  // Get items that should be visible in preview
  const getVisibleItemsForPreview = () => {
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
    
    return Object.entries(equipped).filter(([slot, itemId]) => 
      itemId && !hiddenSlots.has(slot as AvatarSlot)
    );
  };

  const visibleItems = getVisibleItemsForPreview();

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Base character */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.3, 1]} />
        <meshLambertMaterial color={colors.skin as any} />
      </mesh>

      {/* Character indicator ring */}
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1]} />
        <meshBasicMaterial color={colors.accent as any} transparent opacity={0.3} />
      </mesh>

      {/* Render equipped items */}
      {visibleItems.map(([slot, itemId]) => {
        const item = getItemById(itemId!);
        if (!item) return null;

        return (
          <group 
            key={`preview-${slot}-${itemId}`}
            position={item.attach.position}
            rotation={item.attach.rotation}
            scale={item.attach.scale}
          >
            {item.render({ colors })}
          </group>
        );
      })}
    </group>
  );
}