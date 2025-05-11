import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useGameState } from "./useGameState"
import { useAudio } from "@/lib/stores/useAudio"

export const WaterMolecule = ({ position, onCollect }) => {
  const groupRef = useRef(null)
  const initialY = position.y
  const [collected, setCollected] = useState(false)
  const { playerPosition } = useGameState()
  const { playHit } = useAudio()

  // Create a reference for the floating animation
  const floatOffset = useRef(Math.random() * Math.PI * 2)

  // Setup the molecule with random rotation
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.random() * Math.PI * 2
    }
  }, [])

  // Handle animation and collection
  useFrame(state => {
    if (!groupRef.current || collected) return

    // Floating animation
    const time = state.clock.getElapsedTime()
    const floatY = Math.sin(time + floatOffset.current) * 0.2
    groupRef.current.position.y = initialY + floatY

    // Slow rotation
    groupRef.current.rotation.y += 0.01

    // Check for collection (player proximity)
    if (playerPosition) {
      const distance = playerPosition.distanceTo(groupRef.current.position)
      if (distance < 1.5) {
        setCollected(true)
        playHit()
        onCollect()
      }
    }
  })

  // If collected, don't render
  if (collected) return null

  return (
    <group ref={groupRef} position={position}>
      {/* Oxygen atom (red) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#F44336" />
      </mesh>

      {/* Hydrogen atoms (white) */}
      <mesh position={[-0.25, 0.15, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      <mesh position={[0.25, 0.15, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Bonds between atoms */}
      <mesh position={[-0.125, 0.075, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshStandardMaterial color="#CCCCCC" />
      </mesh>

      <mesh position={[0.125, 0.075, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshStandardMaterial color="#CCCCCC" />
      </mesh>
    </group>
  )
}
