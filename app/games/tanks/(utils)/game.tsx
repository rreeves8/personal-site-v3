"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Html, useKeyboardControls, KeyboardControls } from "@react-three/drei";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import { Player } from "./player";
import { Bullets, useBulletStore } from "./bullets";
import { Loading, Lighting, Floor, Wall, NavMesh } from "./map";
import { Explosions, useExplosionStore } from "./explosions";
import { Ai } from "./Ai";
import { useFrame, Canvas } from "@react-three/fiber";
import { Box3, Mesh, Vector3 } from "three";
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

  const resetGame = useResetGame();

  useFrame(() => {
    if (useEscape && !isPaused) {
      pauseGame(true);
    }
  });

  return (
    <Suspense fallback={<Loading />}>
      <Physics paused={isPaused || gameOver !== false}>
        {walls.map(([x, y, length, dir], i) => (
          <Wall key={i} pos={[x, y]} length={length} direction={dir} />
        ))}
        <Player pos={tank} tankRef={playerRef} />
        <Ai initPos={ai} playerRef={playerRef} walls={walls} />
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

const screenAspect = 19.5 / 9; // L / H;

const L = 45;
const H = L / screenAspect;

const bounds: Maps[number][2] = [
  [0, H / 2, L + 0.6, "x"],
  [L / 2, 0, H - 0.6, "y"],
  [0, -(H / 2), L + 0.6, "x"],
  [-(L / 2), 0, H - 0.6, "y"],
];

const maps: Maps = [
  [
    [18, 0],
    [-18, 0],
    [...bounds, [13, 0, 12, "y"], [-13, 0, 12, "y"], [0, 0, 12, "x"]],
  ],
];

export default function Tanks({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const game = useGameState((s) => s.game);
  const startGame = useGameState((s) => s.startGame);
  const resetGame = useResetGame();

  useEffect(() => {
    return resetGame;
  }, []);

  const zoom = useMemo(
    function getCamera() {
      const x = L / 2;
      const y = H / 2;
      const boundingBox = new Box3().setFromPoints([
        new Vector3(-x, y, 0),
        new Vector3(-x, -y, 0),
        new Vector3(x, -y, 0),
        new Vector3(x, y, 0),
      ]);

      const s = boundingBox.getSize(new Vector3());

      const aspect = width / height;

      if (aspect > 1.0) {
        return height / (s.y * 1.25);
      } else {
        return width / (s.x * 1.25);
      }
    },
    [width, height]
  );

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
          zoom: zoom,
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
