import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FieldGateProps {
  position: [number, number, number];
  onEnter: () => void;
  playerPosition: [number, number, number];
}

export default function FieldGate({ position, onEnter, playerPosition }: FieldGateProps) {
  const gateRef = useRef<THREE.Group>(null);
  const [isPlayerNear, setIsPlayerNear] = useState(false);
  
  // Check if player is near the gate
  useFrame(() => {
    if (gateRef.current) {
      const distance = Math.sqrt(
        Math.pow(playerPosition[0] - position[0], 2) + 
        Math.pow(playerPosition[2] - position[2], 2)
      );
      
      const nearDistance = 2.0;
      const wasNear = isPlayerNear;
      const isNear = distance < nearDistance;
      
      if (isNear !== wasNear) {
        setIsPlayerNear(isNear);
        if (isNear) {
          // Auto-trigger gate entry when player gets close
          setTimeout(() => {
            if (distance < nearDistance) {
              onEnter();
            }
          }, 300);
        }
      }
    }
  });

  return (
    <group ref={gateRef} position={position}>
      {/* Gate Posts */}
      <mesh position={[-1.5, 1.5, 0]}>
        <boxGeometry args={[0.3, 3, 0.3]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      <mesh position={[1.5, 1.5, 0]}>
        <boxGeometry args={[0.3, 3, 0.3]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Top Crossbeam */}
      <mesh position={[0, 2.8, 0]}>
        <boxGeometry args={[3.6, 0.2, 0.3]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Gate Sign */}
      <mesh position={[0, 2.2, 0.2]}>
        <boxGeometry args={[2, 0.8, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      {/* Gate Opening Area - invisible trigger zone */}
      <mesh position={[0, 1, 0]} visible={false}>
        <boxGeometry args={[3, 2, 1]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      
      {/* Glow effect when player is near */}
      {isPlayerNear && (
        <pointLight
          position={[0, 2.5, 0]}
          color="#FFD700"
          intensity={0.8}
          distance={6}
        />
      )}
    </group>
  );
}