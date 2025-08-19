import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { Route, Router } from "wouter";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";
import ResponsiveCanvas from "./components/ResponsiveCanvas";
import GameUI from "./components/GameUI";
import MobileControls from "./components/MobileControls";
import MobileDebugInfo from "./components/MobileDebugInfo";
import EquipmentShedMenu from "./components/EquipmentShedMenu";
import MaintenanceMiniGame from "./components/MaintenanceMiniGame";
import LocationMenu from "./components/LocationMenu";
import CoinCounter from "./components/CoinCounter";
import SaveIndicator from "./components/SaveIndicator";
import XPBar from "./components/XPBar";
import XPGainNotifications from "./components/XPGainNotification";
import LevelUpNotification from "./components/LevelUpNotification";
import { useEquipment } from "./lib/stores/useEquipment";
import { useXP } from "./lib/stores/useXP";
import { SaveSystem } from "./lib/saveSystem";
import SupportPage from "./pages/support";
import PrivacyPage from "./pages/privacy";
import TermsPage from "./pages/terms";
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
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  // Use equipment store state instead of local state
  const [maintenanceGameActive, setMaintenanceGameActive] = useState(false);
  const { setHitSound, setSuccessSound } = useAudio();
  const { equipment, selectedEquipment: storeSelectedEquipment, selectEquipment, repairEquipment } = useEquipment();
  const { level, recentGains } = useXP();
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);

  // Listen for level ups
  useEffect(() => {
    const unsubscribe = useXP.subscribe(
      (state) => state.level,
      (level: number) => {
        if (level > 1 && level > useXP.getState().level) {
          setShowLevelUp(level);
        }
      }
    );

    return unsubscribe;
  }, []);
  const isMobile = useIsMobile();
  const deviceInfo = useDeviceInfo();

  // Initialize audio and save system on component mount
  useEffect(() => {
    // Load sound effects
    const hitAudio = new Audio('/sounds/hit.mp3');
    const successAudio = new Audio('/sounds/success.mp3');
    
    hitAudio.preload = 'auto';
    successAudio.preload = 'auto';
    
    setHitSound(hitAudio);
    setSuccessSound(successAudio);

    // Initialize save system and load previous progress
    const saveData = SaveSystem.load();
    if (saveData) {
      console.log('Restoring previous game progress...');
      SaveSystem.restore(saveData);
    }

    // Start auto-save system
    SaveSystem.autoSave();
    
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
    console.log(`[App] Equipment selected:`, equipmentItem);
    selectEquipment(equipmentItem);
    setShedMenuOpen(false);
    setMaintenanceGameActive(true);
  };

  const handleMaintenanceComplete = (newDurability: number) => {
    if (storeSelectedEquipment) {
      console.log(`[App] Maintenance completed for ${storeSelectedEquipment.type} (${storeSelectedEquipment.id}): ${storeSelectedEquipment.durability}% -> ${newDurability}%`);
      repairEquipment(storeSelectedEquipment.id, newDurability);
    } else {
      console.log('[App] No selected equipment for maintenance completion');
    }
    setMaintenanceGameActive(false);
  };

  const handleMaintenanceClose = () => {
    setMaintenanceGameActive(false);
    selectEquipment(null);
  };

  const handleShedMenuClose = () => {
    setShedMenuOpen(false);
  };

  // Gate handlers
  const handleGateEntry = () => {
    setLocationMenuOpen(true);
  };

  const handleLocationSelect = (location: string) => {
    console.log(`Location selected: ${location}`);
    if (location === 'field') {
      setLocationMenuOpen(false);
      // Player is already in the field, just close menu
    } else if (location === 'marketplace' || location === 'kitchen') {
      // These are locked for now, do nothing
      console.log(`${location} is locked for future updates`);
    }
  };

  const handleLocationMenuClose = () => {
    setLocationMenuOpen(false);
  };

  return (
    <Router>
      <Route path="/support">
        <SupportPage />
      </Route>
      <Route path="/privacy">
        <PrivacyPage />
      </Route>
      <Route path="/terms">
        <TermsPage />
      </Route>
      <Route path="/">
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
              onGateEntry={handleGateEntry}
            />
          </KeyboardControls>
          
          {/* Game UI overlay - rendered outside Canvas */}
          <GameUI />
          
          {/* Coin Counter */}
          <CoinCounter />
          
          {/* XP Bar */}
          <XPBar />
          
          {/* XP Gain Notifications */}
          <XPGainNotifications />
          
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
          {maintenanceGameActive && storeSelectedEquipment && (
            <MaintenanceMiniGame
              equipment={storeSelectedEquipment}
              onComplete={handleMaintenanceComplete}
              onClose={handleMaintenanceClose}
            />
          )}

          {/* Location Menu */}
          <LocationMenu
            isOpen={locationMenuOpen}
            onClose={handleLocationMenuClose}
            onSelectLocation={handleLocationSelect}
          />
          
          {/* Save Indicator */}
          <SaveIndicator />
          
          {/* Level Up Notification */}
          {showLevelUp && (
            <LevelUpNotification 
              level={showLevelUp}
              onComplete={() => setShowLevelUp(null)}
            />
          )}
          
          {/* Debug info for development */}
          <MobileDebugInfo />
        </>
      )}
        </div>
      </Route>
    </Router>
  );
}

export default App;
