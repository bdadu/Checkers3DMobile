import { Canvas, useFrame } from '@react-three/fiber/native';
// OrbitControls poate intra în conflict cu gesturile native; îl scoatem
// import { OrbitControls } from '@react-three/drei';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text as RNText, StyleSheet } from 'react-native';
import GameLevelSelection from '@/components/GameLevelSelection';
import { boardMatrices, generateInitialPieces, handleBotMove } from '@/utils/Functions';
import ExplosionEffect from './Components/ExplosionEffect/explosionEffect';
import PiecesDark from './Components/PiecesDark';
import PiecesLight from './Components/PiecesLight';
import ScoreCard from './Components/ScoreCard';
import { ImageBackground, View } from 'react-native';
import { styles, backgroundImage } from '@/utils/Styles';
import GameOver from '@/components/GameOver';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/App';
import { CommonActions } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue } from 'react-native-reanimated';

type Level = 'Easy' | 'Medium' | 'Hard';

type GameRouteProp = RouteProp<RootStackParamList, 'Game'>;

function GamePage() {

  const { params } = useRoute<RouteProp<RootStackParamList, 'Game'>>();
  const initialLevel = params?.initialLevel ?? null;
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(initialLevel ?? null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<[number, number] | null>(null);
  const [groupPosition, setGroupPosition] = useState<[number, number, number]>([0, 0, 0]);

  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [scoreDark, setScoreDark] = useState(0);
  const [scoreLight, setScoreLight] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<'D' | 'L'>('D');
  const [explosions, setExplosions] = useState<any[]>([]);
  const [jumpingPieces, setJumpingPieces] = useState<Record<string, boolean>>({});
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [pieces, setPieces] = useState<any[]>([]);
  const groupRef = useRef<any>(null);

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

  // Gesturi pentru rotire + pinch/scale pe întreg grupul (tabla + piese)
  const rotX = useSharedValue(0);
  const rotY = useSharedValue(0);
  const scaleSV = useSharedValue(1);

  const rotationGesture = Gesture.Rotation()
    .onChange((e) => {
      // Rotește în jurul axei Y (stânga-dreapta)
      rotY.value += e.rotation;
    });

  const pinchGesture = Gesture.Pinch()
    .onChange((e) => {
      // Clamp scale între 0.4 și 2 pentru stabilitate
      const s = Math.max(0.4, Math.min(2, e.scale));
      scaleSV.value = s;
    });

  const composedGesture = Gesture.Simultaneous(rotationGesture, pinchGesture);

  // Aplică în fiecare frame rotația și scala direct pe groupRef pentru fluiditate
  useFrame(() => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    g.rotation.x = rotX.value;
    g.rotation.y = rotY.value;
    const s = scaleSV.value;
    g.scale.set(s, s, s);
  });

  const handlePlayAgain = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: 'Home' }, { name: 'GameLevelSelection' }],
      })
    );
  }, [navigation]);

  useEffect(() => {
    if (!selectedLevel) {
      navigation.replace('GameLevelSelection');
    }
  }, [selectedLevel, navigation]);
 
  useEffect(() => {
    if (initialLevel) {
      setSelectedLevel(initialLevel);
    }
  }, [initialLevel]);
  
  if (isGameOver) {
    const winnerText = scoreDark > scoreLight ? 'WINNER' : 'YOU LOSE';
    return (
      <GameOver
        winnerText={winnerText}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <View
        style={styles.gameGrid}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}>
        <GestureDetector gesture={composedGesture}>
          <View style={{ flex: 1 }}>
            <Canvas style={{ flex: 1 }} camera={{ position: [0, 3, 7], fov: 60 }}>
              <ambientLight intensity={0.9} />
              <directionalLight position={[5, 10, 5]} intensity={0.6} />
              <group ref={groupRef} position={groupPosition}>
                {allBoards}
                {pieces.map((piece) => {
                  const isJump = !!jumpingPieces[piece.id];
                  return piece.type === 'D' ? (
                    <PiecesDark key={piece.id} id={piece.id} position={piece.position} onClick={handlePieceClick}
                      isQueen={piece.isQueen} isSelected={piece.id === selectedPieceId} isJump={isJump} />
                  ) : (
                    <PiecesLight key={piece.id} id={piece.id} position={piece.position} onClick={handlePieceClick}
                      isQueen={piece.isQueen} isJump={isJump} />
                  );
                })}
                {explosions.map((explosion) => (
                  <ExplosionEffect key={explosion.id} position={explosion.position}
                    onComplete={() => setExplosions(prev => prev.filter(e => e.id !== explosion.id))} />
                ))}
              </group>
              {/* <OrbitControls /> eliminat pentru a evita conflicte cu gesturile native */}
            </Canvas>
          </View>
        </GestureDetector>

        <ScoreCard scoreDark={scoreDark} scoreLight={scoreLight}
          style={{ position: 'absolute', top: 60, left: 20 }} />
        <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' }}>
          <Pressable style={[styles.startAgainButton, { position: 'absolute', bottom: 40 }]} onPress={handlePlayAgain}>
            <RNText style={styles.text}>START AGAIN</RNText>
          </Pressable>
        </View>
      </View>
    </ImageBackground >
  );
}

export default GamePage;