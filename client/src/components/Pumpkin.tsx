import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useFarm } from "../lib/stores/useFarm";
import { useAudio } from "../lib/stores/useAudio";
import * as THREE from "three";

export type PumpkinStage = 'seed' | 'sprout' | 'growing' | 'mature';

interface PumpkinProps {
  stage: PumpkinStage;
  position: [number, number, number];
  plantedTime: number;
  rowIndex: number;
  colIndex: number;
}

export default function Pumpkin({ stage, position, plantedTime, rowIndex, colIndex }: PumpkinProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { harvestPumpkin } = useFarm();
  const { playSuccess } = useAudio();
  const [hovered, setHovered] = useState(false);
  const [bobOffset] = useState(Math.random() * Math.PI * 2);

  // Gentle bobbing animation for mature pumpkins
  useFrame((state) => {
    if (meshRef.current && stage === 'mature') {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + bobOffset) * 0.02;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (stage === 'mature') {
      harvestPumpkin(rowIndex, colIndex);
      playSuccess();
    }
  };

  const getScale = (): [number, number, number] => {
    switch (stage) {
      case 'seed': return [0.1, 0.1, 0.1];
      case 'sprout': return [0.3, 0.4, 0.3];
      case 'growing': return [0.6, 0.7, 0.6];
      case 'mature': return [1, 0.8, 1];
      default: return [0.1, 0.1, 0.1];
    }
  };

  const getColor = () => {
    switch (stage) {
      case 'seed': return '#8B4513';
      case 'sprout': return '#32CD32';
      case 'growing': return '#228B22';
      case 'mature': return '#FF8C00';
      default: return '#8B4513';
    }
  };

  const finalColor = (hovered && stage === 'mature') ? '#FFA500' : getColor();
  const isTransparent = stage === 'seed';
  const opacity = isTransparent ? 0.8 : 1;

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        scale={getScale()}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={stage === 'mature' ? [0.5, 8, 6] : [0.3]} />
        <meshLambertMaterial 
          color={finalColor}
          transparent={isTransparent}
          opacity={opacity}
        />
      </mesh>
      
      {/* Stem for mature pumpkins */}
      {stage === 'mature' && (
        <mesh position={[position[0], position[1] + 0.5, position[2]]}>
          <cylinderGeometry args={[0.05, 0.08, 0.2]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
      )}
      
      {/* Leaves for growing stages */}
      {(stage === 'sprout' || stage === 'growing') && (
        <mesh position={[position[0], position[1] + 0.3, position[2]]}>
          <cylinderGeometry args={[0.1, 0.1, 0.6]} />
          <meshLambertMaterial color="#32CD32" />
        </mesh>
      )}
      
      {/* Harvest indicator for mature pumpkins */}
      {stage === 'mature' && hovered && (
        <mesh position={[position[0], position[1] + 1.2, position[2]]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
      )}
    </group>
  );
}
