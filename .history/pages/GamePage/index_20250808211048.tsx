import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';

import { OrbitControls, Text } from '@react-three/drei'
import PiecesDark from './components/PiecesDark';
import PiecesLight from './components/PiecesLight';
import ScoreCard from './components/ScoreCard';
import ExplosionEffect from './components/ExplosionEffect';
import GameOver from '../../shared/GameOver';
import GameLevelSelection from "../../shared/GameLevelSelection";
import Button from "@mui/material/Button";
import { boardMatrices, generateInitialPieces, handleBotMove } from '../../utils/Functions';
import { gameGridStyled, startAgainStyleButton } from '../../utils/Style';

export default function GamePage() {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [groupPosition, setGroupPosition] = useState([0, 0, 0]);
    const [selectedPieceId, setSelectedPieceId] = useState(null);
    const [scoreDark, setScoreDark] = useState(0);
    const [scoreLight, setScoreLight] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState('D');
    const [explosions, setExplosions] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [jumpingPieces, setJumpingPieces] = useState({});

    const [pieces, setPieces] = useState([]);

    const size = 8;
    const squareSize = 0.5;
    const boardsY = [1, -0.5, -2];

    const piecesRef = useRef(pieces);
    const currentPlayerRef = useRef(currentPlayer);

    const resetPiecesToStart = () => {
        const newPieces = generateInitialPieces(selectedLevel, size, squareSize, boardsY);
        setPieces(newPieces);
    };

    const handleSelectLevel = (level) => {
        setSelectedLevel(level);
        setScoreDark(0);
        setScoreLight(0);
        setCurrentPlayer('D');
        setIsGameOver(false);
        setExplosions([]); // Reset explosion effects
        const newPieces = generateInitialPieces(level, size, squareSize, boardsY);
        setPieces(newPieces);
    };

    const allBoards = boardMatrices(boardsY,
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
        setScoreDark).flat(2)

    const handlePieceClick = (id, color) => {
        setSelectedPieceId(id, color);
        console.log('Selected piece color:', color);
    };

    const handlePointerDown = (e) => {
        setIsDragging(true);
        setDragStart([e.clientX, e.clientY]); // Store the starting point of the drag
    };

    // Handle pointer move event to move the group
    const handlePointerMove = (e) => {
        if (!isDragging) return;

        const dx = e.clientX - dragStart[0]; // Change in X
        const dz = e.clientY - dragStart[1]; // Change in Y (we use Y for Z axis movement)

        // Update group position
        setGroupPosition([groupPosition[0] + dx * 0.01, 0, groupPosition[2] + dz * 0.01]);

        setDragStart([e.clientX, e.clientY]); // Update the start point for next move
    };

    // Handle pointer up event to stop dragging
    const handlePointerUp = () => {
        setIsDragging(false);
    };

    const handlePlayAgain = () => {
        setIsGameOver(false);
        setScoreDark(0);
        setScoreLight(0);
        setSelectedLevel(null); // Reset level selection to show level selection page
        setCurrentPlayer('D');
        resetPiecesToStart();
    };

    useEffect(() => {
        console.log('Game Over state:', isGameOver); // Debugging log
        if (selectedLevel === "Hard") {
            if (scoreDark >= 36 || scoreLight >= 36) {
                setIsGameOver(true);
            }
        }
        if (selectedLevel === "Medium") {
            if (scoreDark >= 32 || scoreLight >= 32) {
                setIsGameOver(true);
            }
        }
        if (selectedLevel === "Easy") {
            if (scoreDark >= 28 || scoreLight >= 28) {
                setIsGameOver(true);
            }
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
        console.log('useEffect triggered with currentPlayer:', currentPlayer); // Debugging log
        console.log('Current pieces state:', pieces); // Debugging log
        if (currentPlayer === 'L' && !isGameOver) {
            console.log('Bot turn started'); // Debugging log
            handleBotMove(selectedLevel,
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
                setCurrentPlayer);
        }
    }, [currentPlayer, isGameOver]);

    if (!selectedLevel) {
        return <GameLevelSelection onSelectLevel={handleSelectLevel} />;
    }

    if (isGameOver) {
        const winnerText = scoreDark > scoreLight ? 'WINNER' : 'YOU LOSE';
        return (
            <div style={gameGridStyled}>
                <GameOver onPlayAgain={handlePlayAgain} winnerText={winnerText} />
            </div>
        );
    }

    return (
        <div style={gameGridStyled}>
            <Canvas
                camera={{ position: [0, 3, 7], fov: 60 }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}>
                <ambientLight intensity={0.8} />
                {/* 👑 Pre-load font for Text to avoid flicker */}
                <Text
                    visible={false}
                    position={[0, 0, 0]}
                    fontSize={0.2}
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                    rotation={[-Math.PI / 2, 0, 0]}
                >
                    Q
                </Text>
                <group>
                    {allBoards}
                    {pieces.map((piece) => {
                        const isJump = !!jumpingPieces[piece.id];

                        return piece.type === 'D' ? (
                            <PiecesDark
                                key={piece.id}
                                id={piece.id}
                                camera={{ position: [2, 2, 5] }}
                                position={piece.position}
                                onClick={handlePieceClick}
                                isQueen={piece.isQueen}
                                isSelected={piece.id === selectedPieceId} // Pass isSelected prop
                                isJump={isJump} // Transmit isJump prop
                            />
                        ) : (
                            <PiecesLight
                                key={piece.id}
                                id={piece.id}
                                camera={{ position: [2, 2, 5] }}
                                position={piece.position}
                                onClick={handlePieceClick}
                                isQueen={piece.isQueen}
                                isSelected={piece.id === selectedPieceId} // Pass isSelected prop
                                isJump={isJump} // Transmit isJump prop pentru piesele "L"
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
                </group>

                <OrbitControls />
            </Canvas>
            <ScoreCard
                scoreDark={scoreDark}
                scoreLight={scoreLight}
                isGameOver={isGameOver}
                isGameStarted={isGameStarted}
                setIsGameOver={setIsGameOver}
                style={{
                    position: 'absolute',
                    top: '60px',
                    left: '90px',
                    zIndex: 1000,
                }}
            />
            <Button
                onClick={handlePlayAgain}
                style={startAgainStyleButton}
            >
                START AGAIN
            </Button>
        </div>
    );
};