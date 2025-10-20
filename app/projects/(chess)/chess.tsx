"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MouseEventHandler,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { Chess as ChessEngine, Move, Piece } from "chess.js";
import { minimaxC } from "./c++";

/**
 *    I am aware of how sloppy some of these handlers are
 *
 *
 *
 */

export const Pieces = {
  kw: "imgs/king-white.png",
  kb: "imgs/king-black.png",
  qw: "imgs/queen-white.png",
  qb: "imgs/queen-black.png",
  bw: "imgs/bishop-white.png",
  bb: "imgs/bishop-black.png",
  rw: "imgs/castle-white.png",
  rb: "imgs/castle-black.png",
  pw: "imgs/pawn-white.png",
  pb: "imgs/pawn-black.png",
  nw: "imgs/knight-white.png",
  nb: "imgs/knight-black.png",
};

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

function ijToAj(i: number, j: number) {
  return `${alphabet[j]}${i + 1}`;
}

export function Chess() {
  const [chess] = useState(() => new ChessEngine());
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

  const onMouseMove = useCallback(
    ({ clientX, clientY }: MouseEvent) => {
      if (container.current) {
        const rect = container.current.getBoundingClientRect();
        setDragPos([clientX - rect.left - 20, clientY - rect.top - 20]);
      }
    },
    [container]
  );

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
    if (container.current) {
      const rect = container.current.getBoundingClientRect();
      setDragPos([clientX - rect.left - 20, clientY - rect.top - 20]);
    }
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
    if (!clicked && chess.turn() === "b" && !chess.isGameOver()) {
      setComputing(true);
      setTimeout(async () => {
        const move = await minimaxC(chess, "b", 5);

        chess.move(move);
        setComputing(false);
      }, 400);
    }
  }, [clicked]);

  return (
    <section
      ref={container}
      className="flex flex-1 h-full relative justify-center items-center p-2">
      <div className="grid grid-cols-8 grid-rows-8 gap-0 bg-white rounded w-full h-full">
        {board.flatMap((row, i) =>
          row.map((c, j) => (
            <Cell
              key={`${i}${j}`}
              c={c}
              i={board.length - i - 1}
              j={j}
              computing={computing}
              clicked={clicked}
              setDragPos={setDragPos}
              setClicked={setClicked}
              container={container}
            />
          ))
        )}
      </div>

      {clicked && dragPos && (
        <div
          className="absolute w-10 h-10 pointer-events-none z-10"
          style={{ left: `${dragPos[0]}px`, top: `${dragPos[1]}px` }}>
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
  container,
}: {
  i: number;
  j: number;
  c: Piece | null;
  clicked: [number, number, "mouse" | "touch"] | null;
  computing: boolean;
  setDragPos: (x: [number, number]) => void;
  setClicked: (x: [number, number, "mouse" | "touch"]) => void;
  container: RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const disabled = clicked || computing ? true : false;

  const style = {
    backgroundColor: (j + (i % 2)) % 2 === 0 ? "white" : "#a97a65",
  };

  const onMove: MouseEventHandler<HTMLButtonElement> = useCallback(
    ({ clientX, clientY }) => {
      if (container.current) {
        const rect = container.current.getBoundingClientRect();
        setDragPos([clientX - rect.left - 20, clientY - rect.top - 20]);
      }

      setClicked([i, j, "mouse"]);
    },
    [setDragPos, setClicked]
  );

  const onMobileTouch = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      if (container.current) {
        const { clientX, clientY } = e.touches[0];
        const rect = container.current.getBoundingClientRect();
        setDragPos([clientX - rect.left - 20, clientY - rect.top - 20]);
      }
      setClicked([i, j, "touch"]);
    },
    [setDragPos, setClicked]
  );

  useEffect(() => {
    if (ref.current && c && c.color === "w") {
      ref.current.addEventListener("touchstart", onMobileTouch, {
        passive: false,
      });

      return () =>
        ref.current?.removeEventListener("touchstart", onMobileTouch);
    }
  }, [ref, onMobileTouch, c]);

  return (
    <Button
      ref={ref}
      key={j}
      disabled={disabled}
      property={`${i},${j}`}
      className="p-0 border-2  w-full h-full"
      style={style}
      onMouseDown={c && c.color === "w" ? onMove : undefined}>
      {c && (
        <div className="relative w-full h-full">
          <Image
            className="object-contain p-2"
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
