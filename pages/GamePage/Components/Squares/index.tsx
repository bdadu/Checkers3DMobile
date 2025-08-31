// pages/GamePage/Components/Squares/index.tsx
import React from 'react';
import type { ThreeEvent } from '@react-three/fiber';

interface SquaresProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  onClick: (position: [number, number, number], color: string) => void;
}

const Squares: React.FC<SquaresProps> = ({ position, size, color, onClick }) => {
  return (
    <mesh
      position={position}
      castShadow
      receiveShadow
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onClick(position, color);
      }}
      renderOrder={0}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        transparent={false}
        depthWrite={true}
        depthTest={true}
        metalness={0}
        roughness={1}
      />
    </mesh>
  );
};

export default Squares;
