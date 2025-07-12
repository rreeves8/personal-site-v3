"use client";

import { RefObject, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Euler, Quaternion } from "three";
import { useKeyboardControls } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { v4 as uuidv4 } from "uuid"; // npm install uuid
import { useBulletStore } from "./bullets";
import { Maps, useGameState } from "./game";
import { AStarFinder, Grid } from "pathfinding";

type Pos = [number, number];

function getPathToPlayer(
  player: Pos,
  ai: Pos,
  walls: Maps[number][2]
): [number, number][] {
  const gridWidth = 40;
  const gridHeight = 40;
  const grid = new Grid(gridWidth, gridHeight);

  const xOffset = Math.floor(gridWidth / 2);
  const yOffset = Math.floor(gridHeight / 2);

  for (const [cx, cy, length, dir] of walls) {
    const half = length / 2;

    for (let i = -half + 0.5; i < half; i++) {
      const x = dir === "x" ? cx + i : cx;
      const y = dir === "y" ? cy + i : cy;

      const gridX = Math.round(x + xOffset);
      const gridY = Math.round(-y + yOffset); // Y is inverted in screen space

      // Check bounds
      if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        grid.setWalkableAt(gridX, gridY, false);
      }
    }
  }

  const toGridCoords = ([x, y]: [number, number]) => [
    Math.floor(x + xOffset),
    Math.floor(-y + yOffset),
  ];

  const [startX, startY, endX, endY] = [
    ...toGridCoords(ai),
    ...toGridCoords(player),
  ];

  const finder = new AStarFinder();
  const path = finder.findPath(startX, startY, endX, endY, grid.clone());

  const fromGridCoords = (gx: number, gy: number): [number, number] => [
    gx - xOffset,
    -(gy - yOffset),
  ];

  return path.map(([gx, gy]) => fromGridCoords(gx, gy)).slice(3);
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
  const pathRef = useRef<[number, number][] | null>(null);
  const currentPathRef = useRef<number | null>(null);

  function getPath(player: RapierRigidBody, ai: RapierRigidBody, next = false) {
    function compute() {
      const playerVector = player.translation();
      const aiVector = ai.translation();
      pathRef.current = getPathToPlayer(
        [playerVector.x, playerVector.y],
        [aiVector.x + 3, aiVector.y],
        walls
      );
      currentPathRef.current = 0;
    }

    if (!pathRef.current) {
      compute();
      return pathRef.current![currentPathRef.current!];
    }

    if (next) {
      const nextPath = pathRef.current[currentPathRef.current! + 1];

      if (nextPath) {
        currentPathRef.current!++;
        return nextPath;
      } else {
        compute();
        return pathRef.current![currentPathRef.current!];
      }
    }

    return pathRef.current![currentPathRef.current!];
  }

  function angleDiff(
    moveTo: [number, number],
    ai: RapierRigidBody
  ): [number, number] {
    const pos = ai.translation();
    const target = new Vector3(moveTo[0], moveTo[1], 0);

    const dir = target.clone().sub(new Vector3(pos.x, pos.y, pos.z));

    const targetAngle = Math.atan2(dir.y, dir.x);
    const currentAngle = ai.rotation().z;

    return [
      Math.atan2(
        Math.sin(targetAngle - currentAngle),
        Math.cos(targetAngle - currentAngle)
      ),
      currentAngle,
    ];
  }

  useFrame((_, delta) => {
    const ai = tankRef.current;
    const state = stateRef.current;
    const player = playerRef.current;

    if (state && ai && player) {
      if (state === "rotate") {
        const dir = new Vector3(...getPath(player, ai, true), 0)
          .clone()
          .sub(ai.translation());
          
        const { x, y, z, w } = ai.rotation();
        const { z: currentAngle } = new Euler().setFromQuaternion(
          new Quaternion().set(x, y, z, w)
        );
        const angleDiff = Math.atan2(dir.y, dir.x) - currentAngle;

        const angle = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));

        if (Math.abs(angle) < 0.05) {
          stateRef.current = "move";
        } else {
          ai.setNextKinematicRotation(
            new Quaternion().setFromEuler(
              new Euler(0, 0, currentAngle + Math.sign(angleDiff) * 2 * delta)
            )
          );
        }
      }
      if (state === "move") {
        const [x, y] = getPath(player, ai);
        const pos = ai.translation(); // current RigidBody position
        const current = new Vector3(pos.x, pos.y, pos.z);
        const target = new Vector3(x, y, 0);
        const dir = target.clone().sub(current);

        const distance = dir.length();
        if (distance > 0.01) {
          const moveStep = dir.normalize().multiplyScalar(2 * delta);
          const next = current.add(moveStep);
          ai.setNextKinematicTranslation(next);
        } else {
          ai.setNextKinematicTranslation(target);
          stateRef.current = "rotate";
        }
      }
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
      type="kinematicPosition"
      ref={tankRef}
      gravityScale={0}
      position={[...initPos, 0.2]}
      userData={{ type: "player" }}
    >
      <mesh>
        <boxGeometry args={[2.5, 1.3, 1]} />
        <meshStandardMaterial color={"green"} />
      </mesh>
    </RigidBody>
  );
}
