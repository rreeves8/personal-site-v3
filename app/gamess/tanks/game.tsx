"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import {
  TextureLoader,
  RepeatWrapping,
  Vector3,
  Group,
  Object3D,
  Raycaster,
  Euler,
  Quaternion,
  Mesh,
} from "three";
import {
  KeyboardControls,
  Preload,
  useKeyboardControls,
} from "@react-three/drei";
import { MTLLoader, OBJLoader, Vector } from "three/addons";
import {
  CapsuleCollider,
  CollisionEnterHandler,
  HeightfieldArgs,
  HeightfieldCollider,
  interactionGroups,
  Physics,
  RapierCollider,
  RapierRigidBody,
  RigidBody,
  RigidBodyOptions,
} from "@react-three/rapier";
import { create } from "zustand";

const useBulletStore = create<{
  bullets: Array<{ initPos: Vector3 }>;
  addBullet: (initPos: Vector3) => void;
}>((set) => ({
  bullets: new Array<{ initPos: Vector3 }>(),
  addBullet: (initPos: Vector3) =>
    set((state) => ({ bullets: [...state.bullets, { initPos }] })),
}));

function Bullets() {
  const bullets = useBulletStore((state) => state.bullets);

  return bullets.map((b, i) => (
    <RigidBody key={i} gravityScale={0} position={b.initPos}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"black"} />
      </mesh>
    </RigidBody>
  ));
}

function Tank({ pos }: { pos: [number, number] }) {
  const addBullet = useBulletStore((state) => state.addBullet);

  const tankRef = useRef<RapierRigidBody>(null);

  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);

  const left = useKeyboardControls((state) => state.left);
  const right = useKeyboardControls((state) => state.right);

  const fired = useRef(false);
  const space = useKeyboardControls((state) => state.space);

  useFrame(() => {
    if (space && !fired.current && tankRef.current) {
      fired.current = true;

      console.log(tankRef.current.translation());

      const rot = tankRef.current.rotation();
      const quat = new Quaternion(rot.x, rot.y, rot.z, rot.w);
      const euler = new Euler().setFromQuaternion(quat, "YXZ");

      const forwardVec = new Vector3(-4, 0, 0.2).add(
        tankRef.current.translation()
      );

      addBullet(forwardVec);

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

  return (
    <RigidBody ref={tankRef} gravityScale={0} position={[...pos, 0.2]}>
      <mesh>
        <boxGeometry args={[2.5, 1.3, 1]} />
        <meshStandardMaterial color={"green"} />
      </mesh>
    </RigidBody>
  );
}

function Wall({
  length,
  direction = "y",
  pos,
}: {
  length: number;
  direction?: "y" | "x";
  pos: [number, number];
}) {
  const texture = useLoader(TextureLoader, "/assets/brick.jpg");
  const ap = 2;
  const height = 4;
  const width = 0.6;

  const map = useMemo(() => {
    const m = texture.clone();
    m.wrapS = RepeatWrapping;
    m.wrapT = RepeatWrapping;
    m.repeat.set(width / ap, length / ap);

    if (direction !== "y") {
      m.rotation = Math.PI / 2;
    }

    return m;
  }, [texture]);

  return (
    <RigidBody gravityScale={0} type="fixed" position={[...pos, 0.2]}>
      <mesh>
        <boxGeometry
          args={
            direction === "x"
              ? [length, width, height]
              : [width, length, height]
          }
        />
        <meshStandardMaterial map={map} />
      </mesh>
    </RigidBody>
  );
}

function Floor() {
  const colorMap = useLoader(TextureLoader, "/assets/sand.jpg");
  const { viewport } = useThree();

  colorMap.wrapS = RepeatWrapping;
  colorMap.wrapT = RepeatWrapping;

  colorMap.repeat.set(viewport.width / 30, viewport.height / 30); // adjust the divisor to control scale

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshStandardMaterial map={colorMap} />
    </mesh>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <pointLight position={[0, 0, 15]} intensity={11} />
    </>
  );
}

export default function Tanks({ mapIndex = 0 }: { mapIndex?: number }) {
  const [camera, tank, walls] = useMemo(() => maps[mapIndex], [mapIndex]);

  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w"] },
        { name: "backward", keys: ["ArrowDown", "s"] },
        { name: "left", keys: ["ArrowLeft", "a"] },
        { name: "right", keys: ["ArrowRight", "d"] },
        { name: "space", keys: ["Space"] },
      ]}
    >
      <Canvas
        className="w-full h-full"
        orthographic
        camera={{
          position: [0, 0, 100],
          zoom: camera,
        }}
      >
        <Lighting />
        <Suspense fallback={null}>
          <Physics>
            <Floor />
            {walls.map(([x, y, length, dir], i) => (
              <Wall key={i} pos={[x, y]} length={length} direction={dir} />
            ))}
            <Tank pos={tank} />
            <Bullets />
          </Physics>
        </Suspense>
        <Preload all />
      </Canvas>
    </KeyboardControls>
  );
}

type Camera = number;

type Maps = Array<
  [Camera, [number, number], Array<[number, number, number, "x" | "y"]>]
>;

const maps: Maps = [
  [
    30,
    [15, 0],
    [
      [0, 9.5, 36, "x"],
      [18, 0, 19, "y"],
      [-18, 0, 19, "y"],
      [0, -9.5, 36, "x"],
      [10, 0, 12, "y"],
      [-10, 0, 12, "y"],
      [0, 0, 12, "x"],
    ],
  ],
];
