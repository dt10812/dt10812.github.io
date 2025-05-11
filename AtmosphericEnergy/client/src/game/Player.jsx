import { useRef, useEffect, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import * as THREE from "three"
import { useAudio } from "@/lib/stores/useAudio"
import { useGameState } from "./useGameState"

// Player component
const Player = () => {
  const playerRef = useRef(null)
  const bodyRef = useRef(null)
  const positionRef = useRef(new THREE.Vector3(0, 1, 0))
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0))
  const rotationRef = useRef(new THREE.Euler(0, 0, 0))
  const { camera, gl } = useThree()
  const { playHit } = useAudio()
  const { setPlayerPosition } = useGameState()
  const [isMouseLookEnabled, setIsMouseLookEnabled] = useState(false)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const targetRotationRef = useRef(0)

  // Get keyboard controls state
  const [, getControls] = useKeyboardControls()

  // Settings
  const MOVE_SPEED = 5
  const JUMP_FORCE = 8
  const GRAVITY = 20
  const MOUSE_SENSITIVITY = 0.003
  const isOnGround = useRef(true)

  // Set up mouse controls
  useEffect(() => {
    const canvas = gl.domElement

    const handleMouseDown = () => {
      setIsMouseLookEnabled(true)
      document.body.style.cursor = "grabbing"
    }

    const handleMouseUp = () => {
      setIsMouseLookEnabled(false)
      document.body.style.cursor = "auto"
    }

    const handleMouseMove = event => {
      if (isMouseLookEnabled) {
        mousePositionRef.current.x = event.movementX
      }
    }

    // Pointer lock API for seamless mouse control
    canvas.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mousemove", handleMouseMove)

    // Initial camera setup
    camera.position.set(0, 5, 10)
    camera.lookAt(0, 0, 0)

    console.log("Player: Initial position set, controls ready")

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousemove", handleMouseMove)
      document.body.style.cursor = "auto"
    }
  }, [camera, gl.domElement, isMouseLookEnabled])

  useFrame((_, delta) => {
    if (!playerRef.current || !bodyRef.current) return

    // Handle mouse look rotation
    if (isMouseLookEnabled) {
      targetRotationRef.current -=
        mousePositionRef.current.x * MOUSE_SENSITIVITY
      mousePositionRef.current.x = 0 // Reset movement after applying
    }

    // Smoothly interpolate current rotation to target rotation
    rotationRef.current.y = THREE.MathUtils.lerp(
      rotationRef.current.y,
      targetRotationRef.current,
      0.1
    )

    // Apply rotation to player model
    playerRef.current.rotation.y = rotationRef.current.y

    // Get current controls state
    const { forward, backward, leftward, rightward, jump } = getControls()

    // Calculate movement direction relative to camera
    const moveDirection = new THREE.Vector3(0, 0, 0)

    // Create rotation matrix based on player's current rotation
    const rotationMatrix = new THREE.Matrix4()
    rotationMatrix.makeRotationY(rotationRef.current.y)

    // Apply movement based on player's facing direction
    if (forward) {
      const forwardVector = new THREE.Vector3(0, 0, -1)
      forwardVector.applyMatrix4(rotationMatrix)
      moveDirection.add(forwardVector)
    }

    if (backward) {
      const backwardVector = new THREE.Vector3(0, 0, 1)
      backwardVector.applyMatrix4(rotationMatrix)
      moveDirection.add(backwardVector)
    }

    if (leftward) {
      const leftVector = new THREE.Vector3(-1, 0, 0)
      leftVector.applyMatrix4(rotationMatrix)
      moveDirection.add(leftVector)
    }

    if (rightward) {
      const rightVector = new THREE.Vector3(1, 0, 0)
      rightVector.applyMatrix4(rotationMatrix)
      moveDirection.add(rightVector)
    }

    // Normalize the movement direction if moving diagonally
    if (moveDirection.length() > 0) {
      moveDirection.normalize()
    }

    // Apply horizontal movement
    const moveDistance = MOVE_SPEED * delta
    positionRef.current.x += moveDirection.x * moveDistance
    positionRef.current.z += moveDirection.z * moveDistance

    // Apply gravity
    velocityRef.current.y -= GRAVITY * delta

    // Apply jump if on ground
    if (jump && isOnGround.current) {
      velocityRef.current.y = JUMP_FORCE
      isOnGround.current = false
      playHit() // Jump sound
      console.log("Player: Jump!")
    }

    // Update vertical position
    positionRef.current.y += velocityRef.current.y * delta

    // Check for ground collision
    if (positionRef.current.y < 1) {
      positionRef.current.y = 1
      velocityRef.current.y = 0
      isOnGround.current = true
    }

    // Limit play area
    positionRef.current.x = THREE.MathUtils.clamp(
      positionRef.current.x,
      -15,
      15
    )
    positionRef.current.z = THREE.MathUtils.clamp(
      positionRef.current.z,
      -15,
      15
    )

    // Update group position
    playerRef.current.position.copy(positionRef.current)

    // Position camera behind player based on rotation
    const cameraOffset = new THREE.Vector3(0, 5, 10)
    cameraOffset.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      rotationRef.current.y
    )

    camera.position.x = positionRef.current.x + cameraOffset.x
    camera.position.y = positionRef.current.y + cameraOffset.y
    camera.position.z = positionRef.current.z + cameraOffset.z
    camera.lookAt(
      positionRef.current.x,
      positionRef.current.y + 1,
      positionRef.current.z
    )

    // Update player position in game state
    setPlayerPosition(positionRef.current.clone())
  })

  return (
    <group ref={playerRef} position={[0, 1, 0]}>
      {/* Player body */}
      <mesh ref={bodyRef} castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#4285F4" />

        {/* Player face/direction indicator */}
        <mesh position={[0, 0.5, -0.51]}>
          <boxGeometry args={[0.6, 0.2, 0.1]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </mesh>

      {/* Mouse look indicator when active */}
      {isMouseLookEnabled && (
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#FF0000"
            emissive="#FF0000"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  )
}

export default Player
