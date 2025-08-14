import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useFarm } from "../lib/stores/useFarm";
import { useAudio } from "../lib/stores/useAudio";
import { FARM_SIZE } from "../lib/constants";
import * as THREE from "three";

interface PlayerControllerProps {
  mobileMovement?: { x: number; z: number };
  mobileInteract?: boolean;
  dragTarget?: { x: number; z: number } | null;
}

export default function PlayerController({ mobileMovement, mobileInteract, dragTarget }: PlayerControllerProps) {
  const playerRef = useRef<THREE.Mesh>(null);
  const [, getKeys] = useKeyboardControls();
  const { plantPumpkin, playerInventory } = useFarm();
  const { playHit } = useAudio();
  const [lastInteractTime, setLastInteractTime] = useState(0);

  const handlePlanting = () => {
    if (!playerRef.current || playerInventory.seeds <= 0) return;

    const now = Date.now();
    if (now - lastInteractTime < 500) return; // Prevent spam clicking
    
    const playerPos = playerRef.current.position;
    const gridX = Math.round((playerPos.x + FARM_SIZE) / 2);
    const gridZ = Math.round((playerPos.z + FARM_SIZE) / 2);
    
    // Check if position is within farm grid
    if (gridX >= 0 && gridX < FARM_SIZE && gridZ >= 0 && gridZ < FARM_SIZE) {
      const success = plantPumpkin(gridZ, gridX);
      if (success) {
        playHit();
        setLastInteractTime(now);
      }
    }
  };

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const { forward, backward, leftward, rightward, interact } = getKeys();
    const speed = 5;
    
    // Movement - handle drag target or directional movement
    if (dragTarget) {
      // Smooth movement toward drag target
      const currentPos = playerRef.current.position;
      const targetPos = new THREE.Vector3(dragTarget.x, currentPos.y, dragTarget.z);
      
      // Calculate direction to target
      const direction = targetPos.clone().sub(currentPos);
      const distance = direction.length();
      
      // Only move if we're far enough from target
      if (distance > 0.5) {
        direction.normalize();
        direction.multiplyScalar(Math.min(distance * 8, speed) * delta); // Smooth approach
        playerRef.current.position.add(direction);
      }
    } else {
      // Traditional movement - combine keyboard and mobile controls
      const direction = new THREE.Vector3();
      
      // Keyboard controls
      if (forward) direction.z -= 1;
      if (backward) direction.z += 1;
      if (leftward) direction.x -= 1;
      if (rightward) direction.x += 1;
      
      // Mobile controls (when not dragging)
      if (mobileMovement) {
        direction.x += mobileMovement.x;
        direction.z += mobileMovement.z;
      }
      
      if (direction.length() > 0) {
        direction.normalize();
        direction.multiplyScalar(speed * delta);
        playerRef.current.position.add(direction);
      }
    }
    
    // Keep player within farm boundaries
    const bounds = 9;
    playerRef.current.position.x = Math.max(-bounds, Math.min(bounds, playerRef.current.position.x));
    playerRef.current.position.z = Math.max(-bounds, Math.min(bounds, playerRef.current.position.z));
    
    // Planting interaction - keyboard or mobile
    if ((interact || mobileInteract) && playerInventory.seeds > 0) {
      handlePlanting();
    }
    
    // Update camera to follow player
    state.camera.position.lerp(
      new THREE.Vector3(
        playerRef.current.position.x,
        10,
        playerRef.current.position.z + 12
      ),
      0.05
    );
    state.camera.lookAt(playerRef.current.position);
  });

  return (
    <mesh ref={playerRef} position={[0, 0.5, 0]} castShadow>
      <capsuleGeometry args={[0.3, 1]} />
      <meshLambertMaterial color="#4A90E2" />
      
      {/* Player indicator ring */}
      <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1]} />
        <meshBasicMaterial color="#4A90E2" transparent opacity={0.3} />
      </mesh>
    </mesh>
  );
}