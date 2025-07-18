"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { LoaderContext } from "@/components/ui/link";
import { Construction } from "lucide-react";
import { useContext } from "react";

export default function Games() {
  const { changeRoute } = useContext(LoaderContext);

  return (
    <div className="w-4/5 mx-auto flex flex-col flex-1">
      <main className="pt-4 text-center">
        <h1 className="text-3xl inline">Games</h1>
        <p className="pt-4 ">Check out some of the games I created</p>
      </main>
      <main className="pt-14 flex flex-col sm:flex-row gap-6">
        <Card onClick={() => changeRoute("games/chess")} className={className}>
          <CardHeader>
            <CardTitle>chess </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Play against a chess algorithm written using minimax. On a chess
              board written using react.
            </CardDescription>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        <Card onClick={() => changeRoute("games/tanks")} className={className}>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-3">
              <Construction className="w-8 h-8 text-yellow-400 " />
              Tanks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Play a web replica of the Wii game Tanks, Written using the
              Three.js library along with the react-fibre library for state
              management.
            </CardDescription>
          </CardContent>
          <CardFooter className="mt-auto">
            <div className="flex flex-wrap gap-2">
              {/* <span key={item.name} className={`${item.icon} size-6`} /> */}
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

const className = "basis-1/2 hover:cursor-grab hover:bg-accent";
