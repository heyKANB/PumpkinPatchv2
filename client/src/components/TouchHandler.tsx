import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useFarm } from "../lib/stores/useFarm";
import { useAudio } from "../lib/stores/useAudio";
import { useIsMobile } from "../hooks/use-is-mobile";
import * as THREE from "three";

interface TouchHandlerProps {
  onTouchMove?: (deltaX: number, deltaY: number) => void;
}

export default function TouchHandler({ onTouchMove }: TouchHandlerProps) {
  const { camera, scene, gl } = useThree();
  const { farmGrid, harvestPumpkin } = useFarm();
  const { playSuccess } = useAudio();
  const isMobile = useIsMobile();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const touchStartTime = useRef(0);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handlePointerDown = (event: PointerEvent) => {
    touchStartTime.current = Date.now();
    touchStartPos.current = { x: event.clientX, y: event.clientY };
    isDragging.current = false;
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!isMobile || !touchStartTime.current) return;
    
    const deltaX = event.clientX - touchStartPos.current.x;
    const deltaY = event.clientY - touchStartPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 5) { // Lower threshold for more responsive dragging
      isDragging.current = true;
      if (onTouchMove) {
        // Normalize the movement for smooth continuous motion
        const normalizedX = Math.max(-1, Math.min(1, deltaX / 50));
        const normalizedY = Math.max(-1, Math.min(1, deltaY / 50));
        onTouchMove(normalizedX, normalizedY);
      }
      // Don't update touchStartPos to maintain relative movement
    }
  };

  const handlePointerUp = (event: PointerEvent) => {
    if (!touchStartTime.current) return;
    
    const touchDuration = Date.now() - touchStartTime.current;
    const deltaX = event.clientX - touchStartPos.current.x;
    const deltaY = event.clientY - touchStartPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // If it was a short tap (not a drag), check for pumpkin harvesting
    if (touchDuration < 500 && distance < 20 && !isDragging.current) {
      handleTap(event);
    }
    
    // Reset movement when touch ends
    if (onTouchMove) {
      onTouchMove(0, 0);
    }
    
    isDragging.current = false;
    touchStartTime.current = 0;
  };

  const handleTap = (event: PointerEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert to normalized device coordinates (-1 to +1)
    mouse.current.x = (x / rect.width) * 2 - 1;
    mouse.current.y = -(y / rect.height) * 2 + 1;

    // Update the raycaster
    raycaster.current.setFromCamera(mouse.current, camera);

    // Find intersections with pumpkin meshes
    const intersects = raycaster.current.intersectObjects(scene.children, true);
    
    for (const intersect of intersects) {
      const object = intersect.object;
      
      // Check if this is a pumpkin mesh (look for specific userData or naming)
      if (object.userData?.isPumpkin && object.userData?.stage === 'mature') {
        const row = object.userData.row;
        const col = object.userData.col;
        
        // Harvesting pumpkin
        const success = harvestPumpkin(row, col);
        if (success) {
          playSuccess();
        }
        break;
      }
    }
  };

  // Set up event listeners once
  useFrame(() => {
    const canvas = gl.domElement;
    
    // Only add listeners if they don't exist
    if (!canvas.hasAttribute('data-touch-listeners')) {
      canvas.addEventListener('pointerdown', handlePointerDown);
      canvas.addEventListener('pointermove', handlePointerMove);
      canvas.addEventListener('pointerup', handlePointerUp);
      canvas.setAttribute('data-touch-listeners', 'true');
    }
  });

  return null; // This component doesn't render anything visible
}