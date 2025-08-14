import FarmGrid from "./FarmGrid";
import * as THREE from "three";
import { Suspense } from "react";

// Fallback terrain without texture for reliability
function FarmTerrain() {
  return (
    <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshLambertMaterial color="#4ade80" />
    </mesh>
  );
}

export default function Farm() {

  return (
    <group>
      {/* Farm terrain */}
      <FarmTerrain />
      
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