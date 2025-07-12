"use client";;
import { useMemo } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping } from "three";
import { Html } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Spinner } from "@/components/ui/spinner";

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
