import { Canvas, useFrame } from '@react-three/fiber/native';
// OrbitControls poate intra în conflict cu gesturile native; îl scoatem
// import { OrbitControls } from '@react-three/drei';
import type { RootStackParamList } from '@/App';
import GameOver from '@/components/GameOver';
import { boardMatrices, generateInitialPieces, handleBotMove } from '@/utils/Functions';
import { backgroundImage, styles } from '@/utils/Styles';
import { CommonActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ImageBackground, Pressable, Text as RNText, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue } from 'react-native-reanimated';
import ExplosionEffect from './Components/ExplosionEffect/explosionEffect';
import PiecesDark from './Components/PiecesDark';
import PiecesLight from './Components/PiecesLight';
import ScoreCard from './Components/ScoreCard';

// Componentă internă care stă sub <Canvas> și poate folosi R3F hooks
function BoardGroup({
  position,
  allBoards,
  pieces,
  selectedPieceId,
  jumpingPieces,
  explosions,
  setExplosions,
  handlePieceClick,
  rotX,
  rotY,
  scaleSV,
}: {
  position: [number, number, number];
  allBoards: React.ReactNode;
  pieces: any[];
  selectedPieceId: string | null;
  jumpingPieces: Record<string, boolean>;
  explosions: any[];
  setExplosions: React.Dispatch<React.SetStateAction<any[]>>;
  handlePieceClick: (id: string) => void;
  rotX: Animated.SharedValue<number>;
  rotY: Animated.SharedValue<number>;
  scaleSV: Animated.SharedValue<number>;
}) {
  const groupRef = useRef<any>(null);
  // Entrance animation (tabla "vine" din spate pe axa Z)
  const entranceRef = useRef<{ start: number; done: boolean }>({ start: Date.now(), done: false });
  const ENTRANCE_START_Z = -35; // cât de departe începe
  const ENTRANCE_DURATION = 1200; // ms

  useFrame(() => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    // Calculează progres intrare
    if (!entranceRef.current.done) {
      const now = Date.now();
      let t = (now - entranceRef.current.start) / ENTRANCE_DURATION;
      if (t >= 1) {
        t = 1;
        entranceRef.current.done = true;
      }
      // easing easeOutCubic
      const ease = 1 - Math.pow(1 - t, 3);
      const targetZ = position[2];
      const currentZ = ENTRANCE_START_Z + (targetZ - ENTRANCE_START_Z) * ease;
      // Setează poziția curentă (respectă x,y din state + z animat)
      g.position.set(position[0], position[1], currentZ);
      // Opțional: mic efect de scale la intrare
      const baseScale = scaleSV.value;
      const introScale = 0.85 + 0.15 * ease; // începe puțin mai mică
      g.scale.set(baseScale * introScale, baseScale * introScale, baseScale * introScale);
    } else {
      // După intrare folosim poziția/scale normale
      g.position.set(position[0], position[1], position[2]);
      const s = scaleSV.value;
      g.scale.set(s, s, s);
    }
    g.rotation.x = rotX.value;
    g.rotation.y = rotY.value;
  });

  return (
    <group ref={groupRef} position={position}>
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
  );
}

type Level = 'Easy' | 'Medium' | 'Hard';

type GameRouteProp = RouteProp<RootStackParamList, 'Game'>;

function GamePage() {

  const { params } = useRoute<RouteProp<RootStackParamList, 'Game'>>();
  const initialLevel = params?.initialLevel ?? null;
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(initialLevel ?? null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<[number, number] | null>(null);
  // Offset negativ pe axa Z pentru a împinge tabla puțin mai în spate în poziția finală
  const BOARD_Z_OFFSET = -2.5; // ajustează aici cât de mult vrei (ex: -1, -1.5, -3)
  const [groupPosition, setGroupPosition] = useState<[number, number, number]>([0, 0, BOARD_Z_OFFSET]);

  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [scoreDark, setScoreDark] = useState(0);
  const [scoreLight, setScoreLight] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<'D' | 'L'>('D');
  const [explosions, setExplosions] = useState<any[]>([]);
  const [jumpingPieces, setJumpingPieces] = useState<Record<string, boolean>>({});
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [pieces, setPieces] = useState<any[]>([]);
  // groupRef mutat în BoardGroup

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
    // Translatarea tablei doar cu două degete, ca să nu intre în conflict cu rotirea cu un deget
    if ((e.nativeEvent.touches?.length ?? 0) < 2) return;
    const t = e.nativeEvent.touches?.[0];
    if (!t) return;
    setIsDragging(true);
    setDragStart([t.pageX, t.pageY]);
  };
  const onTouchMove = (e: any) => {
    if (!isDragging || !dragStart) return;
    if ((e.nativeEvent.touches?.length ?? 0) < 2) return;
    const t = e.nativeEvent.touches?.[0];
    if (!t) return;
    const dx = t.pageX - dragStart[0];
    const dz = t.pageY - dragStart[1];
    setGroupPosition(([x, y, z]) => [
      x + dx * 0.01,
      0,
      z + dz * 0.01
    ]);
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

  // Rotire cu un singur deget (drag orizontal)
  const baseRotX = useSharedValue(0);
  const baseRotY = useSharedValue(0);
  const panRotate = Gesture.Pan()
    .maxPointers(1)
    .onStart(() => {
      baseRotX.value = rotX.value;
      baseRotY.value = rotY.value;
    })
    .onUpdate((e) => {
      // Sensibilitate: 0.01 radiani per pixel pe Y, 0.008 pe X
      const newY = baseRotY.value + e.translationX * 0.01;
      let newX = baseRotX.value + e.translationY * 0.008;
      // Clamp X pentru a evita răsturnarea (±60°)
      const MAX_X = Math.PI / 3;
      const MIN_X = -Math.PI / 3;
      if (newX > MAX_X) newX = MAX_X;
      if (newX < MIN_X) newX = MIN_X;
      rotY.value = newY;
      rotX.value = newX;
    });

  const composedGesture = Gesture.Simultaneous(rotationGesture, pinchGesture, panRotate);

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
              <BoardGroup
                position={groupPosition}
                allBoards={allBoards}
                pieces={pieces}
                selectedPieceId={selectedPieceId}
                jumpingPieces={jumpingPieces}
                explosions={explosions}
                setExplosions={setExplosions}
                handlePieceClick={handlePieceClick}
                rotX={rotX}
                rotY={rotY}
                scaleSV={scaleSV}
              />
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