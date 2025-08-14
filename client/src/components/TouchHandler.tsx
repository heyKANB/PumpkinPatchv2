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

  const handlePointerDown = (event: PointerEvent | TouchEvent) => {
    event.preventDefault();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    touchStartTime.current = Date.now();
    touchStartPos.current = { x: clientX, y: clientY };
    isDragging.current = false;
    
    console.log('Touch started:', { x: clientX, y: clientY, isMobile });
  };

  const handlePointerMove = (event: PointerEvent | TouchEvent) => {
    if (!touchStartTime.current) return;
    
    event.preventDefault();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const deltaX = clientX - touchStartPos.current.x;
    const deltaY = clientY - touchStartPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 3) { // Very low threshold for iOS sensitivity
      isDragging.current = true;
      if (onTouchMove) {
        // More sensitive movement for iOS
        const normalizedX = Math.max(-1, Math.min(1, deltaX / 30));
        const normalizedY = Math.max(-1, Math.min(1, deltaY / 30));
        onTouchMove(normalizedX, normalizedY);
        console.log('Touch movement:', { deltaX, deltaY, normalizedX, normalizedY });
      }
    }
  };

  const handlePointerUp = (event: PointerEvent | TouchEvent) => {
    if (!touchStartTime.current) return;
    
    event.preventDefault();
    const clientX = 'changedTouches' in event ? event.changedTouches[0].clientX : event.clientX;
    const clientY = 'changedTouches' in event ? event.changedTouches[0].clientY : event.clientY;
    
    const touchDuration = Date.now() - touchStartTime.current;
    const deltaX = clientX - touchStartPos.current.x;
    const deltaY = clientY - touchStartPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    console.log('Touch ended:', { duration: touchDuration, distance, isDragging: isDragging.current });
    
    // If it was a short tap (not a drag), check for pumpkin harvesting
    if (touchDuration < 500 && distance < 20 && !isDragging.current) {
      const pointerEvent = {
        clientX,
        clientY
      } as PointerEvent;
      handleTap(pointerEvent);
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
      console.log('Setting up touch events for iOS, isMobile:', isMobile);
      
      // iOS-specific touch events for better compatibility
      canvas.addEventListener('touchstart', handlePointerDown as any, { passive: false });
      canvas.addEventListener('touchmove', handlePointerMove as any, { passive: false });
      canvas.addEventListener('touchend', handlePointerUp as any, { passive: false });
      canvas.addEventListener('touchcancel', handlePointerUp as any, { passive: false });
      
      // Fallback pointer events for non-touch devices
      canvas.addEventListener('pointerdown', handlePointerDown as any);
      canvas.addEventListener('pointermove', handlePointerMove as any);
      canvas.addEventListener('pointerup', handlePointerUp as any);
      canvas.addEventListener('pointercancel', handlePointerUp as any);
      
      // Prevent default touch behaviors on iOS
      canvas.style.touchAction = 'none';
      canvas.style.userSelect = 'none';
      (canvas.style as any).webkitUserSelect = 'none';
      (canvas.style as any).webkitTouchCallout = 'none';
      (canvas.style as any).webkitTapHighlightColor = 'transparent';
      
      // Additional iOS-specific styles
      canvas.setAttribute('touch-action', 'none');
      canvas.setAttribute('data-touch-listeners', 'true');
      
      console.log('Touch listeners configured for canvas');
    }
  });

  return null; // This component doesn't render anything visible
}