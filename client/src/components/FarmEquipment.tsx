import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface FarmEquipmentProps {
  position: [number, number, number];
  onInteract: () => void;
  durability: number; // 0-100
  type: 'tractor' | 'watering_can' | 'hoe';
}

export default function FarmEquipment({ position, onInteract, durability, type }: FarmEquipmentProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animate equipment based on durability
  useFrame((state) => {
    if (meshRef.current) {
      // Slight wobble for low durability equipment
      if (durability < 30) {
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.02;
      }
    }
  });

  // Get equipment color based on durability
  const getEquipmentColor = () => {
    if (durability > 70) return '#4CAF50'; // Green - good condition
    if (durability > 40) return '#FF9800'; // Orange - needs attention
    return '#F44336'; // Red - critical condition
  };

  // Get equipment geometry based on type
  const getEquipmentGeometry = () => {
    switch (type) {
      case 'tractor':
        return (
          <group>
            {/* Main body */}
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[2, 1, 1.2]} />
              <meshStandardMaterial color={getEquipmentColor()} />
            </mesh>
            {/* Front wheels */}
            <mesh position={[0.8, 0, 0.7]}>
              <cylinderGeometry args={[0.3, 0.3, 0.2]} />
              <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[0.8, 0, -0.7]}>
              <cylinderGeometry args={[0.3, 0.3, 0.2]} />
              <meshStandardMaterial color="#333" />
            </mesh>
            {/* Back wheels */}
            <mesh position={[-0.8, 0, 0.7]}>
              <cylinderGeometry args={[0.4, 0.4, 0.2]} />
              <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[-0.8, 0, -0.7]}>
              <cylinderGeometry args={[0.4, 0.4, 0.2]} />
              <meshStandardMaterial color="#333" />
            </mesh>
          </group>
        );
      case 'watering_can':
        return (
          <group>
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.3, 0.2, 0.6]} />
              <meshStandardMaterial color={getEquipmentColor()} />
            </mesh>
            {/* Handle */}
            <mesh position={[0.3, 0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
              <cylinderGeometry args={[0.05, 0.05, 0.4]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Spout */}
            <mesh position={[0, 0.1, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.3]} />
              <meshStandardMaterial color={getEquipmentColor()} />
            </mesh>
          </group>
        );
      case 'hoe':
        return (
          <group>
            {/* Handle */}
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 1.2]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Blade */}
            <mesh position={[0, 1, 0.1]} rotation={[Math.PI / 4, 0, 0]}>
              <boxGeometry args={[0.3, 0.1, 0.2]} />
              <meshStandardMaterial color={getEquipmentColor()} />
            </mesh>
          </group>
        );
    }
  };

  return (
    <group position={position}>
      {/* Large visible collision mesh for debugging */}
      <mesh
        position={[0, 1, 0]}
        visible={true}
        material-transparent={true}
        material-opacity={0.2}
        material-color="red"
        onClick={(e) => {
          e.stopPropagation();
          console.log('Equipment clicked:', type);
          onInteract();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial transparent opacity={0.2} color="red" />
      </mesh>
      
      {/* Visual equipment mesh */}
      <group ref={meshRef}>
        {getEquipmentGeometry()}
      </group>
      
      {/* Durability indicator - simplified without Text for now */}
      {(hovered || durability < 50) && (
        <group position={[0, 2, 0]}>
          <mesh>
            <boxGeometry args={[2, 0.5, 0.1]} />
            <meshStandardMaterial 
              color={durability < 30 ? '#F44336' : durability < 70 ? '#FF9800' : '#4CAF50'} 
            />
          </mesh>
        </group>
      )}
    </group>
  );
}