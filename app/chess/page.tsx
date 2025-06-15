"use client";
import { useEffect, useState } from "react";
import { Chess as ChessUI } from "./(chess)/chess";
import { Chess as ChessEngine, Move } from "chess.js";
import { Pieces } from "./(chess)/img.const";

export default function Chess() {
  const [chess] = useState(() => new ChessEngine());
  const [history, setHistory] = useState<Move[]>([]);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-medium text-center pt-4">Chess</h1>
      <div className="flex flex-col lg:flex-row pt-4">
        <ChessUI chess={chess} setHistory={setHistory} />
        <div className="flex-1 basis-full flex flex-col p-4 items-center pt-7 ">
          <p className="text-center max-w-3/4">
            Single player chess! Try beating a Minimax algorithm I created using
            alpha beta pruning and a React interface.
          </p>
        </div>
      </div>
    </div>
  );
}
