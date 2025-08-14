import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useFarm } from "../lib/stores/useFarm";
import { useAudio } from "../lib/stores/useAudio";
import { FARM_SIZE } from "../lib/constants";
import * as THREE from "three";

export default function PlayerController() {
  const playerRef = useRef<THREE.Mesh>(null);
  const [, getKeys] = useKeyboardControls();
  const { plantPumpkin, playerInventory } = useFarm();
  const { playHit } = useAudio();

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const { forward, backward, leftward, rightward, interact } = getKeys();
    const speed = 5;
    
    // Movement
    const direction = new THREE.Vector3();
    if (forward) direction.z -= 1;
    if (backward) direction.z += 1;
    if (leftward) direction.x -= 1;
    if (rightward) direction.x += 1;
    
    direction.normalize();
    direction.multiplyScalar(speed * delta);
    
    playerRef.current.position.add(direction);
    
    // Keep player within farm boundaries
    const bounds = 9;
    playerRef.current.position.x = Math.max(-bounds, Math.min(bounds, playerRef.current.position.x));
    playerRef.current.position.z = Math.max(-bounds, Math.min(bounds, playerRef.current.position.z));
    
    // Planting interaction
    if (interact && playerInventory.seeds > 0) {
      const playerPos = playerRef.current.position;
      const gridX = Math.round((playerPos.x + FARM_SIZE) / 2);
      const gridZ = Math.round((playerPos.z + FARM_SIZE) / 2);
      
      // Check if position is within farm grid
      if (gridX >= 0 && gridX < FARM_SIZE && gridZ >= 0 && gridZ < FARM_SIZE) {
        const success = plantPumpkin(gridZ, gridX);
        if (success) {
          playHit(); // Use hit sound for planting
        }
      }
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