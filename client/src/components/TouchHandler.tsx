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
    if (!isMobile) return;
    
    const deltaX = event.clientX - touchStartPos.current.x;
    const deltaY = event.clientY - touchStartPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 10) { // Threshold for dragging
      isDragging.current = true;
      if (onTouchMove) {
        onTouchMove(deltaX * 0.01, deltaY * 0.01);
      }
      touchStartPos.current = { x: event.clientX, y: event.clientY };
    }
  };

  const handlePointerUp = (event: PointerEvent) => {
    const touchDuration = Date.now() - touchStartTime.current;
    const deltaX = event.clientX - touchStartPos.current.x;
    const deltaY = event.clientY - touchStartPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // If it was a short tap (not a drag), check for pumpkin harvesting
    if (touchDuration < 500 && distance < 20 && !isDragging.current) {
      handleTap(event);
    }
    
    isDragging.current = false;
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

  // Set up event listeners
  useFrame(() => {
    const canvas = gl.domElement;
    
    // Remove existing listeners
    canvas.removeEventListener('pointerdown', handlePointerDown);
    canvas.removeEventListener('pointermove', handlePointerMove);
    canvas.removeEventListener('pointerup', handlePointerUp);
    
    // Add fresh listeners
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
  });

  return null; // This component doesn't render anything visible
}