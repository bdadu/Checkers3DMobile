import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button as RNButton } from 'react-native';
import GameLevelSelection from '../../components/GameLevelSelection';
import GameOver from '../../components/GameOver';
import { boardMatrices, generateInitialPieces, handleBotMove } from '../../utils/Functions';
import ScoreCard from './Components/ScoreCard';
import PiecesDark from './Components/PiecesDark';
import PiecesLight from './Components/PiecesLight';
import ExplosionEffect from './Components/ExplosionsEffect';

export default function GamePage() {
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
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [jumpingPieces, setJumpingPieces] = useState<{ [key: string]: boolean }>({});
  const [pieces, setPieces] = useState<any[]>([]);

  const size = 8;
  const squareSize = 0.5;
  const boardsY = [1, -0.5, -2];

  const piecesRef = useRef(pieces);
  const currentPlayerRef = useRef(currentPlayer);

  const resetPiecesToStart = () => {
    if (!selectedLevel) return;
    const newPieces = generateInitialPieces(selectedLevel, size, squareSize, boardsY);
    setPieces(newPieces);
  };

  const handleSelectLevel = (level: string) => {
    setSelectedLevel(level);
    setScoreDark(0);
    setScoreLight(0);
    setCurrentPlayer('D');
    setIsGameOver(false);
    setExplosions([]);
    const newPieces = generateInitialPieces(level, size, squareSize, boardsY);
    setPieces(newPieces);
  };

  const allBoards = boardMatrices(
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
  ).flat(2);

  const handlePieceClick = (id: string, color: string) => {
    setSelectedPieceId(id);
    // console.log('Selected piece color:', color);
  };

  const handlePlayAgain = () => {
    setIsGameOver(false);
    setScoreDark(0);
    setScoreLight(0);
    setSelectedLevel(null);
    setCurrentPlayer('D');
    resetPiecesToStart();
  };

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
  }, [scoreDark, scoreLight]);

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
    return <GameLevelSelection onSelectLevel={handleSelectLevel} />;
  }

  if (isGameOver) {
    const winnerText = scoreDark > scoreLight ? 'WINNER' : 'YOU LOSE';
    return (
      <View style={styles.centered}>
        <GameOver onPlayAgain={handlePlayAgain} winnerText={winnerText} />
      </View>
    );
  }

  // NOTĂ: Pentru 3D real în React Native, trebuie să folosești expo-three/GLView, dar aici păstrăm logica și structura originală.
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Page</Text>
      {/* Tabla și piesele */}
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
            isSelected={piece.id === selectedPieceId}
            isJump={isJump}
          />
        );
      })}
      {explosions.map((explosion) => (
        <ExplosionEffect
          key={explosion.id}
          position={explosion.position}
          onComplete={() =>
            setExplosions((prev) => prev.filter((e) => e.id !== explosion.id))
          }
        />
      ))}
      <ScoreCard
        scoreDark={scoreDark}
        scoreLight={scoreLight}
        style={{ marginTop: 16 }}
      />
      <RNButton title="START AGAIN" onPress={handlePlayAgain} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#493628',
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});