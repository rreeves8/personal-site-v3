"use client";
import { forwardRef, ForwardRefRenderFunction, RefObject, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Euler, Quaternion } from "three";
import { useKeyboardControls } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { v4 as uuidv4 } from "uuid"; // npm install uuid
import { useBulletStore } from "./bullets";
import { useGameState } from "./game";

type Props = {
  pos: [number, number];
  tankRef: RefObject<RapierRigidBody | null>;
};

export function Player({ pos, tankRef }: Props) {
  const addBullet = useBulletStore((state) => state.addBullet);

  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);

  const left = useKeyboardControls((state) => state.left);
  const right = useKeyboardControls((state) => state.right);

  const fired = useRef(false);
  const space = useKeyboardControls((state) => state.space);

  useFrame(() => {
    if (space && !fired.current && tankRef.current) {
      fired.current = true;

      const tankPos = new Vector3().copy(tankRef.current.translation());
      const tankRot = tankRef.current.rotation();
      const quat = new Quaternion(tankRot.x, tankRot.y, tankRot.z, tankRot.w);
      const forwardDir = new Vector3(-1, 0, 0)
        .applyQuaternion(quat)
        .normalize();

      const bulletStart = tankPos
        .clone()
        .add(forwardDir.clone().multiplyScalar(2));

      addBullet({
        position: bulletStart,
        velocity: forwardDir.clone().multiplyScalar(7),
        bounceCount: 0,
        id: uuidv4(),
      });

      setTimeout(() => {
        fired.current = false;
      }, 3000);
    }
  });

  useFrame((_, delta) => {
    const rb = tankRef.current;
    if (!rb) return;

    const moveSpeed = 2;
    const rotationSpeed = 2;

    const rot = rb.rotation();
    const quat = new Quaternion(rot.x, rot.y, rot.z, rot.w);
    const euler = new Euler().setFromQuaternion(quat, "YXZ");

    const forwardVec = new Vector3(-1, 0, 0).applyEuler(euler).normalize();

    if (forward || backward) {
      const speed = forward ? moveSpeed : -moveSpeed;
      rb.setLinvel(forwardVec.multiplyScalar(speed), true);
    } else {
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    if (left || right) {
      const angularY = (right ? -1 : 1) * rotationSpeed;
      rb.setAngvel({ x: 0, y: 0, z: angularY }, true);
    } else {
      rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  const useEscape = useKeyboardControls((s) => s.esc);
  const pauseGame = useGameState((s) => s.pauseGame);
  const isPaused = useGameState((s) => s.game && s.game.paused);

  useFrame(() => {
    if (useEscape && !isPaused) {
      pauseGame(true);
    }
  });

  return (
    <RigidBody
      ref={tankRef}
      gravityScale={0}
      position={[...pos, 0.2]}
      userData={{ type: "player" }}
      name="Tank"
    >
      <mesh>
        <boxGeometry args={[2.5, 1.3, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </RigidBody>
  );
}
