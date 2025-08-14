import { useTexture } from "@react-three/drei";
import FarmGrid from "./FarmGrid";
import * as THREE from "three";
import { Suspense } from "react";

function FarmTerrain() {
  const grassTexture = useTexture("/textures/grass.png");
  
  // Configure grass texture
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(8, 8);

  return (
    <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshLambertMaterial map={grassTexture} />
    </mesh>
  );
}

export default function Farm() {

  return (
    <group>
      {/* Farm terrain */}
      <Suspense fallback={
        <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshLambertMaterial color="#4ade80" />
        </mesh>
      }>
        <FarmTerrain />
      </Suspense>
      
      {/* Farm grid for planting */}
      <FarmGrid />
      
      {/* Farm boundaries */}
      <mesh position={[-10.1, 1, 0]}>
        <boxGeometry args={[0.2, 2, 20]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      <mesh position={[10.1, 1, 0]}>
        <boxGeometry args={[0.2, 2, 20]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 1, -10.1]}>
        <boxGeometry args={[20, 2, 0.2]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 1, 10.1]}>
        <boxGeometry args={[20, 2, 0.2]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
    </group>
  );
}