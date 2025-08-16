import { useState, useEffect } from "react";
import Farm from "./Farm";
import PlayerController from "./PlayerController";
import TouchHandler from "./TouchHandler";
import { useFarm } from "../lib/stores/useFarm";
import { useEquipment } from "../lib/stores/useEquipment";
import { AppTrackingManager, GameTrackingEvents } from "../lib/tracking";
import FarmEquipment from "./FarmEquipment";
import MaintenanceMiniGame from "./MaintenanceMiniGame";
import EquipmentStatus from "./EquipmentStatus";

interface FarmingGameProps {
  mobileMovement?: { x: number; z: number };
  mobileInteract?: boolean;
  onTouchMove?: (deltaX: number, deltaY: number) => void;
}

export default function FarmingGame({ mobileMovement, mobileInteract, onTouchMove }: FarmingGameProps) {
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

  // Handle equipment interaction
  const handleEquipmentInteract = (equipmentItem: any) => {
    selectEquipment(equipmentItem);
    setMaintenanceGameActive(true);
  };

  // Handle maintenance completion
  const handleMaintenanceComplete = (newDurability: number) => {
    if (selectedEquipment) {
      repairEquipment(selectedEquipment.id, newDurability);
    }
  };

  // Handle maintenance close
  const handleMaintenanceClose = () => {
    selectEquipment(null);
    setMaintenanceGameActive(false);
  };

  return (
    <>
      <Farm />
      <PlayerController 
        mobileMovement={mobileMovement}
        mobileInteract={mobileInteract}
      />
      <TouchHandler onTouchMove={onTouchMove} />
      
      {/* Farm Equipment */}
      {equipment.map((item) => (
        <FarmEquipment
          key={item.id}
          position={item.position}
          durability={item.durability}
          type={item.type}
          onInteract={() => handleEquipmentInteract(item)}
        />
      ))}
      
      {/* Maintenance Mini-Game */}
      {maintenanceGameActive && selectedEquipment && (
        <MaintenanceMiniGame
          equipmentType={selectedEquipment.type}
          currentDurability={selectedEquipment.durability}
          onComplete={handleMaintenanceComplete}
          onClose={handleMaintenanceClose}
        />
      )}
    </>
  );
}
