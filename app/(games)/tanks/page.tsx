"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh } from "three";

function Box(props: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  // useFrame((state, delta) => {
  //   if (ref.current) {
  //     ref.current.rotation.x += delta;

  //     //ref.current.position.setX(0.01 + ref.current.position.x);
  //   }
  // });

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default function Pong() {
  return (
    <div className="w-4/5 flex flex-1 justify-center mx-auto">
      <Canvas className=" ">
        <Lighting />

        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />

        <mesh visible userData={{ hello: "world" }} position={[1, 1, 0]}>
          <planeGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="hotpink" transparent />
        </mesh>
      </Canvas>
    </div>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    </>
  );
}
