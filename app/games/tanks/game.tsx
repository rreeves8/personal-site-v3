"use client";

import { Link } from "@/components/ui/link";
import { Spinner } from "@/components/ui/spinner";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const Game = dynamic(() => import("./(utils)/game"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center">
      <Spinner />
    </div>
  ),
});

function GameContainer({ divRef }: { divRef: HTMLDivElement }) {
  const { height, width } = useMemo(() => {
    return divRef.getBoundingClientRect();
  }, [divRef]);

  if (width < 640) {
    return <div>Laptop only</div>;
  }

  return <Game height={height} width={width} />;
}

export function Tanks() {
  const [divElement, setDivElement] = useState<HTMLDivElement | null>(null);

  return (
    <div className="w-4/5 flex-1 flex flex-col mx-auto">
      <div className="pt-4 flex flex-col sm:flex-row justify-between">
        <Link href="/games" className="text-blue-600">
          back
        </Link>
        <h1 className="text-2xl font-medium text-center ">Tanks</h1>
        <div className=" text-white">back</div>
      </div>
      <div
        ref={setDivElement}
        className="w-full flex flex-1 justify-center my-4"
      >
        {divElement && <GameContainer divRef={divElement} />}
      </div>
    </div>
  );
}
