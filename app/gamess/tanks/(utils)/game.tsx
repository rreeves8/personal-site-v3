"use client";
import { Suspense, useMemo, useRef } from "react";
import { Html, useKeyboardControls } from "@react-three/drei";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import { Player } from "./player";
import { Bullets, useBulletStore } from "./bullets";
import { Loading, Lighting, Floor, Wall, NavMesh } from "./map";
import { Explosions, useExplosionStore } from "./explosions";
import { Ai } from "./Ai";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

type GameADT = { map: 0; paused: boolean; over: "loose" | false };

export const useGameState = create<{
  game: GameADT | false;
  startGame: () => void;
  pauseGame: (s: boolean) => void;
  gameLose: () => void;
  clearGame: () => void;
}>((set) => ({
  game: false,
  startGame: () => {
    set({ game: { map: 0, paused: false, over: false } });
  },
  gameLose: () => {
    set((s) => ({ ...s, game: s.game && { ...s.game, over: "loose" } }));
  },
  pauseGame: (p) =>
    set((s) => ({ ...s, game: s.game && { ...s.game, paused: p } })),
  clearGame: () => set((s) => ({ ...s, game: false })),
}));

export function Game({ game: { map } }: { game: GameADT }) {
  const playerRef = useRef<RapierRigidBody>(null);
  const [tank, ai, walls] = useMemo(() => maps[map], [map]);
  const isPaused = useGameState((s) => s.game && s.game.paused);
  const pauseGame = useGameState((s) => s.pauseGame);
  const gameOver = useGameState((s) => s.game && s.game.over);
  const clearGame = useGameState((s) => s.clearGame);
  const clearBullets = useBulletStore((s) => s.clear);
  const clearExplosions = useExplosionStore((s) => s.clear);
  const useEscape = useKeyboardControls((s) => s.esc);
  const navMeshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (useEscape && !isPaused) {
      pauseGame(true);
    }
  });

  function stopGame() {
    clearGame();
    clearBullets();
    clearExplosions();
  }

  return (
    <Suspense fallback={<Loading />}>
      <Lighting />
      <Physics paused={isPaused || gameOver !== false}>
        <Floor />
        <NavMesh walls={walls} meshRef={navMeshRef} />
        {walls.map(([x, y, length, dir], i) => (
          <Wall key={i} pos={[x, y]} length={length} direction={dir} />
        ))}
        <Player pos={tank} tankRef={playerRef} />
        <Ai initPos={ai} playerRef={playerRef} navMeshRef={navMeshRef} />
        <Bullets />
        <Explosions />
      </Physics>
      {isPaused && (
        <Html fullscreen>
          <div className="flex justify-center items-center h-full">
            <div className="bg-secondary rounded-2xl flex flex-col items-center justify-between p-6 gap-5">
              <h1>Paused</h1>
              <div className="flex flex-row gap-3">
                <Button onClick={() => pauseGame(false)}>Continue</Button>
                <Button onClick={() => stopGame()} variant={"destructive"}>
                  Quit
                </Button>
              </div>
            </div>
          </div>
        </Html>
      )}
      {gameOver && (
        <Html fullscreen>
          <div className="flex justify-center items-center h-full">
            <div className="bg-secondary rounded-2xl flex flex-col items-center justify-between p-6 gap-5 px-12">
              <h1>Game Over</h1>
              <Button onClick={() => stopGame()}>Menu</Button>
            </div>
          </div>
        </Html>
      )}
    </Suspense>
  );
}

export type Maps = Array<
  [
    [number, number],
    [number, number],
    Array<[number, number, number, "x" | "y"]>
  ]
>;

const Y = 9.5;
const X = 0;

const bounds: Maps[number][2] = [
  [0, Y, 36 + 0.6, "x"],
  [18, 0, Y * 2 - 0.6, "y"],
  [0, -Y, 36 + 0.6, "x"],
  [-18, 0, Y * 2 - 0.6, "y"],
];

const maps: Maps = [
  [
    [15, 0],
    [-15, 0],
    [...bounds, [10, 0, 12, "y"], [-10, 0, 12, "y"], [0, 0, 12, "x"]],
  ],
];
