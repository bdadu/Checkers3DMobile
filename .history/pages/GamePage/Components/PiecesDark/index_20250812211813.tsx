import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import Colors from '../../../../constants/Colors';

interface PiecesDarkProps {
  id: string;
  position: [number, number, number];
  onClick: (id: string) => void;
  isQueen?: boolean;
  isJump?: boolean;
  isSelected?: boolean;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const PiecesDark: React.FC<PiecesDarkProps> = ({ id, position, onClick, isQueen, isJump, isSelected }) => {
  const meshRef = useRef<any>(null);
  const animRef = useRef({
    start: position,
    end: position,
    startTime: 0,
    jumping: false,
  });

  useEffect(() => {
    if (isJump && meshRef.current) {
      animRef.current = {
        start: meshRef.current.position.toArray(),
        end: position,
        startTime: Date.now(),
        jumping: true,
      };
    } else if (meshRef.current) {
      meshRef.current.position.set(...position);
      animRef.current.jumping = false;
    }
  }, [isJump, position]);

  useFrame(() => {
    if (animRef.current.jumping && meshRef.current) {
      const { start, end, startTime } = animRef.current;
      const duration = 1500;
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const peakY = start[1] + 1.5;
      const x = lerp(start[0], end[0], t);
      const z = lerp(start[2], end[2], t);
      const y = t < 0.5
        ? lerp(start[1], peakY, t * 2)
        : lerp(peakY, end[1], (t - 0.5) * 2);
      meshRef.current.position.set(x, y, z);
      if (t === 1) {
        animRef.current.jumping = false;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerDown={(e) => {
        e.stopPropagation();
        onClick(id);
      }}
    >
      <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
      <meshStandardMaterial
        color={isSelected ? Colors.brown.brown : Colors.brown.darkBrown}
        transparent
        opacity={0.8}
        emissive={isSelected ? Colors.brown.brown : '#6e3a2a'}
        emissiveIntensity={isSelected ? 1.5 : 0}
      />
      {isQueen && (
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.04, 32]} />
          <meshStandardMaterial color={'#fff'} />
        </mesh>
      )}
    </mesh>
  );
};

export default PiecesDark;
