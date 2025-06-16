"use client";
import { useState } from "react";
import { Chess as ChessUI } from "./(chess)/chess";
import { Chess as ChessEngine, Move } from "chess.js";
import Link from "next/link";

export default function Chess() {
  const [chess] = useState(() => new ChessEngine());

  return (
    <div className="sm:max-w-4/5 mx-auto flex flex-col flex-1">
      <h1 className="text-2xl font-medium text-center pt-4">Chess</h1>
      <div className="flex flex-col-reverse lg:flex-row pt-4">
        <ChessUI chess={chess} />

        <div className="flex-1 basis-full flex flex-col p-4 items-center pt-7 justify-between h-3/5 my-auto">
          <p className="text-center justify-center max-w-3/4">
            Single player chess, play against an algorithm I created using
            minimax and a react interface.
          </p>
          <div className="flex flex-row items-center gap-6 justify-center pt-4">
            <Link
              href="https://github.com/rreeves8/personal-site-v3/blob/main/app/games/(chess)/minimax.ts"
              target="_blank"
              className="link"
              aria-label="GitHub repository"
            >
              <span className={`icon-[simple-icons--github] size-6`} />
            </Link>
            <Link
              href="https://github.com/rreeves8/personal-site-v3/blob/main/app/games/(chess)/minimax.ts"
              target="_blank"
              className="link text-blue-600"
              aria-label="GitHub repository"
            >
              <p className="mb-2">Algorithm</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
