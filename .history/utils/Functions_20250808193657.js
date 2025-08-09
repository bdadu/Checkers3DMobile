import { BotLogic } from "../BotMoveLogic/BotLogic";
import Squares from "../components/Squares";
import Colors from "../constants/Colors";

export function generateInitialPieces(level, size, squareSize, boardsY) {
    const pieces = [];

    const addPieces = (type, rows, boardIndex) => {
        rows.forEach(row => {
            for (let col = 0; col < size; col++) {
                if ((row + col) % 2 === 0) {
                    const x = (col - size / 2) * squareSize;
                    const z = (size / 2 - row) * squareSize;
                    pieces.push({
                        id: `piece-${type}-${row}-${col}-${boardIndex}`,
                        type,
                        position: [x, boardsY[boardIndex] + 0.05, z],
                        isQueen: false,
                    });
                }
            }
        });
    };

    if (level === "Hard") {
        boardsY.forEach((_, i) => {
            addPieces('D', [0, 1, 2], i);
            addPieces('L', [5, 6, 7], i);
        });
    } else if (level === "Medium") {
        addPieces('D', [0, 1, 2], 0);
        addPieces('L', [5, 6, 7], 0);
        addPieces('D', [0, 1], 1);
        addPieces('L', [6, 7], 1);
        addPieces('D', [0, 1, 2], 2);
        addPieces('L', [5, 6, 7], 2);
    } else if (level === "Easy") {
        addPieces('D', [0, 1, 2], 0);
        addPieces('L', [5, 6, 7], 0);
        addPieces('D', [0], 1);
        addPieces('L', [7], 1);
        addPieces('D', [0, 1, 2], 2);
        addPieces('L', [5, 6, 7], 2);
    }

    return pieces;
}

export const boardMatrices = (boardsY, size, squareSize, setCurrentPlayer, setPieces,
    setSelectedPieceId,
    selectedPieceId,
    pieces,
    currentPlayer,
    setJumpingPieces,
    setExplosions,
    setScoreLight,
    setScoreDark) => {
    return boardsY.map((yPos) => {
        const boardMatrix = [];
        for (let row = 0; row < size; row++) {
            const rowSquares = [];
            for (let col = 0; col < size; col++) {
                const x = (col - size / 2) * squareSize;
                const z = (size / 2 - row) * squareSize;
                const color = (row + col) % 2 === 0 ? Colors.brown.mediumBrown : Colors.beige.lightBeige2;

                rowSquares.push(
                    <Squares
                        key={`square-${yPos}-${row}-${col}`}
                        position={[x, yPos, z]}
                        size={[squareSize, 0.1, squareSize]}
                        color={color}
                        onPress={() => handleSquareClick([x, yPos, z], 
                            color, 
                            setCurrentPlayer,
                            setPieces,
                            setSelectedPieceId,
                            selectedPieceId,
                            pieces,
                            currentPlayer,
                            size,
                            squareSize,
                            boardsY,
                            setJumpingPieces,
                            setExplosions,
                            setScoreLight,
                            setScoreDark)}
                    />
                );
            }
            boardMatrix.push(rowSquares);
        }
        return boardMatrix;
    });
};

export const handleBotMove = (
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
) => {
    const botMove = BotLogic.makeMove(selectedLevel, piecesRef.current, currentPlayerRef.current, size, squareSize, boardsY);
    if (botMove) {
        if (botMove.isCapture) {
            setJumpingPieces((prev) => ({ ...prev, [botMove.pieceId]: true }));
            setTimeout(() => {
                setJumpingPieces((prev) => {
                    const updated = { ...prev };
                    delete updated[botMove.pieceId];
                    return updated;
                });
            }, 1000);

            const capturedPiece = piecesRef.current.find(p => p.id === botMove.capturedPieceId);

            setExplosions((prev) => [
                ...prev,
                {
                    id: `explosion-${capturedPiece.id}-${Date.now()}`,
                    position: capturedPiece.position,
                },
            ]);
        }

        setPieces(prevPieces => {
            const updatedPieces = prevPieces.map(piece => {
                if (piece.id === botMove.pieceId) {
                    const shouldPromote =
                        !piece.isQueen &&
                        (
                            (piece.type === 'L' && Math.abs(botMove.targetPosition[2] - ((size / 2) * squareSize)) < 0.1) ||
                            (piece.type === 'D' && Math.abs(botMove.targetPosition[2] - (-(size / 2) * squareSize)) < 0.1)
                        );

                    return {
                        ...piece,
                        position: botMove.targetPosition,
                        isQueen: shouldPromote ? true : piece.isQueen,
                    };
                }
                return piece;
            });

            if (botMove.isCapture) {
                const capturedPiece = prevPieces.find(p => p.id === botMove.capturedPieceId);
                if (capturedPiece.type === 'D') {
                    setScoreLight(prevScore => prevScore + 1);
                } else if (capturedPiece.type === 'L') {
                    setScoreDark(prevScore => prevScore + 1);
                }

                return updatedPieces.filter(piece => piece.id !== botMove.capturedPieceId);
            }

            return updatedPieces;
        });

        setTimeout(() => {
            setCurrentPlayer('D');
        }, 2000);
    } else {
        console.log('No valid moves for bot');
    }
};

export function handleSquareClick(newPos,
    squareColor,
    setCurrentPlayer,
    setPieces,
    setSelectedPieceId,
    selectedPieceId,
    pieces,
    currentPlayer,
    size,
    squareSize,
    boardsY,
    setJumpingPieces,
    setExplosions,
    setScoreLight,
    setScoreDark) {
    if (!selectedPieceId) {
        console.log('No piece selected');
        return;
    }
    const selected = pieces.find(p => p.id === selectedPieceId);
    if (!selected) {
        console.log('Selected piece not found');
        return;
    }

    if (selected.type !== currentPlayer) {
        console.log('Cannot move bot pieces');
        return;
    }

    if (squareColor !== Colors.brown.mediumBrown) {
        return;
    }

    const tolerance = 0.1;
    const [curX, curY, curZ] = selected.position;
    const deltaX = newPos[0] - curX;
    const deltaZ = newPos[2] - curZ;

    const isSimpleMove = Math.abs(Math.abs(deltaX) - squareSize) <= tolerance &&
        Math.abs(Math.abs(deltaZ) - squareSize) <= tolerance &&
        Math.abs(newPos[1] - curY) <= Math.abs(boardsY[1] - boardsY[0]) + tolerance;

    const isJumpMove = Math.abs(Math.abs(deltaX) - 2 * squareSize) <= tolerance &&
        Math.abs(Math.abs(deltaZ) - 2 * squareSize) <= tolerance &&
        Math.abs(newPos[1] - curY) <= Math.abs(boardsY[2] - boardsY[0]) + tolerance;

    if (!isSimpleMove && !isJumpMove) {
        console.log('Invalid move type');
        return;
    }

    const targetX = Math.round(newPos[0] / squareSize) * squareSize;
    const targetZ = Math.round(newPos[2] / squareSize) * squareSize;
    const newY = newPos[1] + 0.05;

    if (!selected.isQueen) {
        if (selected.type === 'D' && targetZ >= curZ) {
            return;
        }
        if (selected.type === 'L' && targetZ <= curZ) {
            return;
        }
    }

    if (isSimpleMove) {
        const targetSquareOccupied = pieces.find(p => {
            const pieceX = Math.round(p.position[0] / squareSize) * squareSize;
            const pieceY = Math.round(p.position[1]);
            const pieceZ = Math.round(p.position[2] / squareSize) * squareSize;
            return (
                Math.abs(pieceX - targetX) < tolerance &&
                Math.abs(pieceZ - targetZ) < tolerance &&
                Math.abs(pieceY - newY) < tolerance
            );
        });

        if (!targetSquareOccupied) {
            setPieces(prevPieces =>
                prevPieces.map(piece =>
                    piece.id === selectedPieceId
                        ? { ...piece, position: [targetX, newY, targetZ] }
                        : piece
                )
            );
        }
    } else if (isJumpMove) {
        setJumpingPieces((prev) => {
            const updated = { ...prev, [selectedPieceId]: true };
            return updated;
        });
        setTimeout(() => {
            setJumpingPieces((prev) => {
                const updated = { ...prev };
                delete updated[selectedPieceId];
                return updated;
            });
        }, 300);

        const round = (v) => Math.round(v * 100) / 100;

        const midX = round((curX + newPos[0]) / 2);
        const midZ = round((curZ + newPos[2]) / 2);
        const midY = round((curY + newPos[1]) / 2);

        const enemyPiece = pieces.find(p => {
            const [px, py, pz] = p.position;
            return (
                Math.abs(round(px) - midX) < tolerance &&
                Math.abs(round(py) - midY) < tolerance &&
                Math.abs(round(pz) - midZ) < tolerance &&
                p.type !== selected.type
            );
        });

        if (enemyPiece) {
            setPieces(prevPieces =>
                prevPieces
                    .filter(piece => piece.id !== enemyPiece.id)
                    .map(piece =>
                        piece.id === selectedPieceId
                            ? { ...piece, position: [targetX, newY, targetZ] }
                            : piece
                    )
            );

            setExplosions((prev) => [
                ...prev,
                {
                    id: `explosion-${enemyPiece.id}-${Date.now()}`,
                    position: enemyPiece.position,
                },
            ]);

            if (enemyPiece.type === 'D') {
                setScoreLight(prevScore => prevScore + 1);
            } else if (enemyPiece.type === 'L') {
                setScoreDark(prevScore => prevScore + 1);
            }
        } else {
            return;
        }
    }

    if (isSimpleMove || isJumpMove) {
        if ((selected.type === 'D' && targetZ === -(size / 2 - 1) * squareSize) ||
            (selected.type === 'L' && targetZ === (size / 2 - 1) * squareSize)) {
            setPieces(prevPieces =>
                prevPieces.map(piece =>
                    piece.id === selectedPieceId
                        ? { ...piece, isQueen: true }
                        : piece
                )
            );
        }
    }

    setSelectedPieceId(null);
    setTimeout(() => setCurrentPlayer('L'), 1000);
}
