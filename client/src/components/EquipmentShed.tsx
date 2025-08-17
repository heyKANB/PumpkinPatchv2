import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EquipmentShedProps {
  position: [number, number, number];
  onEnter: () => void;
  playerPosition: [number, number, number];
}

export default function EquipmentShed({ position, onEnter, playerPosition }: EquipmentShedProps) {
  const shedRef = useRef<THREE.Group>(null);
  const [isPlayerNear, setIsPlayerNear] = useState(false);
  
  // Check if player is near the shed door
  useFrame(() => {
    if (shedRef.current) {
      const distance = Math.sqrt(
        Math.pow(playerPosition[0] - position[0], 2) + 
        Math.pow(playerPosition[2] - position[2], 2)
      );
      
      const nearDistance = 2.5;
      const wasNear = isPlayerNear;
      const isNear = distance < nearDistance;
      
      if (isNear !== wasNear) {
        setIsPlayerNear(isNear);
        if (isNear) {
          // Auto-trigger shed entry when player gets close
          setTimeout(() => {
            if (distance < nearDistance) {
              onEnter();
            }
          }, 500); // Small delay to prevent accidental triggers
        }
      }
    }
  });

  return (
    <group ref={shedRef} position={position}>
      {/* Shed Building */}
      <group>
        {/* Main Structure */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[4, 3, 3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Roof */}
        <mesh position={[0, 3.2, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[3, 1.5, 4]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        
        {/* Door Frame */}
        <mesh position={[0, 0.8, 1.6]}>
          <boxGeometry args={[1.2, 1.8, 0.1]} />
          <meshStandardMaterial color="#4A4A4A" />
        </mesh>
        
        {/* Door */}
        <mesh position={[0, 0.8, 1.65]}>
          <boxGeometry args={[1, 1.6, 0.05]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Door Handle */}
        <mesh position={[0.3, 0.8, 1.7]}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        
        {/* Windows */}
        <mesh position={[-1, 1.8, 1.6]}>
          <boxGeometry args={[0.6, 0.6, 0.05]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
        </mesh>
        <mesh position={[1, 1.8, 1.6]}>
          <boxGeometry args={[0.6, 0.6, 0.05]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
        </mesh>
      </group>
      
      {/* Entrance Trigger Area (invisible) */}
      <mesh 
        position={[0, 0.5, 2.5]} 
        visible={false}
        onClick={() => onEnter()}
      >
        <boxGeometry args={[3, 2, 2]} />
      </mesh>
      
      {/* Sign */}
      <group position={[0, 0.3, 2.8]}>
        <mesh>
          <boxGeometry args={[2, 0.8, 0.1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Sign post */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
      
      {/* Proximity indicator */}
      {isPlayerNear && (
        <group position={[0, 4, 0]}>
          <mesh>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial 
              color="#FFD700" 
              emissive="#FFD700" 
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}