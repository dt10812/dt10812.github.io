import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export const Environment = () => {
  return (
    <group>
      {/* Ground plane */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#8BC34A" />
      </mesh>
      
      {/* Decorative elements */}
      <EnvironmentDecorations />
    </group>
  );
};

const EnvironmentDecorations = () => {
  const grassTexture = useTexture("/textures/grass.png");
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(5, 5);
  
  return (
    <group>
      {/* Trees */}
      <Tree position={[-8, 0, -5]} scale={1.2} />
      <Tree position={[12, 0, -8]} scale={0.9} />
      <Tree position={[7, 0, 10]} scale={1.5} />
      <Tree position={[-10, 0, 8]} scale={1.1} />
      
      {/* Hills */}
      <Hill position={[-15, 0, -15]} scale={[10, 2, 10]} />
      <Hill position={[15, 0, 15]} scale={[8, 1.5, 8]} />
      
      {/* Rocks */}
      <Rock position={[5, 0, -3]} scale={0.8} />
      <Rock position={[-4, 0, 6]} scale={0.6} />
      <Rock position={[8, 0, 3]} scale={1.2} />
    </group>
  );
};

interface PositionProps {
  position: [number, number, number];
  scale?: number | [number, number, number];
}

const Tree = ({ position, scale = 1 }: PositionProps) => {
  return (
    <group position={position} scale={scale}>
      {/* Tree trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
      
      {/* Tree foliage */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[1, 3, 8]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
    </group>
  );
};

const Hill = ({ position, scale = [5, 1, 5] }: PositionProps) => {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <hemisphereGeometry args={[1, 1, 16]} />
      <meshStandardMaterial color="#8BC34A" />
    </mesh>
  );
};

const Rock = ({ position, scale = 1 }: PositionProps) => {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#9E9E9E" roughness={0.8} />
    </mesh>
  );
};
