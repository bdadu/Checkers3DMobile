import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

interface Particle {
  position: [number, number, number];
  velocity: [number, number, number];
}

interface ExplosionEffectProps {
  position: [number, number, number];
  onComplete: () => void;
}

const ExplosionEffect: React.FC<ExplosionEffectProps> = ({ position, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate random particles for the explosion
    const generatedParticles = Array.from({ length: 100 }, () => ({
      position: [
        position[0] + (Math.random() - 0.5) * 0.5,
        position[1] + (Math.random() - 0.5) * 0.5,
        position[2] + (Math.random() - 0.5) * 0.5,
      ] as [number, number, number],
      velocity: [
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
      ] as [number, number, number],
    }));
    setParticles(generatedParticles);

    // Automatically call onComplete after 1 second
    const timeout = setTimeout(() => {
      onComplete();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [position, onComplete]);

  useFrame(() => {
    setParticles((prevParticles) =>
      prevParticles.map((particle) => ({
        ...particle,
        position: [
          particle.position[0] + particle.velocity[0],
          particle.position[1] + particle.velocity[1],
          particle.position[2] + particle.velocity[2],
        ] as [number, number, number],
      }))
    );
  });

  return (
    <group>
      {particles.map((particle, index) => (
        <mesh key={index} position={particle.position}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="gold" />
        </mesh>
      ))}
    </group>
  );
};

export default ExplosionEffect;
