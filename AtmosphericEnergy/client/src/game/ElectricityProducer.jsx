import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"
import { useGameState } from "./useGameState"
import { useAudio } from "@/lib/stores/useAudio"
import { ElectricityParticle } from "./ElectricityParticle"

const ElectricityProducer = ({ position, onGenerate }) => {
  const groupRef = useRef(null)
  const [isPlayerNear, setIsPlayerNear] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [genProgress, setGenProgress] = useState(0)
  const [particles, setParticles] = useState([])
  const [productionLevel, setProductionLevel] = useState(1)
  const [totalProduced, setTotalProduced] = useState(0)

  const { playerPosition } = useGameState()
  const { playSuccess, playHit } = useAudio()

  // Handle player proximity and interaction
  useFrame((_, delta) => {
    if (!groupRef.current || !playerPosition) return

    // Update cooldown timer
    if (cooldown > 0) {
      setCooldown(prev => Math.max(0, prev - delta))
    }

    // Check if player is near the generator
    const distance = playerPosition.distanceTo(
      new THREE.Vector3(position.x, position.y, position.z)
    )
    const nearProducer = distance < 2

    if (nearProducer !== isPlayerNear) {
      setIsPlayerNear(nearProducer)
    }

    // Start generation process if player is touching and not on cooldown
    if (nearProducer && !isGenerating && cooldown === 0) {
      console.log("Producer: Starting electricity generation")
      setIsGenerating(true)
      setGenProgress(0)
      playHit()

      // Create electricity particles
      const particleCount = productionLevel * 5
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: Date.now() + i,
        startPos: new THREE.Vector3(
          position.x + (Math.random() * 2 - 1),
          position.y + 2 + Math.random(),
          position.z + (Math.random() * 2 - 1)
        )
      }))

      setParticles(prev => [...prev, ...newParticles])

      // Generate electricity after a short delay
      setTimeout(() => {
        const amount = productionLevel * 2
        playSuccess()
        onGenerate(amount)
        setTotalProduced(prev => prev + amount)

        // Increase production level every 20 kWh generated
        if (
          Math.floor(totalProduced / 20) <
          Math.floor((totalProduced + amount) / 20)
        ) {
          setProductionLevel(prev => Math.min(prev + 1, 5))
        }

        setIsGenerating(false)
        setParticles([])
        setCooldown(3) // 3 second cooldown
      }, 1000)
    }

    // Update generation progress
    if (isGenerating) {
      setGenProgress(prev => Math.min(prev + 0.05, 1))
    }

    // Pulsating animation
    if (groupRef.current) {
      const pulseFactor = 1 + Math.sin(Date.now() * 0.003) * 0.05
      groupRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor)
    }
  })

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      {/* Base platform */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.8, 0.3, 16]} />
        <meshStandardMaterial color="#663399" />
      </mesh>

      {/* Central core */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 16]} />
        <meshStandardMaterial
          color={isGenerating ? "#9F7AEA" : "#805AD5"}
          emissive={isGenerating ? "#6B46C1" : "#553C9A"}
          emissiveIntensity={isGenerating ? 2 : 0.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Connecting rods */}
      {[0, 1, 2, 3].map(i => {
        const angle = (i * Math.PI) / 2
        const x = Math.cos(angle) * 0.5
        const z = Math.sin(angle) * 0.5
        return (
          <mesh
            key={i}
            position={[x, 0.6, z]}
            rotation={[0, -angle, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.1, 0.1, 1.2, 8]} />
            <meshStandardMaterial color="#805AD5" />
          </mesh>
        )
      })}

      {/* Level indicators - light up based on production level */}
      {[0, 1, 2, 3, 4].map(i => {
        const active = i < productionLevel
        const angle = (i * Math.PI) / 2.5 + Math.PI / 5
        const x = Math.cos(angle) * 1.2
        const z = Math.sin(angle) * 1.2
        return (
          <mesh key={i} position={[x, 0.5, z]} castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color={active ? "#68D391" : "#2D3748"}
              emissive={active ? "#48BB78" : "#1A202C"}
              emissiveIntensity={active ? 1 : 0}
            />
          </mesh>
        )
      })}

      {/* Energy field */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#B794F4"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      {/* Electricity particles when generating */}
      {particles.map(particle => (
        <ElectricityParticle
          key={particle.id}
          startPosition={particle.startPos}
          targetPosition={
            new THREE.Vector3(position.x, position.y + 1.2, position.z)
          }
        />
      ))}

      {/* Production level indicator */}
      <Text
        position={[0, 2.5, 0]}
        color="white"
        fontSize={0.2}
        maxWidth={3}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {`Level ${productionLevel} Producer`}
      </Text>

      {/* Cooldown or instruction text */}
      {isPlayerNear && !isGenerating && (
        <Text
          position={[0, 3, 0]}
          color="white"
          fontSize={0.15}
          maxWidth={4}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {cooldown > 0
            ? `Recharging... ${cooldown.toFixed(1)}s`
            : "Touch to generate electricity"}
        </Text>
      )}

      {/* Progress indicator */}
      {isGenerating && (
        <mesh position={[0, 2.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[0.6, 0.7, 32, 1, 0, Math.PI * 2 * genProgress]}
          />
          <meshBasicMaterial color="#4CAF50" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

export default ElectricityProducer
