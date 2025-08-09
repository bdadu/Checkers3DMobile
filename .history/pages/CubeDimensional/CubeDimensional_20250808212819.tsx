import { Canvas, useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';
import { backgroundImage } from '../../utils/Styles';
import * as THREE from 'three';

function Cube({ position, size, color }: { position: [number, number, number]; size: [number, number, number]; color: string }) {
  const ref = useRef<any>();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 5;
      ref.current.position.z = Math.sin(state.clock.elapsedTime) * 2;
    }
  });
  return (
    <mesh position={position} ref={ref}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function CubeDimensional() {
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <directionalLight position={[0, 0, 2]} intensity={0.8} />
          <Cube position={[0, 0, 0]} size={[2, 2, 2]} color={'#AB886D'} />
        </Canvas>
      </View>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
