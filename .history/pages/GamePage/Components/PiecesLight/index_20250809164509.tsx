import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import Colors from '../../../../constants/Colors';
import { Vector3 } from 'three';

interface PiecesLightProps {
  id: string;
  position: [number, number, number];
  onClick: (id: string) => void;
  isQueen?: boolean;
  isBotMoving?: boolean;
  isJump?: boolean;
}
const DURATION = 0.6;          // secunde – mai scurt = mai sprinten
const ARC_HEIGHT = 0.8;   
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const bezier2 = (a: Vector3, b: Vector3, c: Vector3, t: number, out: Vector3) => {
  // (1-t)^2 * a + 2(1-t)t * b + t^2 * c
  const s = 1 - t;
  out.set(
    s*s*a.x + 2*s*t*b.x + t*t*c.x,
    s*s*a.y + 2*s*t*b.y + t*t*c.y,
    s*s*a.z + 2*s*t*b.z + t*t*c.z
  );
  return out;
};

const PiecesLight: React.FC<PiecesLightProps> = ({ id, position, onClick, isQueen, isBotMoving, isJump }) => {
  const meshRef = useRef<any>(null);
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
      const current = meshRef.current.position.clone();
      const end = new Vector3(...position);
      // punctul de control: la mijlocul segmentului, ridicat pe Y
      const ctrl = current.clone().lerp(end, 0.5);
      ctrl.y += ARC_HEIGHT;

      animRef.current = {
        t: 0,
        jumping: true,
        duration: DURATION,
        start: current,
        end,
        ctrl,
      };
    } else {
      // mutare simplă (fără arc)
      meshRef.current.position.set(...position);
      animRef.current.jumping = false;
      animRef.current.t = 0;
    }
  }, [isJump, position]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const a = animRef.current;
    if (a.jumping) {
      // avansează timpul independent de FPS
      a.t = Math.min(1, a.t + delta / a.duration);

      // Easing ușor (easeInOutQuad) ca să fie mai „natural”
      const t = a.t < 0.5 ? 2*a.t*a.t : -1 + (4 - 2*a.t)*a.t;

      bezier2(a.start, a.ctrl, a.end, t, tmp.current);
      meshRef.current.position.copy(tmp.current);

      if (a.t >= 1) {
        a.jumping = false;
        meshRef.current.position.copy(a.end);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerDown={(e) => { e.stopPropagation(); onClick(id); }}
    >
      <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
      <meshStandardMaterial color={Colors.white.lightWhite} transparent opacity={1} />
      {isQueen && (
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.04, 32]} />
          <meshStandardMaterial color={'#000'} />
        </mesh>
      )}
    </mesh>
  );
};
export