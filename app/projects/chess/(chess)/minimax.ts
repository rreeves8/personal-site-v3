import { Chess } from "chess.js";

const BOARD_SCORES = {
  p: 10,
  n: 30,
  b: 30,
  r: 50,
  q: 100,
  k: 900,
};

function boardScore(chess: Chess, p: "w" | "b") {
  return chess
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
    }, Math.random());
}

export function minimax(
  chess: Chess,
  depth: number,
  p: "w" | "b",
  alpha = -Infinity,
  beta = Infinity
): { score: number; move?: string } {
  if (chess.isCheckmate()) {
    return { score: chess.turn() === p ? -Infinity : Infinity };
  }

  const moves = chess.moves();

  if (depth === 0 || moves.length === 0) {
    return { score: boardScore(chess, p) };
  }

  const isMaximizing = chess.turn() === p;

  let bestScore = isMaximizing ? -Infinity : Infinity;
  let bestMove: string | undefined;

  for (const move of moves) {
    chess.move(move);
    const { score } = minimax(chess, depth - 1, p, alpha, beta);
    chess.undo();

    if (isMaximizing) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestScore);
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
      beta = Math.min(beta, bestScore);
    }

    if (beta <= alpha) break;
  }

  return { score: bestScore, move: bestMove };
}
