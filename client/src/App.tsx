import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";
import FarmingGame from "./components/FarmingGame";
import GameUI from "./components/GameUI";
import MobileControls from "./components/MobileControls";
import { useIsMobile } from "./hooks/use-is-mobile";

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

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <>
          <KeyboardControls map={controls}>
            <Canvas
              shadows={!isMobile} // Disable shadows on mobile for performance
              camera={{
                position: [0, isMobile ? 8 : 10, isMobile ? 10 : 12],
                fov: isMobile ? 60 : 45, // Wider FOV for mobile
                near: 0.1,
                far: 1000
              }}
              gl={{
                antialias: !isMobile, // Disable antialiasing on mobile for performance
                powerPreference: isMobile ? "low-power" : "default"
              }}
              dpr={isMobile ? 1 : window.devicePixelRatio} // Limit pixel ratio on mobile
            >
              <color attach="background" args={["#87CEEB"]} />
              
              {/* Lighting setup */}
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={50}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
              />

              <Suspense fallback={null}>
                <FarmingGame 
                  mobileMovement={mobileMovement}
                  mobileInteract={mobileInteract}
                />
              </Suspense>
            </Canvas>
          </KeyboardControls>
          
          {/* Game UI overlay - rendered outside Canvas */}
          <GameUI />
          
          {/* Mobile Controls - only shown on mobile */}
          {isMobile && (
            <MobileControls 
              onMove={handleMobileMove}
              onInteract={handleMobileInteract}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
