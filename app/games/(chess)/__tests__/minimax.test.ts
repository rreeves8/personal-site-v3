import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { minimax } from "../minimax";
import { tests } from "./tests";

const all = tests.split("\n").map((str) => {
  const spaces = str.split(" ");
  const move = spaces.pop();
  spaces.pop();
  return [spaces.join(" "), move];
});

describe("minimax testing", () => {
  it(
    "should work ",
    () => {
      let success = 0;
      let error = 0;
      for (const [board, trueMove] of all) {
        const c = new Chess(board);

        const { move } = minimax(c, 5, c.turn());

        const computerMove = c
          .moves({ verbose: true })
          .find((m) => m.san === move!);

        console.log()

        if (trueMove === computerMove?.lan) {
          success++;
        } else {
          error++;
        }
      }
      console.log({ success, error });
    },
    { timeout: Infinity }
  );
});
