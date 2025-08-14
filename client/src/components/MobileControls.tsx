import { useRef, useEffect, useState } from "react";
import { useFarm } from "../lib/stores/useFarm";
import { useAudio } from "../lib/stores/useAudio";
import { useIsMobile } from "../hooks/use-is-mobile";

interface MobileControlsProps {
  onMove: (direction: { x: number; z: number }) => void;
  onInteract: () => void;
  onDragMove: (targetX: number, targetZ: number) => void;
}

export default function MobileControls({ onMove, onInteract, onDragMove }: MobileControlsProps) {
  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouchPos, setLastTouchPos] = useState({ x: 0, y: 0 });
  const screenRef = useRef<HTMLDivElement>(null);
  const { playerInventory } = useFarm();

  if (!isMobile) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent interaction if touching the plant button area
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    // Check if touch is on the plant button (bottom right area)
    const buttonArea = {
      x: rect.width - 100,
      y: rect.height - 100,
      width: 100,
      height: 100
    };
    
    if (touchX >= buttonArea.x && touchY >= buttonArea.y) {
      return; // Don't start dragging if touching button area
    }
    
    console.log("Touch started at:", touch.clientX, touch.clientY);
    setLastTouchPos({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !screenRef.current) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const rect = screenRef.current.getBoundingClientRect();
    
    // Calculate movement delta from last position
    const deltaX = touch.clientX - lastTouchPos.x;
    const deltaY = touch.clientY - lastTouchPos.y;
    
    // Convert delta to movement direction (much simpler approach)
    const sensitivity = 0.1; // Increased sensitivity for better responsiveness
    const movementX = deltaX * sensitivity;
    const movementZ = deltaY * sensitivity; // Positive Y moves forward in 3D space
    
    console.log("Touch movement:", { deltaX, deltaY, movementX, movementZ });
    
    // Use continuous movement instead of target position
    onMove({ x: movementX, z: movementZ });
    
    setLastTouchPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    console.log("Touch ended");
    setIsDragging(false);
    // Stop any continuous movement
    onMove({ x: 0, z: 0 });
  };

  return (
    <>
      {/* Full-screen touch area for dragging */}
      <div
        ref={screenRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          touchAction: 'none',
        }}
      />
      
      {/* UI Overlay */}
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
        {/* Movement Instructions */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          maxWidth: '150px',
          textAlign: 'center',
        }}>
          👆 Drag to move farmer
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
    </>
  );
}