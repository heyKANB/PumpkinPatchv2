import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";
import ResponsiveCanvas from "./components/ResponsiveCanvas";
import GameUI from "./components/GameUI";
import MobileControls from "./components/MobileControls";
import MobileDebugInfo from "./components/MobileDebugInfo";
import EquipmentShedMenu from "./components/EquipmentShedMenu";
import MaintenanceMiniGame from "./components/MaintenanceMiniGame";
import { useEquipment } from "./lib/stores/useEquipment";
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
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [shedMenuOpen, setShedMenuOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [maintenanceGameActive, setMaintenanceGameActive] = useState(false);
  const { setHitSound, setSuccessSound } = useAudio();
  const { selectEquipment, repairEquipment } = useEquipment();
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

  // Equipment shed handlers
  const handleShedEntry = () => {
    setShedMenuOpen(true);
  };

  const handleEquipmentSelect = (equipmentItem: any) => {
    setSelectedEquipment(equipmentItem);
    selectEquipment(equipmentItem);
    setShedMenuOpen(false);
    setMaintenanceGameActive(true);
  };

  const handleMaintenanceComplete = (newDurability: number) => {
    if (selectedEquipment) {
      repairEquipment(selectedEquipment.id, newDurability);
    }
    setMaintenanceGameActive(false);
    setSelectedEquipment(null);
  };

  const handleMaintenanceClose = () => {
    setMaintenanceGameActive(false);
    setSelectedEquipment(null);
  };

  const handleShedMenuClose = () => {
    setShedMenuOpen(false);
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      // Use full viewport height on mobile, accounting for browser UI
      minHeight: isMobile ? '100vh' : 'auto'
    }}>
      {showCanvas && (
        <>
          <KeyboardControls map={controls}>
            <ResponsiveCanvas
              mobileMovement={mobileMovement}
              mobileInteract={mobileInteract}
              onTouchMove={handleTouchMove}
              playerPosition={playerPosition}
              onPlayerPositionChange={setPlayerPosition}
              onShedEntry={handleShedEntry}
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
          
          {/* Equipment Shed Menu */}
          {shedMenuOpen && (
            <EquipmentShedMenu
              onClose={handleShedMenuClose}
              onSelectEquipment={handleEquipmentSelect}
            />
          )}
          
          {/* Maintenance Mini-Game */}
          {maintenanceGameActive && selectedEquipment && (
            <MaintenanceMiniGame
              equipment={selectedEquipment}
              onComplete={handleMaintenanceComplete}
              onClose={handleMaintenanceClose}
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
