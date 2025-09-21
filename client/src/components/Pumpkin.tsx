import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useFarm, CropType, CropStage } from "../lib/stores/useFarm";
import { useAudio } from "../lib/stores/useAudio";
import * as THREE from "three";

interface PumpkinProps {
  cropType: CropType;
  stage: CropStage;
  position: [number, number, number];
  plantedTime: number;
  rowIndex: number;
  colIndex: number;
}

export default function Pumpkin({ cropType, stage, position, plantedTime, rowIndex, colIndex }: PumpkinProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { harvestCrop } = useFarm();
  const { playSuccess } = useAudio();
  const [hovered, setHovered] = useState(false);
  const [bobOffset] = useState(Math.random() * Math.PI * 2);

  // Gentle bobbing animation for mature crops
  useFrame((state) => {
    if (meshRef.current && stage === 'mature') {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + bobOffset) * 0.02;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (stage === 'mature') {
      harvestCrop(rowIndex, colIndex);
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
    if (cropType === 'corn') {
      switch (stage) {
        case 'seed': return '#8B4513';
        case 'sprout': return '#90EE90';
        case 'growing': return '#32CD32';
        case 'mature': return '#FFD700';
        default: return '#8B4513';
      }
    } else if (cropType === 'wheat') {
      switch (stage) {
        case 'seed': return '#8B4513';
        case 'sprout': return '#9ACD32';
        case 'growing': return '#DAA520';
        case 'mature': return '#F4A460';
        default: return '#8B4513';
      }
    } else {
      // Pumpkin colors
      switch (stage) {
        case 'seed': return '#8B4513';
        case 'sprout': return '#32CD32';
        case 'growing': return '#228B22';
        case 'mature': return '#FF8C00';
        default: return '#8B4513';
      }
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
        userData={{
          isCrop: true,
          cropType,
          stage,
          row: rowIndex,
          col: colIndex
        }}
      >
        {cropType === 'corn' ? (
          <cylinderGeometry args={stage === 'mature' ? [0.1, 0.3, 1.5, 8] : [0.05, 0.15, stage === 'growing' ? 0.8 : 0.4, 6]} />
        ) : cropType === 'wheat' ? (
          <cylinderGeometry args={stage === 'mature' ? [0.05, 0.12, 1.8, 6] : [0.02, 0.08, stage === 'growing' ? 1.2 : 0.3, 4]} />
        ) : (
          <sphereGeometry args={stage === 'mature' ? [0.5, 8, 6] : [0.3]} />
        )}
        <meshLambertMaterial 
          color={finalColor}
          transparent={isTransparent}
          opacity={opacity}
        />
      </mesh>
      
      {/* Stem for mature pumpkins only */}
      {stage === 'mature' && cropType === 'pumpkin' && (
        <mesh position={[position[0], position[1] + 0.5, position[2]]}>
          <cylinderGeometry args={[0.05, 0.08, 0.2]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
      )}
      
      {/* Wheat heads for mature wheat */}
      {stage === 'mature' && cropType === 'wheat' && (
        <mesh position={[position[0], position[1] + 1.0, position[2]]}>
          <boxGeometry args={[0.15, 0.3, 0.08]} />
          <meshLambertMaterial color="#DEB887" />
        </mesh>
      )}
      
      {/* Leaves for growing stages */}
      {(stage === 'sprout' || stage === 'growing') && cropType !== 'wheat' && (
        <mesh position={[position[0], position[1] + 0.3, position[2]]}>
          <cylinderGeometry args={[0.1, 0.1, 0.6]} />
          <meshLambertMaterial color="#32CD32" />
        </mesh>
      )}
      
      {/* Wheat blade leaves */}
      {(stage === 'sprout' || stage === 'growing') && cropType === 'wheat' && (
        <>
          <mesh position={[position[0] + 0.1, position[1] + 0.2, position[2]]}>
            <boxGeometry args={[0.02, stage === 'growing' ? 0.8 : 0.4, 0.01]} />
            <meshLambertMaterial color="#9ACD32" />
          </mesh>
          <mesh position={[position[0] - 0.1, position[1] + 0.25, position[2]]}>
            <boxGeometry args={[0.02, stage === 'growing' ? 0.7 : 0.35, 0.01]} />
            <meshLambertMaterial color="#9ACD32" />
          </mesh>
        </>
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
