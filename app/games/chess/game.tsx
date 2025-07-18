"use client";

import { useState } from "react";
import { Chess as ChessUI } from "./(chess)/chess";
import { Chess as ChessEngine, Move } from "chess.js";
import { default as NextLink } from "next/link";
import { Link } from "@/components/ui/link";

export function Chess() {
  const [chess] = useState(() => new ChessEngine());

  return (
    <div className="sm:max-w-4/5 mx-auto flex flex-col flex-1">
      <div className="pt-4 flex flex-row justify-between px-7">
        <Link href="/games" className="text-blue-600">
          back
        </Link>
        <h1 className="text-2xl font-medium text-center ">Chess</h1>
        <div className=" text-white">back</div>
      </div>
      <div className="flex flex-col-reverse lg:flex-row pt-4">
        <ChessUI chess={chess} />
        <div className="flex-1 basis-full flex flex-col p-4 items-center pt-7 justify-between h-3/5 my-auto">
          <p className="text-center justify-center max-w-3/4">
            Single player chess, play against an algorithm I created using
            minimax and a react interface.
          </p>
          <div className="flex flex-row items-center gap-6 justify-center pt-4">
            <NextLink
              href="https://github.com/rreeves8/personal-site-v3/blob/main/app/games/chess/(chess)/minimax.ts"
              target="_blank"
              className="link"
              aria-label="GitHub repository"
            >
              <span className="icon-[simple-icons--github] size-6" />
            </NextLink>
            <NextLink
              href="https://github.com/rreeves8/personal-site-v3/blob/main/app/games/chess/(chess)/minimax.ts"
              target="_blank"
              className="link text-blue-600"
              aria-label="GitHub repository"
            >
              <p className="mb-2">Algorithm</p>
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  );
}
