import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import Colors from '../../../../constants/Colors';
import { DoubleSide, Vector3, CylinderGeometry, RingGeometry } from 'three';


interface PiecesLightProps {
  id: string;
  position: [number, number, number];
  onClick: (id: string) => void;
  isQueen?: boolean;
  isBotMoving?: boolean;
  isJump?: boolean;
}

// Aliniat cu implementarea pentru PiecesDark
const DURATION = 1.0; // secunde, sincronizat cu timeout-ul isJump (1000ms)
const ARC_HEIGHT = 1.0; // înălțimea arcului

const bezier2 = (a: Vector3, b: Vector3, c: Vector3, t: number, out: Vector3) => {
  // (1-t)^2 * a + 2(1-t)t * b + t^2 * c
  const s = 1 - t;
  out.set(
    s * s * a.x + 2 * s * t * b.x + t * t * c.x,
    s * s * a.y + 2 * s * t * b.y + t * t * c.y,
    s * s * a.z + 2 * s * t * b.z + t * t * c.z
  );
  return out;
};

// Shared geometries (evită garbage / alocări repetate)
const PIECE_GEOMETRY = new CylinderGeometry(0.2, 0.2, 0.1, 32);
const QUEEN_RING_GEOMETRY = new RingGeometry(0.11, 0.15, 48);

const PiecesLight: React.FC<PiecesLightProps> = ({ id, position, onClick, isQueen, isBotMoving, isJump }) => {
  const meshRef = useRef<any>(null);
  const lastPosRef = useRef(new Vector3(...position));
  const animRef = useRef({
    t: 0,
    jumping: false,
    duration: DURATION,
    start: new Vector3(...position),
    end: new Vector3(...position),
    ctrl: new Vector3(...position),
  });
  const tmp = useRef(new Vector3());

  useEffect(() => {
    if (!meshRef.current) return;

    if (isJump) {
      // Start din ultima pozitie reală, pentru a evita „teleport”-ul
      const start = lastPosRef.current.clone();
      const end = new Vector3(...position);
      const ctrl = start.clone().lerp(end, 0.5);
      ctrl.y += ARC_HEIGHT;

      // Resetăm poziția vizuală la start înainte de animare
      meshRef.current.position.copy(start);

      animRef.current = {
        t: 0,
        jumping: true,
        duration: DURATION,
        start,
        end,
        ctrl,
      };
    } else {
      // Mutare simplă sau idle: setăm poziția și memorăm ca „ultima poziție”
      meshRef.current.position.set(...position);
      lastPosRef.current.set(position[0], position[1], position[2]);
      animRef.current.jumping = false;
      animRef.current.t = 0;
    }
  }, [isJump, position]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const a = animRef.current;
    if (!a.jumping) return;

    // avansăm timpul în funcție de delta (FPS independent)
    a.t = Math.min(1, a.t + delta / a.duration);

    // Easing ușor (easeInOutQuad)
    const t = a.t < 0.5 ? 2 * a.t * a.t : -1 + (4 - 2 * a.t) * a.t;

    bezier2(a.start, a.ctrl, a.end, t, tmp.current);
    meshRef.current.position.copy(tmp.current);

    if (a.t >= 1) {
      a.jumping = false;
      meshRef.current.position.copy(a.end);
      lastPosRef.current.copy(a.end);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerDown={(e) => { e.stopPropagation(); onClick(id); }}
    >
  <primitive object={PIECE_GEOMETRY} attach="geometry" />
      <meshStandardMaterial color={Colors.white.lightWhite} transparent opacity={1} />
      {isQueen && (
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <primitive object={QUEEN_RING_GEOMETRY} attach="geometry" />
          <meshStandardMaterial
            color={'#FFD54A'}
            emissive={'#9E7400'}
            emissiveIntensity={1.1}
            metalness={0.9}
            roughness={0.25}
            transparent
            opacity={0.95}
            side={DoubleSide}   // <- important
          />
        </mesh>
      )}
    </mesh>
  );
};
export default React.memo(PiecesLight, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.isQueen === next.isQueen &&
    prev.isJump === next.isJump &&
    prev.position[0] === next.position[0] &&
    prev.position[1] === next.position[1] &&
    prev.position[2] === next.position[2]
  );
});