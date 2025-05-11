import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useGameState } from "./useGameState";

interface ElectricityMeasurerProps {
  position: THREE.Vector3;
}

const ElectricityMeasurer = ({ position }: ElectricityMeasurerProps) => {
  const measurer = useRef<THREE.Group>(null);
  const dialRef = useRef<THREE.Mesh>(null);
  const { electricityGenerated } = useGameState();
  const [currentReading, setCurrentReading] = useState(0);
  const [displayedValue, setDisplayedValue] = useState("0.00 kWh");
  const [isPlayerNear, setIsPlayerNear] = useState(false);
  const { playerPosition } = useGameState();

  // Smoothly animate the reading value
  useEffect(() => {
    const targetValue = electricityGenerated;
    const animateValue = () => {
      if (Math.abs(currentReading - targetValue) < 0.1) {
        setCurrentReading(targetValue);
      } else {
        setCurrentReading(prev => prev + (targetValue - prev) * 0.1);
      }
    };
    
    const interval = setInterval(animateValue, 50);
    return () => clearInterval(interval);
  }, [electricityGenerated, currentReading]);

  // Update the displayed value with formatting
  useEffect(() => {
    setDisplayedValue(`${currentReading.toFixed(2)} kWh`);
  }, [currentReading]);

  // Handle dial rotation and player proximity
  useFrame(() => {
    if (!measurer.current || !dialRef.current || !playerPosition) return;
    
    // Rotate the dial based on electricity value
    const rotation = THREE.MathUtils.lerp(
      0,
      Math.PI * 1.5, // 270 degrees max rotation
      Math.min(currentReading / 100, 1) // scale to max 100 kWh
    );
    
    dialRef.current.rotation.z = -rotation;
    
    // Check if player is near
    const distance = playerPosition.distanceTo(position);
    setIsPlayerNear(distance < 4);
  });

  return (
    <group ref={measurer} position={position}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 1.2]} />
        <meshStandardMaterial color="#2D3748" />
      </mesh>
      
      {/* Display panel */}
      <mesh position={[0, 0.8, 0.61]} receiveShadow>
        <boxGeometry args={[1.8, 0.6, 0.05]} />
        <meshStandardMaterial color="#1A202C" />
      </mesh>
      
      {/* Circular gauge background */}
      <mesh position={[0, 1.3, 0.61]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.05, 32]} />
        <meshStandardMaterial color="#2D3748" />
      </mesh>
      
      {/* Gauge face */}
      <mesh position={[0, 1.3, 0.64]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.05, 32]} />
        <meshStandardMaterial color="#E2E8F0" />
      </mesh>
      
      {/* Dial */}
      <mesh 
        ref={dialRef} 
        position={[0, 1.3, 0.66]} 
        rotation={[0, 0, 0]} 
      >
        <boxGeometry args={[0.05, 0.5, 0.02]} />
        <meshStandardMaterial color="#E53E3E" />
      </mesh>
      
      {/* Text display for the measurement */}
      <Text
        position={[0, 0.8, 0.65]}
        color="white"
        fontSize={0.15}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {displayedValue}
      </Text>
      
      {/* Labels */}
      <Text
        position={[0, 1.9, 0.61]}
        color="white"
        fontSize={0.12}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        Electricity Meter
      </Text>
      
      {/* Scale markers */}
      {[...Array(5)].map((_, i) => {
        const angle = (Math.PI * 1.5) * (i / 4);
        const x = Math.sin(angle) * 0.5;
        const y = Math.cos(angle) * 0.5;
        const value = 25 * i;
        
        return (
          <group key={i} position={[x, 1.3 + y, 0.66]}>
            <mesh>
              <boxGeometry args={[0.05, 0.05, 0.01]} />
              <meshStandardMaterial color="#2D3748" />
            </mesh>
            <Text
              position={[0, 0.1, 0]}
              color="#2D3748"
              fontSize={0.08}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
            >
              {value}
            </Text>
          </group>
        );
      })}
      
      {/* Information text that appears when player is near */}
      {isPlayerNear && (
        <Text
          position={[0, 2.2, 0]}
          color="white"
          fontSize={0.15}
          maxWidth={2.5}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          Total electricity generated from atmospheric humidity
        </Text>
      )}
    </group>
  );
};

export default ElectricityMeasurer;