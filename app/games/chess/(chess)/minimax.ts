import { Chess } from "chess.js";

const PIECE_VALUES = {
  p: 10,
  n: 30,
  b: 30,
  r: 50,
  q: 100,
  k: 900,
};

function evaluateBoard(chess: Chess, maximizingPlayer: "w" | "b"): number {
  if (chess.isCheckmate())
    return chess.turn() === maximizingPlayer ? -Infinity : Infinity;
  if (chess.isDraw()) return 0;

  return chess
    .board()
    .flat()
    .reduce((score, piece) => {
      if (!piece) return score;
      const val = PIECE_VALUES[piece.type];
      return piece.color === maximizingPlayer ? score + val : score - val;
    }, 0);
}

export function minimax(
  chess: Chess,
  depth: number,
  mP: "w" | "b",
  alpha = -Infinity,
  beta = Infinity
): { score: number; move?: string } {
  if (chess.isCheckmate()) {
    return { score: chess.turn() === mP ? -Infinity : Infinity };
  }
  if (chess.isDraw()) {
    return { score: 0 };
  }
  if (depth === 0 || chess.isGameOver()) {
    return { score: evaluateBoard(chess, mP) };
  }

  const moves = chess.moves();
  const isMaximizing = chess.turn() === mP;

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove = undefined;
    for (const move of moves) {
      chess.move(move);
      const { score } = minimax(chess, depth - 1, mP, alpha, beta);
      chess.undo();

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }

      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) return { score: bestScore };
    }

    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove = undefined;

    for (const move of moves) {
      chess.move(move);
      const { score } = minimax(chess, depth - 1, mP, alpha, beta);
      chess.undo();

      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }

      beta = Math.min(beta, bestScore);

      if (beta <= alpha) return { score: bestScore };
    }
    return { score: bestScore, move: bestMove };
  }
}
