import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Sky, Cloud, Environment, OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import Player from "./Player"
import { WaterMolecule } from "./WaterMolecule"
import ElectricityGenerator from "./ElectricityGenerator"
import { useAudio } from "@/lib/stores/useAudio"
import { useGameState } from "./useGameState"

const Game = () => {
  const gameRef = useRef(null)
  const [waterMolecules, setWaterMolecules] = useState([])
  const lastSpawnTime = useRef(0)
  const {
    score,
    updateScore,
    moleculesCollected,
    addMolecule,
    electricityGenerated,
    addElectricity
  } = useGameState()

  // Setup audio
  const { backgroundMusic, setHitSound, setSuccessSound } = useAudio()
  useEffect(() => {
    // Background music is now set up in App.tsx
    // Just play it if it exists
    if (backgroundMusic) {
      backgroundMusic.play().catch(e => {
        console.log("Failed to play background music:", e)
      })
    }

    // Set up sound effects
    const hit = new Audio("/sounds/hit.mp3")
    setHitSound(hit)

    const success = new Audio("/sounds/success.mp3")
    setSuccessSound(success)

    console.log("Game: Audio setup complete")

    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause()
      }
    }
  }, [backgroundMusic, setHitSound, setSuccessSound])

  // Create water molecules at random positions
  useFrame(state => {
    const time = state.clock.getElapsedTime()

    // Spawn a new water molecule every 2 seconds
    if (time - lastSpawnTime.current > 2) {
      lastSpawnTime.current = time

      // Create a random position within the game area
      const x = Math.random() * 20 - 10
      const z = Math.random() * 20 - 10
      const y = 1 + Math.random() * 2 // Float above the ground

      const newMolecule = {
        id: Date.now(),
        position: new THREE.Vector3(x, y, z)
      }

      setWaterMolecules(prev => [...prev, newMolecule])
    }
  })

  // Handle collection of water molecules
  const collectMolecule = id => {
    setWaterMolecules(prev => prev.filter(molecule => molecule.id !== id))
    addMolecule(1)
    updateScore(10)
    console.log(
      "Molecule collected! Molecules:",
      moleculesCollected + 1,
      "Score:",
      score + 10
    )
  }

  // Generate electricity from collected water molecules
  const generateElectricity = amount => {
    addElectricity(amount)
    updateScore(amount * 20)
    console.log(
      "Electricity generated:",
      amount,
      "Total:",
      electricityGenerated + amount
    )
  }

  return (
    <group ref={gameRef}>
      {/* Environment */}
      <Sky sunPosition={[0, 1, 0]} />
      <Environment preset="park" />

      {/* Ambient light for overall scene brightening */}
      <ambientLight intensity={0.5} />

      {/* Main directional light with shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#8BC34A" />
      </mesh>

      {/* Clouds for atmospheric effect */}
      <Cloud position={new THREE.Vector3(-4, 15, -5)} />
      <Cloud position={new THREE.Vector3(4, 18, -12)} />
      <Cloud position={new THREE.Vector3(10, 16, 0)} />

      {/* Electricity generator */}
      <ElectricityGenerator
        position={new THREE.Vector3(0, 0.5, -5)}
        moleculesCollected={moleculesCollected}
        onGenerate={generateElectricity}
      />

      {/* Water molecules scattered around */}
      {waterMolecules.map(molecule => (
        <WaterMolecule
          key={molecule.id}
          position={molecule.position}
          onCollect={() => collectMolecule(molecule.id)}
        />
      ))}

      {/* Player character */}
      <Player />

      {/* Debug controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2 - 0.1}
      />
    </group>
  )
}

export default Game
