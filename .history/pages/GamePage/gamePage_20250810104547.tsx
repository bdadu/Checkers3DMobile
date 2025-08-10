import { OrbitControls } from '@react-three/drei/native';
import { Canvas } from '@react-three/fiber/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text as RNText, StyleSheet} from 'react-native';
import GameLevelSelection from '../../components/GameLevelSelection';
import { boardMatrices, generateInitialPieces, handleBotMove } from '../../utils/Functions';
import ExplosionEffect from './Components/ExplosionEffect/explosionEffect';
import PiecesDark from './Components/PiecesDark';
import PiecesLight from './Components/PiecesLight';
import ScoreCard from './Components/ScoreCard';
import { Image, ImageBackground, View } from 'react-native';
import { styles} from '../../utils/Styles';
// 👇 ADĂUGAT: tip pentru prop
type GamePageProps = { initialLevel?: 'Easy' | 'Medium' | 'Hard' };

function GamePage({ initialLevel }: GamePageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<[number, number] | null>(null);
  const [groupPosition, setGroupPosition] = useState<[number, number, number]>([0, 0, 0]);

  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [scoreDark, setScoreDark] = useState(0);
  const [scoreLight, setScoreLight] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // 👇 IMPORTANT: pornește cu nivelul primit din Home (dacă e)
  const [selectedLevel, setSelectedLevel] = useState<'Easy' | 'Medium' | 'Hard' | null>(initialLevel ?? null);

  const [currentPlayer, setCurrentPlayer] = useState<'D' | 'L'>('D');
  const [explosions, setExplosions] = useState<any[]>([]);
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
    setExplosions([]);
    const newPieces = generateInitialPieces(level, size, squareSize, boardsY);
    setPieces(newPieces);
  }, []);

  // 👇 Garantează generarea pieselor când avem un nivel (inclusiv la mount cu initialLevel)
  useEffect(() => {
    if (selectedLevel) {
      const newPieces = generateInitialPieces(selectedLevel, size, squareSize, boardsY);
      setPieces(newPieces);
    }
  }, [selectedLevel]);

  useEffect(() => { piecesRef.current = pieces; }, [pieces]);
  useEffect(() => { currentPlayerRef.current = currentPlayer; }, [currentPlayer]);

  useEffect(() => {
    if (selectedLevel === 'Hard' && (scoreDark >= 36 || scoreLight >= 36)) setIsGameOver(true);
    if (selectedLevel === 'Medium' && (scoreDark >= 32 || scoreLight >= 32)) setIsGameOver(true);
    if (selectedLevel === 'Easy' && (scoreDark >= 28 || scoreLight >= 28)) setIsGameOver(true);
  }, [scoreDark, scoreLight, selectedLevel]);

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
      boardsY, size, squareSize,
      setCurrentPlayer, setPieces, setSelectedPieceId,
      selectedPieceId, pieces, currentPlayer,
      setJumpingPieces, setExplosions, setScoreLight, setScoreDark
    ]
  );

  const handlePieceClick = useCallback((id: string) => setSelectedPieceId(id), []);

  // touch pan pt. mutat tabla
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
    setSelectedLevel(null);
    setCurrentPlayer('D');
    resetPiecesToStart();
  }, [resetPiecesToStart]);

  if (!selectedLevel) {
    return <GameLevelSelection onSelectLevel={(level) => handleSelectLevel(level as any)} />;
  }

  if (isGameOver) {
    const winnerText = scoreDark > scoreLight ? 'WINNER' : 'YOU LOSE';
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
    <View style={{ flex: 1 }}>
    <View style={styles.gameGrid} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
  
      {/* 👇 Asigură-te că Canvas are stil flex:1 */}
      <Canvas style={{ flex: 1 }} camera={{ position: [0, 3, 7], fov: 60 }}>
        {/* Lumină suficientă și un obiect de test ca să confirmăm randarea */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 10, 5]} intensity={0.6} />

      
       

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

      <Pressable style={[styles.startAgainButton, { position: 'absolute', bottom: 40 }]} onPress={handlePlayAgain}>
        <RNText style={styles.text}>START AGAIN</RNText>
      </Pressable>
     
    </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backgroundImage: { resizeMode: "cover" },
  gameOverText: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
});

export default GamePage;