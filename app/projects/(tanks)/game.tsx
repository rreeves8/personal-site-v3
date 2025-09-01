"use client";;
import { useMemo, useState } from "react";
import Game from "./engine/game";

function GameContainer({ divRef }: { divRef: HTMLDivElement }) {
  const { height, width } = useMemo(() => {
    return divRef.getBoundingClientRect();
  }, [divRef]);

  return <Game height={height} width={width} />;
}

export function Tanks() {
  const [divElement, setDivElement] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setDivElement} className="h-full flex flex-1 justify-center ">
      {divElement && <GameContainer divRef={divElement} />}
    </div>
  );
}
