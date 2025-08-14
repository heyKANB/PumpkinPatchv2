import { useRef, useEffect, useState } from "react";
import { useFarm } from "../lib/stores/useFarm";
import { useAudio } from "../lib/stores/useAudio";
import { useIsMobile } from "../hooks/use-is-mobile";

interface MobileControlsProps {
  onMove: (direction: { x: number; z: number }) => void;
  onInteract: () => void;
}

export default function MobileControls({ onMove, onInteract }: MobileControlsProps) {
  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const joystickRef = useRef<HTMLDivElement>(null);
  const { playerInventory } = useFarm();

  if (!isMobile) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Normalize movement
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 50; // Maximum drag distance
    
    if (distance > 0) {
      const normalizedX = Math.max(-1, Math.min(1, deltaX / maxDistance));
      const normalizedZ = Math.max(-1, Math.min(1, deltaY / maxDistance));
      
      onMove({ x: normalizedX, z: normalizedZ });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    onMove({ x: 0, z: 0 }); // Stop movement
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '0',
      right: '0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      padding: '0 20px',
      pointerEvents: 'none',
      zIndex: 1001,
    }}>
      {/* Virtual Joystick */}
      <div
        ref={joystickRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          border: '3px solid rgba(255, 255, 255, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      >
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          transform: isDragging ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 0.1s',
        }} />
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