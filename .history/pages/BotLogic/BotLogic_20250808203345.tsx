// BotLogic.tsx
// Acest fisier va contine logica pentru botul jocului de table (Checkers3D)
// Adauga aici functii si componente pentru AI sau logica de miscare automata.

export const BotLogic = {
  makeMove: (level, pieces, currentPlayer, boardSize, squareSize, boardsY) => {
    if (typeof squareSize !== 'number') throw new Error('squareSize must be a number');
    switch (level) {
      case 'Easy': return BotLogic.easyMove(pieces, currentPlayer, boardSize, squareSize, boardsY);
      case 'Medium': return BotLogic.mediumMove(pieces, currentPlayer, boardSize, squareSize, boardsY);
      case 'Hard': return BotLogic.hardMove(pieces, currentPlayer, boardSize, squareSize, boardsY);
      default: throw new Error('Invalid difficulty level');
    }
  },

  getBoardLimits: (boardSize, squareSize) => {
    const halfSize = (boardSize - 1) / 2;
    return {
      boardMin: -halfSize * squareSize,
      boardMax: halfSize * squareSize
    };
  },
  getRowZ: (rowIndex, boardSize, squareSize) => {
    const halfSize = (boardSize - 1) / 2;
    return (halfSize - rowIndex) * squareSize;
  },
  getLastRowZ: (playerType, boardSize, squareSize) => {
    const lastRowIndex = playerType === 'D' ? 7 : 0;
    return BotLogic.getRowZ(lastRowIndex, boardSize, squareSize);
  },

  easyMove: (pieces, currentPlayer, boardSize, squareSize, boardsY) => {
    const validMoves = BotLogic.getValidMoves(pieces, currentPlayer, boardSize, squareSize, boardsY);
    const captures = validMoves.filter(m => m.isCapture);
    if (captures.length > 0) return BotLogic.promoteIfNeeded(pieces, captures, boardsY, currentPlayer, squareSize, boardSize);
    if (validMoves.length > 0) return BotLogic.promoteIfNeeded(pieces, validMoves, boardsY, currentPlayer, squareSize, boardSize);
    return null;
  },

  mediumMove: (pieces, currentPlayer, boardSize, squareSize, boardsY) => {
    const TOLERANCE = 0.1;
    const validMoves = BotLogic.getValidMoves(pieces, currentPlayer, boardSize, squareSize, boardsY);
    const lastRowZ = BotLogic.getLastRowZ(currentPlayer === 'D' ? 7 : 0, boardSize, squareSize);

    const scoredMoves = validMoves.map(move => {
      const piece = pieces.find(p => p.id === move.pieceId);
      const isPromotion = piece && !piece.isQueen && Math.abs(move.targetPosition[2] - lastRowZ) < TOLERANCE;
      const isCrossBoard = Math.abs(move.targetPosition[1] - piece.position[1]) > TOLERANCE;

      const isAlreadyQueen = piece?.isQueen;
      const penalty = (isAlreadyQueen && !move.isCapture) ? -10 : 0;
      const score =
        (move.isCapture ? 100 : 0) +
        (!isAlreadyQueen && isPromotion ? 50 : 0) +
        (isCrossBoard ? 5 : 0) +
        penalty;

      return { ...move, score };
    });

    const sorted = scoredMoves.sort((a, b) => b.score - a.score);

    return BotLogic.promoteIfNeeded(pieces, sorted, boardsY, currentPlayer, squareSize, boardSize);
  },

  hardMove: (pieces, currentPlayer, boardSize, squareSize, boardsY) => {
    const TOLERANCE = 0.1;
    const validMoves = BotLogic.getValidMoves(pieces, currentPlayer, boardSize, squareSize, boardsY);
    const { boardMin, boardMax } = BotLogic.getBoardLimits(boardSize, squareSize);

    const calculatePositionScore = (position) => {
      const [x, , z] = position;
      const centerX = (boardMin + boardMax) / 2;
      const centerZ = (boardMin + boardMax) / 2;
      const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(z - centerZ, 2));
      return -distanceFromCenter;
    };

    const simulateOpponentMoves = (pieces, currentPlayer, boardSize, squareSize, boardsY) => {
      const opponent = currentPlayer === 'D' ? 'L' : 'D';
      const opponentMoves = BotLogic.getValidMoves(pieces, opponent, boardSize, squareSize, boardsY);
      return opponentMoves;
    };

    const scoredMoves = validMoves.map(move => {
      const piece = pieces.find(p => p.id === move.pieceId);
      const isPromotion = piece && !piece.isQueen && Math.abs(move.targetPosition[2] - BotLogic.getLastRowZ(currentPlayer, boardSize, squareSize)) < TOLERANCE;
      const positionScore = calculatePositionScore(move.targetPosition);

      const opponentMoves = simulateOpponentMoves(pieces, currentPlayer, boardSize, squareSize, boardsY);
      const opponentAdvantage = opponentMoves.length;

      const score =
        (move.isCapture ? 100 : 0) +
        (isPromotion ? 50 : 0) +
        positionScore -
        opponentAdvantage;

      return { ...move, score };
    });

    const sortedMoves = scoredMoves.sort((a, b) => b.score - a.score);

    return BotLogic.promoteIfNeeded(pieces, sortedMoves, boardsY, currentPlayer, squareSize, boardSize);
  },

  promoteIfNeeded: (pieces, moves, boardsY, currentPlayer, squareSize, boardSize) => {
    const TOLERANCE = 0.1;
    const lastRowZ = BotLogic.getLastRowZ(currentPlayer, boardSize, squareSize);

    const prioritizedMoves = moves.map(move => {
      const piece = pieces.find(p => p.id === move.pieceId);
      const targetZ = move.targetPosition[2];
      const isPromotionMove = piece &&
        !piece.isQueen &&
        Math.abs(targetZ - lastRowZ) < TOLERANCE;

      const captureScore = move.isCapture ? 50 : 0;
      const promotionScore = isPromotionMove ? 100 : 0;

      return {
        ...move,
        totalScore: (move.score || 0) + captureScore + promotionScore,
        isPromotionMove
      };
    });

    const sortedMoves = prioritizedMoves.sort((a, b) => b.totalScore - a.totalScore);
    const bestMove = sortedMoves[0];

    if (bestMove) {
      const piece = pieces.find(p => p.id === bestMove.pieceId);
      const targetZ = bestMove.targetPosition[2];

      const simulatedZ = targetZ;

      const shouldPromote = piece &&
        !piece.isQueen &&
        Math.abs(simulatedZ - lastRowZ) < TOLERANCE;

      console.log(`🧭 Bot is moving piece ${piece.id} to Z: ${simulatedZ}`);
      if (shouldPromote) {
        piece.isQueen = true;
        console.log(`👑 Piece ${piece.id} promoted to Queen at Z: ${simulatedZ}`);
      }

      bestMove.targetPosition[1] += 0.05;
      return bestMove;
    }

    return null;
  },

  getPieceY: (pieces, id) => {
    const p = pieces.find(p => p.id === id);
    return p ? p.position[1] : 0;
  },

  getValidMoves: (pieces, currentPlayer, boardSize, squareSize, boardsY) => {
    const TOLERANCE = 0.1;
    const validMoves = [];
    const { boardMin, boardMax } = BotLogic.getBoardLimits(boardSize, squareSize);

    const isForwardZ = (dz) =>
      currentPlayer === 'D' ? dz < -TOLERANCE : dz > TOLERANCE;

    pieces.forEach(piece => {
      if (piece.type !== currentPlayer) return;

      const [curX, curY, curZ] = piece.position;
      const isQueen = piece.isQueen;

      boardsY.forEach(boardY => {
        const jumpDeltas = [
          { dx: 2 * squareSize, dz: 2 * squareSize },
          { dx: -2 * squareSize, dz: 2 * squareSize },
          { dx: 2 * squareSize, dz: -2 * squareSize },
          { dx: -2 * squareSize, dz: -2 * squareSize },
        ];

        jumpDeltas.forEach(({ dx, dz }) => {
          if (!isQueen && !isForwardZ(dz)) return;

          const endX = curX + dx;
          const endZ = curZ + dz;
          const endY = boardY;
          const midX = curX + dx / 2;
          const midZ = curZ + dz / 2;
          const midY = (curY + boardY) / 2;

          if (
            endX < boardMin - TOLERANCE || endX > boardMax + TOLERANCE ||
            endZ < boardMin - TOLERANCE - squareSize || endZ > boardMax + TOLERANCE + squareSize
          ) return;

          const isTargetOccupied = pieces.some(p => {
            const [px, py, pz] = p.position;
            return (
              Math.abs(px - endX) < squareSize / 2 &&
              Math.abs(py - endY) < TOLERANCE &&
              Math.abs(pz - endZ) < squareSize / 2
            );
          });

          if (isTargetOccupied) return;

          const midPiece = pieces.find(p => {
            const [px, py, pz] = p.position;
            return (
              Math.abs(px - midX) < squareSize / 2 &&
              Math.abs(py - midY) < TOLERANCE &&
              Math.abs(pz - midZ) < squareSize / 2 &&
              p.type !== piece.type
            );
          });

          if (midPiece) {
            validMoves.push({
              pieceId: piece.id,
              targetPosition: [endX, endY, endZ],
              isCapture: true,
              capturedPieceId: midPiece.id,
            });
          }
        });

        const simpleDeltas = [
          { dx: squareSize, dz: squareSize },
          { dx: -squareSize, dz: squareSize },
          { dx: squareSize, dz: -squareSize },
          { dx: -squareSize, dz: -squareSize },
        ];

        simpleDeltas.forEach(({ dx, dz }) => {
          const x = curX + dx;
          const z = curZ + dz;
          const y = boardY;
        
          const actualDz = z - curZ;
          const deltaY = Math.abs(y - curY);
        
          if (!isQueen && !isForwardZ(actualDz)) return;
          if (deltaY > Math.abs(boardsY[1] - boardsY[0]) + TOLERANCE) return;
        
          if (
            x < boardMin - TOLERANCE || x > boardMax + TOLERANCE ||
            z < boardMin - TOLERANCE - squareSize || z > boardMax + TOLERANCE + squareSize
          ) return;
        
          const isTargetOccupied = pieces.some(p => {
            const [px, py, pz] = p.position;
            return (
              Math.abs(px - x) < squareSize / 2 &&
              Math.abs(py - y) < TOLERANCE &&
              Math.abs(pz - z) < squareSize / 2
            );
          });
        
          if (!isTargetOccupied) {
            validMoves.push({
              pieceId: piece.id,
              targetPosition: [x, y, z],
              isCapture: false,
            });
          }
        });
      });
    });

    return validMoves;
  }
};
