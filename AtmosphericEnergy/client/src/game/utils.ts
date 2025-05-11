import * as THREE from "three";

// Utility function to check if two objects are colliding
// using simple distance-based collision detection
export const isColliding = (
  position1: THREE.Vector3,
  position2: THREE.Vector3,
  radius: number
): boolean => {
  const distance = position1.distanceTo(position2);
  return distance < radius;
};

// Linear interpolation helper
export const lerp = (start: number, end: number, t: number): number => {
  return start * (1 - t) + end * t;
};

// Create a random position within bounds
export const randomPosition = (
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  minZ: number,
  maxZ: number
): THREE.Vector3 => {
  return new THREE.Vector3(
    minX + Math.random() * (maxX - minX),
    minY + Math.random() * (maxY - minY),
    minZ + Math.random() * (maxZ - minZ)
  );
};

// Format number with commas for display
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
