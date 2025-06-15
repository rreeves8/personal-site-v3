"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MouseEventHandler,
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
import { Chess as ChessEngine, Move, Piece } from "chess.js";

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

function ijToAj(i: number, j: number) {
  return `${alphabet[j]}${i + 1}`;
}

export function Chess({
  setHistory,
  chess,
}: {
  setHistory: (h: Move[]) => void;
  chess: ChessEngine;
}) {
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
        const { move } = minimax(chess, 5, "b");
        chess.move(move!);
        setComputing(false);
        setHistory(chess.history({ verbose: true }));
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
    <section ref={container} className="flex justify-center cursor">
      <div className="flex flex-col gap-2 p-4 bg-white rounded">
        {board.map((row, i) => (
          <div key={i} className="flex flex-row gap-2">
            {row.map((c, j) => (
              <Cell
                disabled={clicked || computing ? true : false}
                key={`${i}${j}`}
                c={c}
                i={board.length - i - 1}
                j={j}
                onMove={useCallback(({ clientX, clientY }) => {
                  setDragPos([clientX - 32, clientY - 32]);
                  setClicked([i, j]);
                }, [])}
              />
            ))}
          </div>
        ))}
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

function Cell({
  i,
  j,
  c,
  disabled,
  onMove,
}: {
  i: number;
  j: number;
  c: Piece | null;
  disabled: boolean;
  onMove: MouseEventHandler<HTMLButtonElement>;
}) {
  const className = `w-16 h-16 border-2`;
  const property = `${i},${j}`;

  const style = {
    backgroundColor: (j + (i % 2)) % 2 === 0 ? "white" : "#a97a65",
  };

  return (
    <Button
      key={j}
      disabled={disabled}
      property={property}
      className={className}
      style={style}
      onMouseDown={c && c.color === "w" ? onMove : undefined}
    >
      {c && (
        <Image
          property={`${i},${j}`}
          width={42}
          height={42}
          src={"/" + Pieces[`${c.type}${c.color}` as keyof typeof Pieces]}
          alt=""
        />
      )}
    </Button>
  );
}
