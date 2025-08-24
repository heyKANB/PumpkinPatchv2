import { useFarm } from "../lib/stores/useFarm";
import { FARM_SIZE } from "../lib/constants";
import Crop from "./Pumpkin"; // Renamed component

export default function FarmGrid() {
  const { farmGrid } = useFarm();

  return (
    <group>
      {farmGrid.map((row, rowIndex) =>
        row.map((plot, colIndex) => {
          const x = (colIndex - FARM_SIZE / 2 + 0.5) * 2;
          const z = (rowIndex - FARM_SIZE / 2 + 0.5) * 2;

          return (
            <group key={`${rowIndex}-${colIndex}`} position={[x, 0, z]}>
              {/* Plot marker - visible when empty */}
              {!plot.crop && (
                <mesh position={[0, 0.01, 0]}>
                  <circleGeometry args={[0.8]} />
                  <meshBasicMaterial 
                    color="#8B4513" 
                    transparent 
                    opacity={0.3}
                  />
                </mesh>
              )}
              
              {/* Crop if planted */}
              {plot.crop && (
                <Crop
                  cropType={plot.crop.type}
                  stage={plot.crop.stage}
                  position={[0, 0.1, 0]}
                  plantedTime={plot.crop.plantedTime}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                />
              )}
            </group>
          );
        })
      )}
    </group>
  );
}