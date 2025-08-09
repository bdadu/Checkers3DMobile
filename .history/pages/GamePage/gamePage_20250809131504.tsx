import { Text as DreiText, OrbitControls } from '@react-three/drei/native';
import { Canvas } from '@react-three/fiber/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text as RNText, StyleSheet, View } from 'react-native';

import GameLevelSelection from '../../components/GameLevelSelection';
import { boardMatrices, generateInitialPieces, handleBotMove } from '../../utils/Functions';
import ExplosionEffect from './Components/ExplosionEffect/explosionEffect';
import PiecesDark from './Components/PiecesDark';
import PiecesLight from './Components/PiecesLight';
import ScoreCard from './Components/ScoreCard';

function GamePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<[number, number] | null>(null);
  const [groupPosition, setGroupPosition] = useState<[number, number, number]>([0, 0, 0]);

  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [scoreDark, setScoreDark] = useState(0);
  const [scoreLight, setScoreLight] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<'D' | 'L'>('D');
  const [explosions, setExplosions] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'Easy' | 'Medium' | 'Hard' | null>(null);
  const [jumpingPieces, setJumpingPieces] = useState<Record<string, boolean>>({});

  const [pieces, setPieces] = useState<any[]>([]);

  const size = 8;
  const squareSize = 0.5;
  const boardsY: [number, number, number] = [1, -0.5, -2];

  const piecesRef = useRef(pieces);
  const currentPlayerRef = useRef(currentPlayer);

  const resetPiecesToStart = useCallback(() => {
    if (!selectedLevel) return;
    const newPieces = generateInitialPieces(selectedLevel, size, squareSize, boardsY);
    setPieces(newPieces);
  }, [selectedLevel]);

  const handleSelectLevel = useCallback((level: 'Easy' | 'Medium' | 'Hard') => {
    setSelectedLevel(level);
    setScoreDark(0);
    setScoreLight(0);
    setCurrentPlayer('D');
    setIsGameOver(false);
    setExplosions([]); // Reset explosion effects
    const newPieces = generateInitialPieces(level, size, squareSize, boardsY);
    setPieces(newPieces);
  }, []);

  const allBoards = useMemo(
    () =>
      boardMatrices(
        boardsY,
        size,
        squareSize,
        setCurrentPlayer,
        setPieces,
        setSelectedPieceId,
        selectedPieceId,
        pieces,
        currentPlayer,
        setJumpingPieces,
        setExplosions,
        setScoreLight,
        setScoreDark
      ).flat(2),
    [
      boardsY,
      size,
      squareSize,
      setCurrentPlayer,
      setPieces,
      setSelectedPieceId,
      selectedPieceId,
      pieces,
      currentPlayer,
      setJumpingPieces,
      setExplosions,
      setScoreLight,
      setScoreDark,
    ]
  );

  const handlePieceClick = useCallback((id: string, color?: string) => {
    setSelectedPieceId(id);
    console.log('Selected piece color:', color);
  }, []);

  // Touch handlers (înlocuit pointer events web)
  const onTouchStart = (e: any) => {
    const t = e.nativeEvent.touches?.[0];
    if (!t) return;
    setIsDragging(true);
    setDragStart([t.pageX, t.pageY]);
  };

  const onTouchMove = (e: any) => {
    if (!isDragging || !dragStart) return;
    const t = e.nativeEvent.touches?.[0];
    if (!t) return;

    const dx = t.pageX - dragStart[0];
    const dz = t.pageY - dragStart[1];

    setGroupPosition(([x, y, z]) => [x + dx * 0.01, 0, z + dz * 0.01]);
    setDragStart([t.pageX, t.pageY]);
  };

  const onTouchEnd = () => setIsDragging(false);

  const handlePlayAgain = useCallback(() => {
    setIsGameOver(false);
    setScoreDark(0);
    setScoreLight(0);
    setSelectedLevel(null); // back la selecția de nivel
    setCurrentPlayer('D');
    resetPiecesToStart();
  }, [resetPiecesToStart]);

  useEffect(() => {
    if (selectedLevel === 'Hard') {
      if (scoreDark >= 36 || scoreLight >= 36) setIsGameOver(true);
    }
    if (selectedLevel === 'Medium') {
      if (scoreDark >= 32 || scoreLight >= 32) setIsGameOver(true);
    }
    if (selectedLevel === 'Easy') {
      if (scoreDark >= 28 || scoreLight >= 28) setIsGameOver(true);
    }
  }, [scoreDark, scoreLight, selectedLevel]);

  useEffect(() => {
    if (selectedLevel) {
      const newPieces = generateInitialPieces(selectedLevel, size, squareSize, boardsY);
      setPieces(newPieces);
    }
  }, [selectedLevel]);

  useEffect(() => {
    piecesRef.current = pieces;
  }, [pieces]);

  useEffect(() => {
    currentPlayerRef.current = currentPlayer;
  }, [currentPlayer]);

  useEffect(() => {
    if (currentPlayer === 'L' && !isGameOver && selectedLevel) {
      handleBotMove(
        selectedLevel,
        piecesRef,
        currentPlayerRef,
        size,
        squareSize,
        boardsY,
        setJumpingPieces,
        setExplosions,
        setPieces,
        setScoreLight,
        setScoreDark,
        setCurrentPlayer
      );
    }
  }, [currentPlayer, isGameOver, selectedLevel]);

  if (!selectedLevel) {
    // Creează o versiune RN a GameLevelSelection (Pressable + Text)
    return <GameLevelSelection onSelectLevel={(level: string) => handleSelectLevel(level as 'Easy' | 'Medium' | 'Hard')} />;
  }

  if (isGameOver) {
    const winnerText = scoreDark > scoreLight ? 'WINNER' : 'YOU LOSE';
    // Fă o versiune RN a GameOver sau afișează basic
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <RNText style={styles.gameOverText}>{winnerText}</RNText>
          <Pressable style={styles.playAgainBtn} onPress={handlePlayAgain}>
            <RNText style={styles.playAgainText}>START AGAIN</RNText>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <Canvas camera={{ position: [0, 3, 7], fov: 60 }}>
        <ambientLight intensity={0.8} />
        {/* Preload font (DreiText funcționează pe native via expo-asset) */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
  <circleGeometry args={[0.15, 32]} /> {/* raza 0.15, 32 segmente pentru netezime */}
  <meshStandardMaterial color="black" />
</mesh>

        <group position={groupPosition}>
          {allBoards}
          {pieces.map((piece) => {
            const isJump = !!jumpingPieces[piece.id];
            return piece.type === 'D' ? (
              <PiecesDark
                key={piece.id}
                id={piece.id}
                position={piece.position}
                onClick={handlePieceClick}
                isQueen={piece.isQueen}
                isSelected={piece.id === selectedPieceId}
                isJump={isJump}
              />
            ) : (
              <PiecesLight
                key={piece.id}
                id={piece.id}
                position={piece.position}
                onClick={handlePieceClick}
                isQueen={piece.isQueen}
                isJump={isJump}
              />
            );
          })}
          {explosions.map((explosion) => (
            <ExplosionEffect
              key={explosion.id}
              position={explosion.position}
              onComplete={() => setExplosions((prev) => prev.filter((e) => e.id !== explosion.id))}
            />
          ))}
        </group>

        <OrbitControls />
      </Canvas>

      <ScoreCard
        scoreDark={scoreDark}
        scoreLight={scoreLight}
        style={{ position: 'absolute', top: 60, left: 20 }}
      />

      <Pressable style={[styles.playAgainBtn, { position: 'absolute', bottom: 40, alignSelf: 'center' }]} onPress={handlePlayAgain}>
        <RNText style={styles.playAgainText}>START AGAIN</RNText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  playAgainBtn: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  playAgainText: {
    color: 'white',
    fontSize: 18,
  },
});

export default GamePage;

