"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MouseEventHandler,
  useCallback,
  useEffect,
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

export function Chess({ chess }: { chess: ChessEngine }) {
  const board = chess.board();
  const [clicked, setClicked] = useState<
    [number, number, "mouse" | "touch"] | null
  >(null);
  const [dragPos, setDragPos] = useState<[number, number] | null>(null);
  const [computing, setComputing] = useState(false);
  const [getCurrentHover, setGetCurrentHover] = useState<
    { pos: [number, number]; ij: typeof clicked } | false
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

  const onTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const { clientX, clientY } = e.touches[0];
    setDragPos([clientX - 32, clientY - 32]);
  }, []);

  const onTouchUp = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      console.log(e);
      const { clientX, clientY } = e.changedTouches[0];
      setGetCurrentHover({ pos: [clientX, clientY], ij: clicked! });
      setClicked(null);
      setDragPos(null);
    },
    [dragPos]
  );

  const onTouchCancel = useCallback(() => {
    setClicked(null);
    setDragPos(null);
  }, []);

  useEffect(() => {
    if (container.current) {
      if (clicked) {
        if (clicked[2] === "mouse") {
          container.current.style.cursor = "none";
          window.addEventListener("mousemove", onMouseMove);
          window.addEventListener("mouseup", onMouseUp);

          return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
          };
        } else {
          window.addEventListener("touchmove", onTouchMove, { passive: false });
          window.addEventListener("touchend", onTouchUp, { passive: false });
          window.addEventListener("touchcancel", onTouchCancel, {
            passive: false,
          });

          return () => {
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchUp);
            window.removeEventListener("touchcancel", onTouchCancel);
          };
        }
      }
    }
  }, [clicked]);

  useEffect(() => {
    if (getCurrentHover) {
      const x = document.elementFromPoint(
        getCurrentHover.pos[0],
        getCurrentHover.pos[1]
      ) as HTMLButtonElement;

      const property = x.attributes.getNamedItem("property");

      if (property) {
        const [i, j] = property.value.split(",").map(parseFloat);
        const [prevI, prevJ] = getCurrentHover.ij!;

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
        const { move } = minimax(chess, 4, "b");
        chess.move(move!);
        setComputing(false);
      }, 400);
    }
  }, [clicked]);

  return (
    <section ref={container} className="flex justify-center cursor noSelect">
      <div className="flex flex-col gap-2 p-4 bg-white rounded">
        {board.map((row, i) => (
          <div key={i} className="flex flex-row gap-1 lg:gap-2">
            {row.map((c, j) => (
              <Cell
                key={`${i}${j}`}
                c={c}
                i={board.length - i - 1}
                j={j}
                computing={computing}
                clicked={clicked}
                setDragPos={setDragPos}
                setClicked={setClicked}
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
  clicked,
  computing,
  setDragPos,
  setClicked,
}: {
  i: number;
  j: number;
  c: Piece | null;
  clicked: [number, number, "mouse" | "touch"] | null;
  computing: boolean;
  setDragPos: (x: [number, number]) => void;
  setClicked: (x: [number, number, "mouse" | "touch"]) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const disabled = clicked || computing ? true : false;

  const style = {
    backgroundColor: (j + (i % 2)) % 2 === 0 ? "white" : "#a97a65",
  };

  const onMove: MouseEventHandler<HTMLButtonElement> = useCallback(
    ({ clientX, clientY }) => {
      setDragPos([clientX - 32, clientY - 32]);
      setClicked([i, j, "mouse"]);
    },
    []
  );

  const onMobileTouch = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const { clientX, clientY } = e.touches[0];
    setDragPos([clientX - 32, clientY - 32]);
    setClicked([i, j, "touch"]);
  }, []);

  useEffect(() => {
    if (ref.current && c && c.color === "w") {
      ref.current.addEventListener("touchstart", onMobileTouch, {
        passive: false,
      });
    }
  }, [ref]);

  return (
    <Button
      ref={ref}
      key={j}
      disabled={disabled}
      property={`${i},${j}`}
      className="p-2 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 border-2"
      style={style}
      onMouseDown={c && c.color === "w" ? onMove : undefined}
    >
      {c && (
        <div className="relative w-full h-full">
          <Image
            className=" object-contain"
            fill
            property={`${i},${j}`}
            src={"/" + Pieces[`${c.type}${c.color}` as keyof typeof Pieces]}
            alt=""
          />
        </div>
      )}
    </Button>
  );
}
