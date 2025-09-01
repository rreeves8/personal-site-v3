import { Chess } from "chess.js";

const Module = import("./app.js" as string);

export async function minimaxC(chess: Chess, p: "w" | "b", depth: number) {
  const createModule = (await Module).default;

  const module = await createModule();

  const buf = module._malloc(32);

  module.ccall(
    "getBestMove", // function name (no underscore)
    "number", // return type
    ["string", "number", "number", "number"], // arg types
    [chess.fen(), p === "w" ? 0 : 1, depth, buf, 32] // args: fen, Color (0=white), buffer, bufferLen
  );

  const bestMove = module.UTF8ToString(buf);

  module._free(buf);

  return bestMove;
}
