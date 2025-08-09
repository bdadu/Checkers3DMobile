import React, { useRef } from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

interface Board3DProps {
  pieces: any[];
  boardSize: number;
  squareSize: number;
  jumpingPieces: { [key: string]: boolean };
  selectedPieceId: string | null;
}

export default function Board3D({ pieces, boardSize, squareSize, jumpingPieces, selectedPieceId }: Board3DProps) {
  const requestRef = useRef<number>();

  const renderScene = async (gl: any) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    camera.position.set(0, 5, 7);
    camera.lookAt(0, 0, 0);

    // Tabla (grid)
    const boardGeometry = new THREE.PlaneGeometry(boardSize * squareSize, boardSize * squareSize);
    const boardMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.rotation.x = -Math.PI / 2;
    scene.add(board);

    // Piese
    pieces.forEach(piece => {
      const geometry = new THREE.SphereGeometry(squareSize * 0.4, 32, 32);
      let color = piece.type === 'D' ? 0x222222 : 0xeeeeee;
      if (piece.id === selectedPieceId) color = 0xffd700; // highlight selected
      if (jumpingPieces[piece.id]) color = 0xff0000; // highlight jumping
      const material = new THREE.MeshStandardMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(piece.position[0], 0.2, piece.position[2]);
      scene.add(mesh);
    });

    // Lumina
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };

  return (
    <GLView
      style={{ width: '100%', height: 350 }}
      onContextCreate={renderScene}
    />
  );
}
