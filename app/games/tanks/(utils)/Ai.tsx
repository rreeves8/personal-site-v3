"use client";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Vector3,
  Euler,
  Quaternion,
  Mesh,
  Shape,
  Vector2,
  Path,
  BufferGeometry,
  LineBasicMaterial,
} from "three";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Line } from "@react-three/drei";

import PF from "pathfinding";
import { Maps } from "./game";

function to3({ x, y, z }: { x: number; y: number; z: number }) {
  return new Vector3(x, y, z);
}

export function Ai({
  initPos,
  playerRef,
  walls,
}: {
  initPos: [number, number];
  playerRef: RefObject<RapierRigidBody | null>;
  walls: Maps[number][2];
}) {
  const tankRef = useRef<RapierRigidBody>(null);
  const stateRef = useRef<"move" | "moving" | "rotate" | "rotating" | "fire">(
    "rotate"
  );
  const pathRef = useRef<Vector3[]>(null);
  const pathRefIndex = useRef<number>(0);

  const {
    viewport: { width, height },
  } = useThree();

  const { matrix } = useNavMeshMatrix(walls, width, height);

  // useFrame((_, delta) => {
  //   const ai = tankRef.current;
  //   const state = stateRef.current;
  //   const player = playerRef.current;

  //   if (state && ai && player) {
  //     if (!pathRef.current) {
  //       getPath(matrix, player.translation(), ai.translation(), height, width);
  //     }

  //     if (state === "rotate") {
  //       const current = to3(ai.translation());
  //       const target = pathRef.current![pathRefIndex.current];
  //       pathRefIndex.current++;
  //       const dir = target.clone().sub(current);
  //       const targetAngle = Math.atan2(dir.y, dir.x);

  //       const rapierQuat = ai.rotation();
  //       const threeQuat = new Quaternion().set(
  //         rapierQuat.x,
  //         rapierQuat.y,
  //         rapierQuat.z,
  //         rapierQuat.w
  //       );
  //       const currentEuler = new Euler().setFromQuaternion(threeQuat);
  //       const currentAngle = currentEuler.z;

  //       let angleDiff = targetAngle - currentAngle;
  //       angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));

  //       const ROTATE_SPEED = 2; // radians/sec
  //       if (Math.abs(angleDiff) < 0.05) {
  //         stateRef.current = "move";
  //       } else {
  //         const newAngle =
  //           currentAngle + Math.sign(angleDiff) * ROTATE_SPEED * delta;
  //         const newQuat = new Quaternion().setFromEuler(
  //           new Euler(0, 0, newAngle)
  //         );
  //         ai.setNextKinematicRotation(newQuat);
  //       }
  //     }
  //     if (state === "move") {
  //       const current = to3(ai.translation());
  //       const target = pathRef.current![pathRefIndex.current];

  //       const dir = target.clone().sub(current);

  //       const distance = dir.length();

  //       if (distance > 0.01) {
  //         const moveStep = dir.normalize().multiplyScalar(2 * delta);
  //         const next = current.add(moveStep);
  //         ai.setNextKinematicTranslation(next);
  //       } else {
  //         ai.setNextKinematicTranslation(target);
  //         stateRef.current = "rotate";
  //       }
  //     }
  //   }
  // });

  const material = new LineBasicMaterial({ color: 0x00ff00 }); // Green line

  return (
    <>
      <Line
        points={getPath(
          matrix,
          { x: -18, y: 0 },
          { x: 18, y: 0 },
          height,
          width
        )}
        color="cyan"
        lineWidth={2} // only works with WebGL2 + wide lines support
      />
      <RigidBody
        ref={tankRef}
        gravityScale={0}
        position={[...initPos, 0.2]}
        userData={{ type: "ai" }}
        type="kinematicPosition"
      >
        <mesh>
          <boxGeometry args={[2.5, 1.3, 1]} />
          <meshStandardMaterial color={"red"} />
        </mesh>
      </RigidBody>
    </>
  );
}

type Vector = { x: number; y: number };

function getPath(
  matrix: number[][],
  player: Vector,
  ai: Vector,
  h: number,
  w: number
) {
  const { x: startX, y: startY } = ai;
  const { x: endX, y: endY } = player;
  const step = 0.5;
  const { col: startCol, row: startRow } = worldToGrid(
    startX,
    startY,
    w,
    h,
    step
  );
  const { col: endCol, row: endRow } = worldToGrid(endX, endY, w, h, step);

  const grid = new PF.Grid(matrix);
  const finder = new PF.AStarFinder({
    dontCrossCorners: true,
    diagonalMovement: PF.DiagonalMovement.Always,
  });

  return finder
    .findPath(startCol, startRow, endCol, endRow, grid)
    .map(([col, row]) => {
      const { x, y } = gridToWorld(col, row, w, h, step);
      return new Vector3(x, y, 0);
    });
}

function worldToGrid(
  x: number,
  y: number,
  width: number,
  height: number,
  step = 0.5
) {
  const halfW = width / 2;
  const halfH = height / 2;

  const col = Math.floor((x + halfW) / step);
  const row = Math.floor((y + halfH) / step);

  return { col, row };
}

function gridToWorld(
  col: number,
  row: number,
  width: number,
  height: number,
  step = 0.5
) {
  const halfW = width / 2;
  const halfH = height / 2;

  const x = -halfW + col * step + step / 2;
  const y = -halfH + row * step + step / 2;

  return { x, y };
}

export function useNavMeshMatrix(
  walls: Maps[number][2],
  width: number,
  height: number,
  step = 0.5
) {
  return useMemo(() => {
    const halfW = width / 2;
    const halfH = height / 2;

    // 1. Create the outer shape
    const shape = new Shape();
    shape.moveTo(-halfW, -halfH);
    shape.lineTo(halfW, -halfH);
    shape.lineTo(halfW, halfH);
    shape.lineTo(-halfW, halfH);
    shape.lineTo(-halfW, -halfH);

    // 2. Add wall holes
    walls.forEach(([centroidX, centroidY, length, dir]) => {
      const path = new Path();
      if (dir === "y") {
        path.moveTo(centroidX - 0.3, centroidY + length / 2);
        path.lineTo(centroidX - 0.3, centroidY - length / 2);
        path.lineTo(centroidX + 0.3, centroidY - length / 2);
        path.lineTo(centroidX + 0.3, centroidY + length / 2);
      } else {
        path.moveTo(centroidX - length / 2, centroidY + 0.3);
        path.lineTo(centroidX - length / 2, centroidY - 0.3);
        path.lineTo(centroidX + length / 2, centroidY - 0.3);
        path.lineTo(centroidX + length / 2, centroidY + 0.3);
      }
      path.closePath();
      shape.holes.push(path);
    });

    // 3. Prepare polygon data
    const outerPoints = shape.getPoints().map((p) => new Vector2(p.x, p.y));
    const holePolygons = shape.holes.map((h) =>
      h.getPoints().map((p) => new Vector2(p.x, p.y))
    );

    function pointInPolygon(point: Vector2, polygon: Vector2[]) {
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

    // 4. Generate matrix
    const cols = Math.floor(width / step);
    const rows = Math.floor(height / step);

    const matrix: number[][] = [];

    for (let j = 0; j < rows; j++) {
      const row: number[] = [];
      for (let i = 0; i < cols; i++) {
        const x = -halfW + i * step + step / 2;
        const y = -halfH + j * step + step / 2;

        const point = new Vector2(x, y);
        const inOuter = pointInPolygon(point, outerPoints);
        const inAnyHole = holePolygons.some((poly) =>
          pointInPolygon(point, poly)
        );

        row.push(inOuter && !inAnyHole ? 0 : 1); // 0 = walkable, 1 = wall
      }
      matrix.push(row);
    }

    return { matrix, cols, rows };
  }, [walls, width, height, step]);
}
