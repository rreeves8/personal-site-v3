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

export function NavMesh({
  meshRef,
  walls,
}: {
  walls: Maps[number][2];
  meshRef: RefObject<Mesh | null>;
}) {
  const {
    viewport: { width, height },
  } = useThree();

  const { geometry, nodePositions } = useMemo(() => {
    const halfW = width / 2;
    const halfH = height / 2;

    const shape = new Shape();

    shape.moveTo(-halfW, -halfH);
    shape.lineTo(halfW, -halfH);
    shape.lineTo(halfW, halfH);
    shape.lineTo(-halfW, halfH);
    shape.lineTo(-halfW, -halfH);

    walls.forEach(([centroidX, centroidY, length, dir]) => {
      const path = new Path();
      if (dir === "y") {
        path.moveTo(centroidX - 0.6 / 2, centroidY + length / 2);
        path.lineTo(centroidX - 0.6 / 2, centroidY - length / 2);
        path.lineTo(centroidX + 0.6 / 2, centroidY - length / 2);
        path.lineTo(centroidX + 0.6 / 2, centroidY + length / 2);
      } else {
        path.moveTo(centroidX - length / 2, centroidY + 0.6 / 2);
        path.lineTo(centroidX - length / 2, centroidY - 0.6 / 2);
        path.lineTo(centroidX + length / 2, centroidY - 0.6 / 2);
        path.lineTo(centroidX + length / 2, centroidY + 0.6 / 2);
      }
      shape.holes.push(path);
    });

    const geometry = new ExtrudeGeometry(shape, {
      depth: 0.1,
      bevelEnabled: false,
    });

    geometry.computeVertexNormals();

    const outerPoints = shape.getPoints().map((p) => new Vector2(p.x, p.y));
    const holePolygons = shape.holes.map((h) =>
      h.getPoints().map((p) => new Vector2(p.x, p.y))
    );

    function pointInPolygon(point: Vector2, polygon: Vector2[]): boolean {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x,
          yi = polygon[i].y;
        const xj = polygon[j].x,
          yj = polygon[j].y;

        const intersect =
          yi > point.y !== yj > point.y &&
          point.x < ((xj - xi) * (point.y - yi)) / (yj - yi + 0.00001) + xi;

        if (intersect) inside = !inside;
      }
      return inside;
    }

    const nodePositions: [number, number][] = [];
    for (let x = -halfW; x < halfW; x += 0.5) {
      for (let y = -halfH; y < halfH; y += 0.5) {
        const point = new Vector2(x, y);
        const inOuter = pointInPolygon(point, outerPoints);
        const inAnyHole = holePolygons.some((poly) =>
          pointInPolygon(point, poly)
        );
        if (inOuter && !inAnyHole) {
          nodePositions.push([x, y]);
        }
      }
    }

    return { geometry, nodePositions };
  }, [width, height]);

  return (
    // <mesh ref={meshRef} geometry={geometry}>
    //   <meshStandardMaterial color="blue" transparent opacity={0.2} />
    //   {nodePositions.map(([x, y], i) => (
    //     <mesh key={i} position={[x, y, 0.11]}>
    //       <sphereGeometry args={[0.05, 8, 8]} />
    //       <meshStandardMaterial color="yellow" />
    //     </mesh>
    //   ))}
    // </mesh>
    <></>
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
