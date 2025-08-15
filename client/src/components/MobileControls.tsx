import { useFarm } from "../lib/stores/useFarm";
import { useIsMobile } from "../hooks/use-is-mobile";

interface MobileControlsProps {
  onMove: (direction: { x: number; z: number }) => void;
  onInteract: () => void;
  onDragMove: (targetX: number, targetZ: number) => void;
}

export default function MobileControls({ onMove, onInteract, onDragMove }: MobileControlsProps) {
  const isMobile = useIsMobile();
  const { playerInventory } = useFarm();

  if (!isMobile) return null;

  return (
    <div 
      className="safe-area-bottom safe-area-left safe-area-right"
      style={{
        position: 'absolute',
        bottom: '10px',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '0 20px',
        pointerEvents: 'none',
        zIndex: 1001,
      }}>
      {/* Movement Instructions */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
        maxWidth: '200px',
        textAlign: 'center',
      }}>
        👆 Drag to move • Tap orange pumpkins to harvest
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
      }}>
        {/* Plant/Interact Button */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onInteract();
          }}
          disabled={playerInventory.seeds <= 0}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: playerInventory.seeds > 0 ? 'rgba(76, 175, 80, 0.9)' : 'rgba(128, 128, 128, 0.5)',
            border: '3px solid rgba(255, 255, 255, 0.8)',
            color: 'white',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
            touchAction: 'manipulation',
            cursor: 'pointer',
          }}
        >
          🌱
        </button>
        
        {/* Seeds Counter */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
        }}>
          {playerInventory.seeds}
        </div>
      </div>
    </div>
  );
}