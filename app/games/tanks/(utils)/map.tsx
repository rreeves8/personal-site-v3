"use client";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import {
  TextureLoader,
  RepeatWrapping,
  Shape,
  ShapeGeometry,
  Mesh,
  Path,
  PlaneGeometry,
  Vector2,
  ExtrudeGeometry,
  BufferGeometry,
  ShapeUtils,
  Float32BufferAttribute,
  DoubleSide,
} from "three";
import { Html } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Spinner } from "@/components/ui/spinner";
import { Maps } from "./game";
import { Pathfinding } from "three-pathfinding";

export function Wall({
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
    <RigidBody
      gravityScale={0}
      type="fixed"
      position={[...pos, 0.2]}
      friction={0}
      restitution={1}
    >
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

export function Floor() {
  const colorMap = useLoader(TextureLoader, "/assets/sand.jpg");
  const {
    viewport: { width, height },
  } = useThree();

  useMemo(() => {
    colorMap.wrapS = RepeatWrapping;
    colorMap.wrapT = RepeatWrapping;
    colorMap.repeat.set(width / 50, height / 50);
  }, [colorMap]);

  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={colorMap} side={2} />
    </mesh>
  );
}

export function BackGround() {
  const colorMap = useLoader(TextureLoader, "/assets/sand.jpg");
  const {
    viewport: { width, height },
  } = useThree();

  useMemo(() => {
    colorMap.wrapS = RepeatWrapping;
    colorMap.wrapT = RepeatWrapping;
    colorMap.repeat.set(width / 50, height / 50);
  }, [colorMap]);

  return <primitive attach="background" object={colorMap} />;
}

export function Lighting() {
  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <pointLight position={[0, 0, 15]} intensity={11} />
    </>
  );
}

export function Loading() {
  return (
    <Html center>
      <Spinner />
    </Html>
  );
}
