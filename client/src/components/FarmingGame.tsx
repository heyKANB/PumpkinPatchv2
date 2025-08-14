import { useState, useEffect } from "react";
import Farm from "./Farm";
import PlayerController from "./PlayerController";
import { useFarm } from "../lib/stores/useFarm";

interface FarmingGameProps {
  mobileMovement?: { x: number; z: number };
  mobileInteract?: boolean;
}

export default function FarmingGame({ mobileMovement, mobileInteract }: FarmingGameProps) {
  const { initializeFarm, updateGrowth } = useFarm();
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize the farm when the game starts
  useEffect(() => {
    initializeFarm();
    setGameStarted(true);
  }, [initializeFarm]);

  // Growth update timer
  useEffect(() => {
    if (!gameStarted) return;

    const growthInterval = setInterval(() => {
      updateGrowth();
    }, 2000); // Update growth every 2 seconds

    return () => clearInterval(growthInterval);
  }, [gameStarted, updateGrowth]);

  if (!gameStarted) return null;

  return (
    <>
      <Farm />
      <PlayerController 
        mobileMovement={mobileMovement}
        mobileInteract={mobileInteract}
      />
    </>
  );
}
