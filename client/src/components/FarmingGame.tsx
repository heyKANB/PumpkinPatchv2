import { useState, useEffect } from "react";
import Farm from "./Farm";
import PlayerController from "./PlayerController";
import TouchHandler from "./TouchHandler";
import { useFarm } from "../lib/stores/useFarm";
import { useEquipment } from "../lib/stores/useEquipment";
import { AppTrackingManager, GameTrackingEvents } from "../lib/tracking";
import EquipmentShed from "./EquipmentShed";
import EquipmentShedMenu from "./EquipmentShedMenu";
import MaintenanceMiniGame from "./MaintenanceMiniGame";
import FieldGate from "./FieldGate";

interface FarmingGameProps {
  mobileMovement?: { x: number; z: number };
  mobileInteract?: boolean;
  onTouchMove?: (deltaX: number, deltaY: number) => void;
  playerPosition?: [number, number, number];
  onPlayerPositionChange?: (position: [number, number, number]) => void;
  onShedEntry?: () => void;
  onGateEntry?: () => void;
}

export default function FarmingGame({ 
  mobileMovement, 
  mobileInteract, 
  onTouchMove, 
  playerPosition = [0, 0, 0], 
  onPlayerPositionChange, 
  onShedEntry,
  onGateEntry
}: FarmingGameProps) {
  const { initializeFarm, updateGrowth } = useFarm();
  const { 
    equipment, 
    selectedEquipment, 
    maintenanceGameActive, 
    initializeEquipment, 
    selectEquipment, 
    repairEquipment, 
    degradeEquipment, 
    setMaintenanceGameActive 
  } = useEquipment();
  const [gameStarted, setGameStarted] = useState(false);
  const [shedMenuOpen, setShedMenuOpen] = useState(false);
  const [currentPlayerPosition, setCurrentPlayerPosition] = useState<[number, number, number]>([0, 0, 0]);

  // Initialize the farm and equipment when the game starts
  useEffect(() => {
    initializeFarm();
    initializeEquipment();
    setGameStarted(true);
    
    // Track game start event
    AppTrackingManager.logTrackingEvent(GameTrackingEvents.GAME_STARTED, {
      timestamp: new Date().toISOString(),
      platform: 'ios'
    });
  }, [initializeFarm, initializeEquipment]);

  // Growth update and equipment degradation timer
  useEffect(() => {
    if (!gameStarted) return;

    const growthInterval = setInterval(() => {
      updateGrowth();
      degradeEquipment(); // Degrade equipment over time
    }, 2000); // Update every 2 seconds

    return () => clearInterval(growthInterval);
  }, [gameStarted, updateGrowth, degradeEquipment]);

  if (!gameStarted) return null;

  // Handle shed entry
  const handleShedEntry = () => {
    console.log('Player entered equipment shed');
    setShedMenuOpen(true);
    if (onShedEntry) onShedEntry();
  };

  // Handle equipment selection from shed menu
  const handleEquipmentSelect = (equipmentItem: any) => {
    console.log('Equipment selected from shed:', equipmentItem);
    selectEquipment(equipmentItem);
    setShedMenuOpen(false);
    setMaintenanceGameActive(true);
  };

  // Handle maintenance completion
  const handleMaintenanceComplete = (newDurability: number) => {
    if (selectedEquipment) {
      console.log(`Calling repairEquipment with ID: ${selectedEquipment.id}, newDurability: ${newDurability}`);
      repairEquipment(selectedEquipment.id, newDurability);
    }
  };

  // Handle maintenance close
  const handleMaintenanceClose = () => {
    selectEquipment(null);
    setMaintenanceGameActive(false);
  };

  // Handle shed menu close
  const handleShedMenuClose = () => {
    setShedMenuOpen(false);
  };

  // Gate entry handler
  const handleGateEntry = () => {
    if (onGateEntry) {
      onGateEntry();
    }
  };

  return (
    <>
      <Farm />
      <PlayerController 
        mobileMovement={mobileMovement}
        mobileInteract={mobileInteract}
        onPositionChange={(pos) => {
          setCurrentPlayerPosition(pos);
          if (onPlayerPositionChange) onPlayerPositionChange(pos);
        }}
      />
      <TouchHandler onTouchMove={onTouchMove} />
      
      {/* Equipment Shed in top left corner */}
      <EquipmentShed 
        position={[-8, 0, -8]} 
        onEnter={handleShedEntry}
        playerPosition={currentPlayerPosition}
      />

      {/* Field Gate in back middle */}
      <FieldGate
        position={[0, 0, -10]}
        onEnter={handleGateEntry}
        playerPosition={currentPlayerPosition}
      />
      

      
      {/* Debug logging */}
      {selectedEquipment && console.log('Selected equipment:', selectedEquipment)}
    </>
  );
}
