"use client";
import { Vector3 } from "three";
import { RigidBody } from "@react-three/rapier";
import { create } from "zustand";
import { useExplosionStore } from "./explosions";
import { v4 as uuidv4 } from "uuid";
import { useGameState } from "./game";

type BulletADT = {
  id: string;
  position: Vector3;
  velocity: Vector3;
  bounceCount: number;
};

export const useBulletStore = create<{
  bullets: Array<BulletADT>;
  addBullet: (object: BulletADT) => void;
  removeBullet: (id: string) => void;
  incrementBounce: (id: string) => void;
  clear: () => void;
}>((set) => ({
  bullets: [],
  addBullet: (bullet: BulletADT) =>
    set((state) => ({ bullets: [...state.bullets, bullet] })),
  removeBullet: (id) =>
    set((state) => ({
      bullets: state.bullets.filter((b) => b.id !== id),
    })),
  incrementBounce: (id) =>
    set((state) => ({
      bullets: state.bullets.map((b) =>
        b.id === id ? { ...b, bounceCount: b.bounceCount + 1 } : b
      ),
    })),
  clear: () => set((s) => ({ ...s, bullets: [] })),
}));

export function Bullets() {
  const bullets = useBulletStore((state) => state.bullets);
  const incrementBounce = useBulletStore((state) => state.incrementBounce);
  const removeBullet = useBulletStore((state) => state.removeBullet);
  const setExplosion = useExplosionStore((s) => s.setExplosion);
  const gameLose = useGameState((s) => s.gameLose);

  return bullets.map((b, i) => (
    <RigidBody
      key={i}
      gravityScale={0}
      position={b.position}
      linearVelocity={b.velocity.toArray()}
      friction={0}
      restitution={1}
      canSleep={false}
      colliders="ball"
      enabledTranslations={[true, true, false]}
      enabledRotations={[false, false, true]}
      linearDamping={0}
      angularDamping={0}
      onCollisionEnter={(r) => {
        if (
          r.other.rigidBody &&
          r.other.rigidBody.userData &&
          typeof r.other.rigidBody.userData === "object" &&
          "type" in r.other.rigidBody.userData &&
          r.other.rigidBody.userData.type === "player" &&
          r.target.rigidBody
        ) {
          const other = r.target.rigidBody.translation();
          setExplosion({
            position: new Vector3(other.x, other.y - 1, other.z),
            id: uuidv4(),
          });
          removeBullet(b.id);
          gameLose();
          return;
        }

        incrementBounce(b.id);
        const newCount =
          useBulletStore.getState().bullets.find((x) => x.id === b.id)
            ?.bounceCount ?? 0;

        if (newCount >= 6) {
          removeBullet(b.id);
          if (r.target && r.target.rigidBody) {
            const pos = r.target.rigidBody?.translation();
            setExplosion({
              position: new Vector3(pos.x, pos.y, pos.z),
              id: uuidv4(),
            });
          }
        }
      }}
    >
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={"black"} />
      </mesh>
    </RigidBody>
  ));
}
