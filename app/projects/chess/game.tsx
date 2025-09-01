"use client";

import { useState } from "react";
import { Chess as ChessUI } from "./(chess)/chess";
import { Chess as ChessEngine, Move } from "chess.js";
import { default as NextLink } from "next/link";
import { Link } from "@/components/ui/link";

export function Chess() {
  const [chess] = useState(() => new ChessEngine());

  return <ChessUI chess={chess} />;
}
