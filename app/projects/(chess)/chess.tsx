"use client";
import { Chess as ChessEngine } from "chess.js";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { minimax } from "./minimax";
import Image from "next/image";
import { Pieces } from "./img.const";

const chess = new ChessEngine();

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

function ijToAj(i: number, j: number) {
  return `${alphabet[j]}${i + 1}`;
}

async function initMove() {
  const { move } = minimax(chess, 4, "b");
  chess.move(move!);
}

export function Chess() {
  const board = chess.board();
  const [clicked, setClicked] = useState<[number, number] | null>(null);
  const [dragPos, setDragPos] = useState<[number, number] | null>(null);
  const [computing, setComputing] = useState(false);

  const [getCurrentHover, setGetCurrentHover] = useState<
    { pos: [number, number]; ij: [number, number] } | false
  >(false);
  const container = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(({ clientX, clientY }: MouseEvent) => {
    setDragPos([clientX - 32, clientY - 32]);
  }, []);

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      setGetCurrentHover({ pos: [e.clientX, e.clientY], ij: clicked! });
      setClicked(null);
      setDragPos(null);
    },
    [dragPos]
  );

  useEffect(() => {
    if (getCurrentHover) {
      const x = document.elementFromPoint(
        getCurrentHover.pos[0],
        getCurrentHover.pos[1]
      ) as HTMLButtonElement;

      const property = x.attributes.getNamedItem("property");

      if (property) {
        const [i, j] = property.value.split(",").map(parseFloat);
        const [prevI, prevJ] = getCurrentHover.ij;

        try {
          chess.move({ from: ijToAj(prevI, prevJ), to: ijToAj(i, j) });
        } catch (e) {}
      }
      setGetCurrentHover(false);
    }
  }, [getCurrentHover, board]);

  useEffect(() => {
    if (!clicked && chess.turn() === "b") {
      setComputing(true);
      setTimeout(() => {
        initMove();
        setComputing(false);
      }, 400);
    }
  }, [clicked]);

  useEffect(() => {
    if (container.current) {
      if (clicked) {
        container.current.style.cursor = "none";
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
        };
      } else {
        container.current.style.cursor = "auto";

        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      }
    }
  }, [clicked]);

  useEffect(() => {}, [chess.fen()]);

  return (
    <section ref={container} className="flex justify-center mt-8 cursor">
      <div className="flex flex-col gap-2 p-4 bg-white rounded">
        {board.map((row, ii) => {
          const i = board.length - ii - 1;

          return (
            <div key={i} className="flex flex-row gap-2">
              {row.map((c, j) =>
                c && c.color === "w" ? (
                  <Button
                    key={j}
                    disabled={clicked || computing ? true : false}
                    property={`${i},${j}`}
                    className={`w-16 h-16 border-2`}
                    style={{
                      backgroundColor:
                        (j + (i % 2)) % 2 === 0 ? "white" : "#a97a65",
                    }}
                    onMouseDown={({ clientX, clientY }) => {
                      setDragPos([clientX - 32, clientY - 32]);
                      setClicked([i, j]);
                    }}
                  >
                    <Image
                      property={`${i},${j}`}
                      width={42}
                      height={42}
                      src={
                        "/" +
                        Pieces[`${c.type}${c.color}` as keyof typeof Pieces]
                      }
                      alt=""
                    />
                  </Button>
                ) : !c ? (
                  <Button
                    key={j}
                    disabled={computing}
                    property={`${i},${j}`}
                    className={`w-16 h-16 border-2`}
                    style={{
                      backgroundColor:
                        (j + (i % 2)) % 2 === 0 ? "white" : "#a97a65",
                    }}
                  >
                    {c}
                  </Button>
                ) : (
                  <Button
                    key={j}
                    disabled={computing}
                    property={`${i},${j}`}
                    className={`w-16 h-16 border-2`}
                    style={{
                      backgroundColor:
                        (j + (i % 2)) % 2 === 0 ? "white" : "#a97a65",
                    }}
                  >
                    <Image
                      property={`${i},${j}`}
                      width={42}
                      height={42}
                      src={
                        "/" +
                        Pieces[`${c.type}${c.color}` as keyof typeof Pieces]
                      }
                      alt=""
                    />
                  </Button>
                )
              )}
            </div>
          );
        })}
      </div>
      {clicked && dragPos && (
        <div
          className="absolute w-16 h-16"
          style={{ left: `${dragPos[0]}px`, top: `${dragPos[1]}px` }}
        >
          <div className="flex justify-center items-center">
            {(() => {
              const c = board[board.length - 1 - clicked[0]][clicked[1]]!;
              return (
                <Image
                  draggable={false}
                  width={32}
                  height={32}
                  src={
                    "/" + Pieces[`${c.type}${c.color}` as keyof typeof Pieces]
                  }
                  alt=""
                />
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
}
