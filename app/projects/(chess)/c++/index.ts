import { Chess } from "chess.js";

const Module = import("./app.js" as string).then((m) => m.default());

export async function minimaxC(chess: Chess, p: "w" | "b", depth: number) {
  const cPlusPLus = await Module;

  const buf = cPlusPLus._malloc(32);

  cPlusPLus.ccall(
    "getBestMove",
    "number",
    ["string", "number", "number", "number"],
    [chess.fen(), p === "w" ? 0 : 1, depth, buf, 32]
  );

  const bestMove = cPlusPLus.UTF8ToString(buf);

  cPlusPLus._free(buf);

  return bestMove;
}
