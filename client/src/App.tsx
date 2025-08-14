import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";
import ResponsiveCanvas from "./components/ResponsiveCanvas";
import GameUI from "./components/GameUI";
import MobileControls from "./components/MobileControls";
import MobileDebugInfo from "./components/MobileDebugInfo";
import { useIsMobile } from "./hooks/use-is-mobile";
import { useDeviceInfo } from "./hooks/use-device-info";

// Define control keys for the farming game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "interact", keys: ["KeyE", "Space"] },
];

// Main App component
function App() {
  const [showCanvas, setShowCanvas] = useState(false);
  const [mobileMovement, setMobileMovement] = useState({ x: 0, z: 0 });
  const [mobileInteract, setMobileInteract] = useState(false);
  const { setHitSound, setSuccessSound } = useAudio();
  const isMobile = useIsMobile();
  const deviceInfo = useDeviceInfo();

  // Initialize audio on component mount
  useEffect(() => {
    // Load sound effects
    const hitAudio = new Audio('/sounds/hit.mp3');
    const successAudio = new Audio('/sounds/success.mp3');
    
    hitAudio.preload = 'auto';
    successAudio.preload = 'auto';
    
    setHitSound(hitAudio);
    setSuccessSound(successAudio);
    
    setShowCanvas(true);
  }, [setHitSound, setSuccessSound]);

  const handleMobileMove = (direction: { x: number; z: number }) => {
    setMobileMovement(direction);
  };

  const handleMobileInteract = () => {
    setMobileInteract(true);
    // Reset interaction after a short delay
    setTimeout(() => setMobileInteract(false), 100);
  };

  const handleDragMove = (targetX: number, targetZ: number) => {
    // For now, we'll use this as a placeholder since MobileControls expects it
    // The actual movement is handled through handleMobileMove
  };

  const handleTouchMove = (deltaX: number, deltaY: number) => {
    // Handle touch movement for player movement with smooth continuous motion
    setMobileMovement({ x: deltaX, z: deltaY });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <>
          <KeyboardControls map={controls}>
            <ResponsiveCanvas
              mobileMovement={mobileMovement}
              mobileInteract={mobileInteract}
              onTouchMove={handleTouchMove}
            />
          </KeyboardControls>
          
          {/* Game UI overlay - rendered outside Canvas */}
          <GameUI />
          
          {/* Mobile Controls - only shown on mobile */}
          {isMobile && (
            <MobileControls 
              onMove={handleMobileMove}
              onInteract={handleMobileInteract}
              onDragMove={handleDragMove}
            />
          )}
          
          {/* Debug info for development */}
          <MobileDebugInfo />
        </>
      )}
    </div>
  );
}

export default App;
