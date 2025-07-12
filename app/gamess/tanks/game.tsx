"use client";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, Html } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Game, useGameState } from "./(utils)/game";

export default function Tanks() {
  const game = useGameState((s) => s.game);
  const startGame = useGameState((s) => s.startGame);

  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w"] },
        { name: "backward", keys: ["ArrowDown", "s"] },
        { name: "left", keys: ["ArrowLeft", "a"] },
        { name: "right", keys: ["ArrowRight", "d"] },
        { name: "space", keys: ["Space"] },
        { name: "esc", keys: ["Escape"] },
      ]}
    >
      <Canvas
        className="w-full h-full rounded-2xl border-2"
        orthographic
        camera={{
          position: [0, 0, 100],
          zoom: 30,
        }}
      >
        {game ? (
          <Game game={game} />
        ) : (
          <Html fullscreen>
            <div className="w-full h-full flex justify-center items-center">
              <div className="flex flex-col gap-5 items-center">
                <h1 className="text-4xl text-black">Tanks</h1>
                <div className="p-6 flex flex-row gap-5">
                  <Button onClick={startGame} variant={"secondary"}>
                    Single player
                  </Button>
                  <Button variant={"secondary"}>Multi player</Button>
                </div>
              </div>
            </div>
          </Html>
        )}
      </Canvas>
    </KeyboardControls>
  );
}
