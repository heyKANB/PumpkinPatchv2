import { useState } from "react";
import { useFarm } from "../lib/stores/useFarm";
import { useIsMobile } from "../hooks/use-is-mobile";
import { HelpCircle, X } from "lucide-react";

interface MobileControlsProps {
  onMove: (direction: { x: number; z: number }) => void;
  onInteract: () => void;
  onDragMove: (targetX: number, targetZ: number) => void;
}

export default function MobileControls({ onMove, onInteract, onDragMove }: MobileControlsProps) {
  const isMobile = useIsMobile();
  const { playerInventory } = useFarm();
  const [showInstructions, setShowInstructions] = useState(false);

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
      {/* Help Button */}
      <button
        onClick={() => setShowInstructions(!showInstructions)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          cursor: 'pointer',
        }}
      >
        <HelpCircle size={20} />
      </button>

      {/* Instructions Overlay */}
      {showInstructions && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
        }}>
          <div style={{
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            maxWidth: '300px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}>
            <button
              onClick={() => setShowInstructions(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
            
            <h3 style={{ margin: '0 0 15px 0', color: '#4CAF50' }}>How to Play</h3>
            
            <div style={{ textAlign: 'left', lineHeight: '1.6' }}>
              <p><strong>🚶‍♂️ Movement:</strong><br />Drag anywhere on the screen to move your farmer</p>
              
              <p><strong>🌱 Planting:</strong><br />Stand near empty dirt plots and tap the green button to plant seeds</p>
              
              <p><strong>🎃 Harvesting:</strong><br />Tap orange mature pumpkins to harvest them</p>
              
              <p><strong>🔧 Equipment:</strong><br />Visit the shed to repair broken tools</p>
              
              <p><strong>🚪 Travel:</strong><br />Use the gate to access future locations</p>
            </div>
            
            <button
              onClick={() => setShowInstructions(false)}
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

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
            backgroundColor: playerInventory.seeds[playerInventory.selectedCropType] > 0 ? 'rgba(76, 175, 80, 0.9)' : 'rgba(128, 128, 128, 0.5)',
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
          {playerInventory.seeds[playerInventory.selectedCropType]}
        </div>
      </div>
    </div>
  );
}