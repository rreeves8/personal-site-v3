"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Html, useKeyboardControls, KeyboardControls } from "@react-three/drei";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import { Player } from "./player";
import { Bullets, useBulletStore } from "./bullets";
import { Loading, Lighting, Floor, Wall, NavMesh, BackGround } from "./map";
import { Explosions, useExplosionStore } from "./explosions";
import { Ai } from "./Ai";
import { useFrame, Canvas } from "@react-three/fiber";
import { Mesh } from "three";
import { Spinner } from "@/components/ui/spinner";

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

function useResetGame() {
  const clearGame = useGameState((s) => s.clearGame);
  const clearBullets = useBulletStore((s) => s.clear);
  const clearExplosions = useExplosionStore((s) => s.clear);

  return function stopGame() {
    clearGame();
    clearBullets();
    clearExplosions();
  };
}

function Game({ game: { map } }: { game: GameADT }) {
  const playerRef = useRef<RapierRigidBody>(null);
  const [tank, ai, walls] = useMemo(() => maps[map], [map]);
  const isPaused = useGameState((s) => s.game && s.game.paused);
  const pauseGame = useGameState((s) => s.pauseGame);
  const gameOver = useGameState((s) => s.game && s.game.over);
  const useEscape = useKeyboardControls((s) => s.esc);
  const navMeshRef = useRef<Mesh>(null);

  const resetGame = useResetGame();

  useFrame(() => {
    if (useEscape && !isPaused) {
      pauseGame(true);
    }
  });

  return (
    <Suspense fallback={<Loading />}>
      <Physics paused={isPaused || gameOver !== false}>
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
                <Button onClick={() => resetGame()} variant={"destructive"}>
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
              <Button onClick={() => resetGame()}>Menu</Button>
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

export default function Tanks() {
  const game = useGameState((s) => s.game);
  const startGame = useGameState((s) => s.startGame);
  const resetGame = useResetGame();

  useEffect(() => {
    return resetGame;
  }, []);

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
        fallback={<Spinner />}
      >
        <Suspense fallback={<Loading />}>
          <Floor />
          <Lighting />
          {game ? (
            <Game game={game} />
          ) : (
            <Html fullscreen>
              <div className="flex justify-center items-center h-full">
                <div className="bg-secondary rounded-2xl flex flex-col items-center justify-between  gap-5">
                  <Button onClick={startGame} className="bg-green-600">
                    Start!
                  </Button>
                </div>
              </div>
            </Html>
          )}
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}
