"use client";
import { useState } from "react";
import { Chess as ChessUI } from "./(chess)/chess";
import { Chess as ChessEngine, Move } from "chess.js";

export default function Chess() {
  const [chess] = useState(() => new ChessEngine());

  return (
    <div className="sm:max-w-4/5 mx-auto flex flex-col flex-1">
      <h1 className="text-2xl font-medium text-center pt-4">Chess</h1>
      <div className="flex flex-col-reverse lg:flex-row pt-4">
        <ChessUI chess={chess} />
        <div className="flex-1 basis-full flex flex-col p-4 items-center pt-7 ">
          <p className="text-center justify-center max-w-3/4">
            Single player chess, play against a chess algorithm I created using
            minimax and a react interface.
          </p>
          <p className="text-center justify-center max-w-3/4">algorithm</p>
        </div>
      </div>
    </div>
  );
}
