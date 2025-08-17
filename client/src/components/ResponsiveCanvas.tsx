import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import FarmingGame from "./FarmingGame";
import { useDeviceInfo } from "../hooks/use-device-info";

interface ResponsiveCanvasProps {
  mobileMovement: { x: number; z: number };
  mobileInteract: boolean;
  onTouchMove: (deltaX: number, deltaY: number) => void;
  playerPosition: [number, number, number];
  onPlayerPositionChange: (position: [number, number, number]) => void;
  onShedEntry: () => void;
}

export default function ResponsiveCanvas({ 
  mobileMovement, 
  mobileInteract, 
  onTouchMove, 
  playerPosition, 
  onPlayerPositionChange, 
  onShedEntry 
}: ResponsiveCanvasProps) {
  const deviceInfo = useDeviceInfo();
  
  // Calculate optimal camera settings based on device
  const getCameraSettings = () => {
    if (deviceInfo.isIOS) {
      if (deviceInfo.isSmallScreen) {
        // iPhone (small screen)
        return {
          position: [0, 16, 20] as [number, number, number],
          fov: 85,
          near: 0.1,
          far: 1000
        };
      } else {
        // iPad or larger iOS device
        return {
          position: [0, 14, 17] as [number, number, number],
          fov: 75,
          near: 0.1,
          far: 1000
        };
      }
    } else if (deviceInfo.isAndroid) {
      return {
        position: [0, 12, 15] as [number, number, number],
        fov: 70,
        near: 0.1,
        far: 1000
      };
    } else {
      // Desktop
      return {
        position: [0, 10, 12] as [number, number, number],
        fov: 45,
        near: 0.1,
        far: 1000
      };
    }
  };

  const cameraSettings = getCameraSettings();
  const isMobile = deviceInfo.isMobile;

  return (
    <Canvas
      shadows={!isMobile}
      camera={cameraSettings}
      gl={{
        antialias: !isMobile,
        powerPreference: isMobile ? "low-power" : "default",
        alpha: false,
        stencil: false,
        depth: true
      }}
      dpr={deviceInfo.isIOS ? Math.min(deviceInfo.devicePixelRatio, 2) : (isMobile ? 1.5 : window.devicePixelRatio)}
      style={{
        display: 'block',
        width: '100%',
        height: '100%'
      }}
    >
      <color attach="background" args={["#87CEEB"]} />
      
      {/* Optimized lighting for mobile */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={isMobile ? 0.8 : 1}
        castShadow={!isMobile}
        shadow-mapSize-width={isMobile ? 512 : 2048}
        shadow-mapSize-height={isMobile ? 512 : 2048}
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
          onTouchMove={onTouchMove}
          playerPosition={playerPosition}
          onPlayerPositionChange={onPlayerPositionChange}
          onShedEntry={onShedEntry}
        />
      </Suspense>
    </Canvas>
  );
}