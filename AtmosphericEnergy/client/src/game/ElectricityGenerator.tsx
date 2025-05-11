import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useGameState } from "./useGameState";
import { useAudio } from "@/lib/stores/useAudio";
import { ElectricityParticle } from "./ElectricityParticle";

interface ElectricityGeneratorProps {
  position: THREE.Vector3;
  moleculesCollected: number;
  onGenerate: (amount: number) => void;
}

const ElectricityGenerator = ({ position, moleculesCollected, onGenerate }: ElectricityGeneratorProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isPlayerNear, setIsPlayerNear] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [availableMolecules, setAvailableMolecules] = useState(moleculesCollected);
  const [particles, setParticles] = useState<{id: number, startPos: THREE.Vector3}[]>([]);
  
  const { playerPosition, interactPressed } = useGameState();
  const { playSuccess } = useAudio();
  
  // Update available molecules when player collects more
  useEffect(() => {
    setAvailableMolecules(moleculesCollected);
  }, [moleculesCollected]);
  
  // Handle player proximity and interaction
  useFrame(() => {
    if (!groupRef.current || !playerPosition) return;
    
    // Check if player is near the generator
    const distance = playerPosition.distanceTo(new THREE.Vector3(position.x, position.y, position.z));
    const nearGenerator = distance < 3;
    
    if (nearGenerator !== isPlayerNear) {
      setIsPlayerNear(nearGenerator);
    }
    
    // Start generation process if player interacts and has molecules
    if (nearGenerator && interactPressed && availableMolecules > 0 && !isGenerating) {
      console.log("Generator: Starting electricity generation");
      setIsGenerating(true);
      setGenProgress(0);
      
      // Remove molecules from available count
      const moleculesToUse = Math.min(availableMolecules, 5);
      setAvailableMolecules(prev => prev - moleculesToUse);
      
      // Create electricity particles
      const newParticles = Array.from({ length: moleculesToUse * 3 }, (_, i) => ({
        id: Date.now() + i,
        startPos: new THREE.Vector3(
          position.x + (Math.random() * 2 - 1),
          position.y + 2 + Math.random(),
          position.z + (Math.random() * 2 - 1)
        )
      }));
      
      setParticles(prev => [...prev, ...newParticles]);
      
      // Generate electricity after 2 seconds
      setTimeout(() => {
        playSuccess();
        onGenerate(moleculesToUse);
        setIsGenerating(false);
        setParticles([]);
      }, 2000);
    }
    
    // Update generation progress
    if (isGenerating) {
      setGenProgress(prev => Math.min(prev + 0.01, 1));
    }
    
    // Rotate the generator slowly
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      {/* Base platform */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2, 0.2, 32]} />
        <meshStandardMaterial color="#455A64" />
      </mesh>
      
      {/* Central pillar */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 2, 16]} />
        <meshStandardMaterial color="#607D8B" />
      </mesh>
      
      {/* Energy collector dome */}
      <mesh position={[0, 2.25, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color={isGenerating ? "#4FC3F7" : "#90A4AE"} 
          emissive={isGenerating ? "#29B6F6" : "#000000"}
          emissiveIntensity={isGenerating ? 2 : 0}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Central coil */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <torusGeometry args={[0.6, 0.1, 16, 32]} />
        <meshStandardMaterial color="#FF9800" />
      </mesh>
      
      {/* Secondary coil */}
      <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.5, 0.1, 16, 32]} />
        <meshStandardMaterial color="#FF9800" />
      </mesh>
      
      {/* Inner energy core */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color="#2196F3" 
          emissive="#0D47A1"
          emissiveIntensity={isGenerating ? 2 : 0.5}
        />
      </mesh>
      
      {/* Display particles when generating */}
      {particles.map(particle => (
        <ElectricityParticle 
          key={particle.id}
          startPosition={particle.startPos}
          targetPosition={new THREE.Vector3(position.x, position.y + 1.5, position.z)}
        />
      ))}
      
      {/* Interaction text */}
      {isPlayerNear && (
        <Text
          position={[0, 3.5, 0]}
          color="white"
          fontSize={0.3}
          maxWidth={5}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {availableMolecules > 0 
            ? `Press E to convert ${Math.min(availableMolecules, 5)} water molecules to electricity`
            : "Collect more water molecules!"}
        </Text>
      )}
      
      {/* Progress indicator */}
      {isGenerating && (
        <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1, 32, 1, 0, Math.PI * 2 * genProgress]} />
          <meshBasicMaterial color="#4CAF50" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

export default ElectricityGenerator;
