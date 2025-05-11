import * as THREE from "three"

// Utility function to check if two objects are colliding
// using simple distance-based collision detection
export const isColliding = (position1, position2, radius) => {
  const distance = position1.distanceTo(position2)
  return distance < radius
}

// Linear interpolation helper
export const lerp = (start, end, t) => {
  return start * (1 - t) + end * t
}

// Create a random position within bounds
export const randomPosition = (minX, maxX, minY, maxY, minZ, maxZ) => {
  return new THREE.Vector3(
    minX + Math.random() * (maxX - minX),
    minY + Math.random() * (maxY - minY),
    minZ + Math.random() * (maxZ - minZ)
  )
}

// Format number with commas for display
export const formatNumber = num => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
