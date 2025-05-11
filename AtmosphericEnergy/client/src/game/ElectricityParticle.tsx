import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ElectricityParticleProps {
  startPosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
}

export const ElectricityParticle = ({ startPosition, targetPosition }: ElectricityParticleProps) => {
  const particleRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const durationRef = useRef(Math.random() * 1 + 0.5); // Random duration between 0.5 and 1.5s
  const positionRef = useRef(startPosition.clone());
  const velocityRef = useRef(new THREE.Vector3(
    (Math.random() - 0.5) * 0.2,
    (Math.random() - 0.5) * 0.2,
    (Math.random() - 0.5) * 0.2
  ));
  
  // Initialize with random color in blue/cyan spectrum
  const color = new THREE.Color();
  color.setHSL(0.6 + Math.random() * 0.1, 1, 0.5 + Math.random() * 0.3);
  
  useFrame((_, delta) => {
    if (!particleRef.current) return;
    
    timeRef.current += delta;
    const progress = Math.min(timeRef.current / durationRef.current, 1);
    
    // Update position with slight random movement
    positionRef.current.add(velocityRef.current.clone().multiplyScalar(delta));
    
    // Lerp towards target
    const newPos = positionRef.current.clone().lerp(targetPosition, progress * 0.1);
    particleRef.current.position.copy(newPos);
    
    // Flicker effect
    if (Math.random() > 0.7) {
      particleRef.current.visible = !particleRef.current.visible;
    }
    
    // Change size based on progress
    const scale = 1 - progress * 0.7;
    particleRef.current.scale.set(scale, scale, scale);
  });
  
  return (
    <mesh ref={particleRef} position={startPosition.clone()}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};
