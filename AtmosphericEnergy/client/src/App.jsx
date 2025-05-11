import { Canvas } from "@react-three/fiber"
import { Suspense, useState, useEffect, useRef } from "react"
import { KeyboardControls } from "@react-three/drei"
import Game from "./game/Game"
import GameUI from "./game/GameUI"
import { useAudio } from "./lib/stores/useAudio"
import "@fontsource/inter"

// Define control keys for the game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "jump", keys: ["Space"] },
  { name: "interact", keys: ["KeyE"] }
]

// Main App component
function App() {
  const [showHomeScreen, setShowHomeScreen] = useState(true)
  const [showIntro, setShowIntro] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)
  const { setBackgroundMusic, isMuted } = useAudio()
  const homeScreenMusicRef = useRef(null)

  // Initialize home screen music
  useEffect(() => {
    // Create home screen music that's different from the game music
    const music = new Audio("/sounds/background.mp3")
    music.loop = true
    music.volume = 0.3

    // Apply muted state from audio store
    if (isMuted) {
      music.volume = 0
      music.muted = true
    }

    // Play music when component mounts
    music.play().catch(error => {
      console.log(
        "Auto-play was prevented. User needs to interact first:",
        error
      )
    })

    homeScreenMusicRef.current = music

    // Clean up when component unmounts
    return () => {
      if (homeScreenMusicRef.current) {
        homeScreenMusicRef.current.pause()
        homeScreenMusicRef.current = null
      }
    }
  }, [isMuted])

  // Show the canvas once everything is loaded
  useEffect(() => {
    if (!showHomeScreen && !showIntro) {
      setShowCanvas(true)
    }
  }, [showHomeScreen, showIntro])

  const startIntro = () => {
    // Transition from home screen to intro screen
    setShowHomeScreen(false)
    setShowIntro(true)
  }

  const startGame = () => {
    // Stop home screen music when game starts
    if (homeScreenMusicRef.current) {
      homeScreenMusicRef.current.pause()
      homeScreenMusicRef.current = null
    }

    // Set up game music (will be handled by the Game component)
    const bgMusic = new Audio("/sounds/background.mp3")
    bgMusic.loop = true
    bgMusic.volume = 0.3
    setBackgroundMusic(bgMusic)

    setShowIntro(false)
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {showHomeScreen && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-blue-700 to-blue-900 p-4 overflow-hidden">
          {/* Animated water molecules in background */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: "rgba(66, 153, 225, 0.3)",
                width: `${Math.random() * 30 + 20}px`,
                height: `${Math.random() * 30 + 20}px`,
                animationDuration: `${Math.random() * 10 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}

          <div className="max-w-2xl bg-black/40 backdrop-blur-md p-10 rounded-lg text-center text-white border border-blue-400 z-10">
            <h1 className="text-5xl font-bold mb-8 text-blue-200 animate-pulse">
              Atmospheric Electricity Harvester
            </h1>

            <p className="text-lg mb-10">
              Discover the science of atmospheric electricity through
              interactive gameplay
            </p>

            <button
              onClick={startIntro}
              className="mb-12 px-8 py-3 bg-blue-600 text-white rounded-full text-xl hover:bg-blue-500 transition-colors shadow-lg"
            >
              Begin Adventure
            </button>

            <div className="mt-8 pt-8 border-t border-blue-600/40">
              <h2 className="text-xl mb-4 font-semibold">Credits</h2>
              <p className="mb-2">Programmed by Tuyết Minh</p>
              <p>Group 7, 7A6, 2024-2025 Science Fair</p>
            </div>
          </div>
        </div>
      )}

      {showIntro && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background p-4">
          <div className="max-w-xl p-6 bg-card text-card-foreground rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4">
              Atmospheric Electricity Harvester
            </h1>
            <p className="mb-4">
              Learn how to generate electricity from atmospheric humidity
              through this interactive game!
            </p>
            <p className="mb-2">In this science simulator, you'll:</p>
            <ul className="list-disc ml-5 mb-6">
              <li>Collect water molecules from the air</li>
              <li>Convert humidity into electrical energy</li>
              <li>Learn about this promising sustainable energy source</li>
              <li>Explore the science behind atmospheric electricity</li>
            </ul>
            <div className="text-sm text-muted-foreground mb-6">
              <p>
                <strong>Controls:</strong> Arrow keys/WASD to move, Space to
                jump, E to interact
              </p>
            </div>
            <button
              onClick={startGame}
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Start Learning!
            </button>
          </div>
        </div>
      )}

      {showCanvas && (
        <KeyboardControls map={controls}>
          <Canvas
            shadows
            camera={{
              position: [0, 5, 10],
              fov: 50,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "default"
            }}
          >
            <color attach="background" args={["#87CEEB"]} />

            {/* Game components */}
            <Suspense fallback={null}>
              <Game />
            </Suspense>
          </Canvas>

          {/* Overlay UI */}
          <GameUI />
        </KeyboardControls>
      )}
    </div>
  )
}

export default App
