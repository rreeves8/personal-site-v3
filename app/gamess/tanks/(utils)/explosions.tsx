"use client";

import { useSpriteLoader, SpriteAnimator } from "@react-three/drei";
import { Vector3 } from "three";
import { create } from "zustand";

type ExplosionADT = {
  id: string;
  position: Vector3;
};

export const useExplosionStore = create<{
  explosions: Array<ExplosionADT>;
  setExplosion: (object: ExplosionADT) => void;
  clearExplosion: (id: string) => void;
  clear: () => void;
}>((set) => ({
  explosions: [],
  setExplosion: (object) =>
    set((s) => ({ explosions: [...s.explosions, object] })),
  clearExplosion: (id) =>
    set((state) => ({
      explosions: state.explosions.filter((b) => b.id !== id),
    })),
  clear: () => set((s) => ({ ...s, explosions: [] })),
}));

export function Explosions() {
  const { spriteObj } = useSpriteLoader(
    "/assets/explosion/sprite.png",
    "/assets/explosion/data.json"
  );

  const explosions = useExplosionStore((s) => s.explosions);
  const clearExplosions = useExplosionStore((s) => s.clearExplosion);

  return explosions.map((e, i) => (
    <SpriteAnimator
      key={i}
      autoPlay
      position={[e.position.x, e.position.y, 2]}
      scale={[3, 3, 3]}
      spriteDataset={spriteObj}
      onEnd={() => clearExplosions(e.id)}
    />
  ));
}
