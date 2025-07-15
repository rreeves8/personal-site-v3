"use client";

import { Link } from "@/components/ui/link";
import { Spinner } from "@/components/ui/spinner";
import dynamic from "next/dynamic";

const Game = dynamic(() => import("./(utils)/game"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center">
      <Spinner />
    </div>
  ),
});

export function Tanks() {
  return (
    <div className="w-4/5 flex-1 flex flex-col mx-auto pt-8">
      <div className="pt-4 flex flex-row justify-between">
        <Link href="/games" className="text-blue-600">
          back
        </Link>
        <h1 className="text-2xl font-medium text-center ">Tanks</h1>
        <div className=" text-white">back</div>
      </div>
      <div className="w-full flex flex-1 justify-center py-4">
        <Game />
      </div>
    </div>
  );
}
