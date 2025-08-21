import React from 'react';

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
      onPointerDown={(e) => {
        e.stopPropagation();
        onClick(position, color);
      }}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </mesh>
  );
};

export default React.memo(Squares, (prev, next) => {
  return (
    prev.color === next.color &&
    prev.position[0] === next.position[0] &&
    prev.position[1] === next.position[1] &&
    prev.position[2] === next.position[2]
  );
});
