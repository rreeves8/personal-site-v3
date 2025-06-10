import { Chess } from "chess.js";

const BOARD_SCORES = {
  p: 10,
  b: 30,
  k: 900,
  q: 100,
  n: 30,
  r: 50,
};

export function minimax(
  chess: Chess,
  depth: number,
  p: "w" | "b",
  alpha = -Infinity,
  beta = Infinity
): { score: number; move?: string } {
  if (depth === 0 || chess.isGameOver()) {
    const bScore = chess
      .board()
      .flat()
      .reduce((score, piece) => {
        if (!piece) {
          return score;
        }
        if (piece.color === p) {
          return score + BOARD_SCORES[piece.type];
        } else {
          return score - BOARD_SCORES[piece.type];
        }
      }, 0);
    return { score: bScore };
  }

  const moves = chess.moves();

  if (chess.turn() === p) {
    let bestScore = -Infinity;
    let bestMove = undefined;
    for (const move of moves) {
      chess.move(move);
      const { score } = minimax(chess, depth - 1, p, alpha, beta);
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
      const { score } = minimax(chess, depth - 1, p, alpha, beta);
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
