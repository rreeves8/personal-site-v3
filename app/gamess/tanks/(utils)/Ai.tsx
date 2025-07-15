"use client";
import { RefObject, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Euler, Quaternion, Mesh } from "three";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Pathfinding, Zone } from "three-pathfinding";

function to3({ x, y, z }: { x: number; y: number; z: number }) {
  return new Vector3(x, y, z);
}

export function Ai({
  initPos,
  playerRef,
  navMeshRef,
}: {
  initPos: [number, number];
  playerRef: RefObject<RapierRigidBody | null>;
  navMeshRef: RefObject<Mesh | null>;
}) {
  const tankRef = useRef<RapierRigidBody>(null);
  const stateRef = useRef<"move" | "moving" | "rotate" | "rotating" | "fire">(
    "rotate"
  );
  const pathRef = useRef<Vector3[] | null>(null);
  const currentPathRef = useRef<number | null>(null);

  function getPath(
    navMesh: Mesh,
    player: RapierRigidBody,
    ai: RapierRigidBody,
    next = false
  ) {
    if (!pathRef.current) {
      const playerVector = player.translation();
      const aiVector = ai.translation();
      pathRef.current = findPath(navMesh, to3(aiVector), to3(playerVector))!;
      currentPathRef.current = 0;
      return pathRef.current![currentPathRef.current!];
    }

    return pathRef.current![currentPathRef.current!];
  }

  useEffect(() => {
    const ai = tankRef.current;
    const state = stateRef.current;
    const player = playerRef.current;
    const navMesh = navMeshRef.current;
    if (navMesh && player && ai) {
      const target = getPath(navMesh, player, ai);
      console.log(target);
    }
  }, []);

  // useFrame((_, delta) => {
  //   const ai = tankRef.current;
  //   const state = stateRef.current;
  //   const player = playerRef.current;
  //   const navMesh = navMeshRef.current;
  //   if (state && ai && player && navMesh) {
  //     if (state === "rotate") {
  //       const current = to3(ai.translation());
  //       const target = getPath(navMesh, player, ai);

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
  //       const target = getPath(navMesh, player, ai);
  //       console.log(target);
  //       const dir = target.clone().sub(current);

  //       const distance = dir.length();

  //       if (distance > 0.01) {
  //         const moveStep = dir.normalize().multiplyScalar(2 * delta);
  //         const next = current.add(moveStep);
  //         ai.setNextKinematicTranslation(next);
  //       } else {
  //         ai.setNextKinematicTranslation(target);
  //         stateRef.current = "rotate";
  //         currentPathRef.current = currentPathRef.current! + 1;
  //       }
  //     }
  //   }
  // });

  return (
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
  );
}

import { BufferAttribute, BufferGeometry } from "three";
import { T } from "vitest/dist/chunks/reporters.d.C1ogPriE.js";

function distanceToSquared(a: Vector3, b: Vector3) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  var dz = a.z - b.z;

  return dx * dx + dy * dy + dz * dz;
}

type Node = Polygon & { centroid: Vector3 };

function getClosestNode(
  { nodes, vertices }: { nodes: Node[]; vertices: Zone["vertices"] },
  position: Vector3
): Node | null {
  let closestNode: null | Node = null;
  let closestDistance = Infinity;

  nodes.forEach((node) => {
    console.log(node);
    const distance = distanceToSquared(node.centroid, position);
    if (
      distance < closestDistance &&
      !Utils.isVectorInPolygon(position, node, vertices)
    ) {
      closestNode = node;
      closestDistance = distance;
    }
  });

  return closestNode;
}

function findPath(navMesh: Mesh, start: Vector3, end: Vector3) {
  const { groups, vertices } = Pathfinding.createZone(navMesh.geometry);

  const nodes = groups[0] as Node[];

  const closestNode = getClosestNode({ nodes, vertices }, start)!;
  const farthestNode = getClosestNode({ nodes, vertices }, end)!;

  const paths = AStar.search(
    nodes as unknown as AStarNode[],
    closestNode as unknown as AStarNode,
    farthestNode as unknown as AStarNode
  );

  const getPortalFromTo = function (
    a: AStarNode & { portals: Array<number[]> },
    b: AStarNode
  ) {
    for (var i = 0; i < a.neighbours.length; i++) {
      if (a.neighbours[i] === b.id) {
        return a.portals[i];
      }
    }
  };

  // We have the corridor, now pull the rope.
  const channel = new Channel();
  channel.push(start);

  for (let i = 0; i < paths.length; i++) {
    const polygon = paths[i];
    const nextPolygon = paths[i + 1];

    if (nextPolygon) {
      //@ts-ignore sadf
      const portals = getPortalFromTo(polygon, nextPolygon)!;
      channel.push(vertices[portals[0]], vertices[portals[1]]);
    }
  }
  channel.push(end);
  channel.stringPull();

  // Return the path, omitting first position (which is already known).
  const path = channel.path.map((c) => new Vector3(c.x, c.y, c.z));
  path.shift();

  return path;
}

type VectorLike = { x: number; y: number; z: number };
type Polygon = { vertexIds: number[] };

class Utils {
  static roundNumber(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  static sample<T>(list: T[]): T {
    return list[Math.floor(Math.random() * list.length)];
  }

  static distanceToSquared(a: VectorLike, b: VectorLike): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
  }

  static isPointInPoly(poly: VectorLike[], pt: VectorLike): boolean {
    let c = false;
    for (let i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
      if (
        ((poly[i].z <= pt.z && pt.z < poly[j].z) ||
          (poly[j].z <= pt.z && pt.z < poly[i].z)) &&
        pt.x <
          ((poly[j].x - poly[i].x) * (pt.z - poly[i].z)) /
            (poly[j].z - poly[i].z) +
            poly[i].x
      ) {
        c = !c;
      }
    }
    return c;
  }

  static isVectorInPolygon(
    vector: VectorLike,
    polygon: Polygon,
    vertices: VectorLike[]
  ): boolean {
    let lowestPoint = Infinity;
    let highestPoint = -Infinity;

    const polygonVertices: VectorLike[] = [];

    for (const vId of polygon.vertexIds) {
      const v = vertices[vId];
      lowestPoint = Math.min(v.y, lowestPoint);
      highestPoint = Math.max(v.y, highestPoint);
      polygonVertices.push(v);
    }

    return (
      vector.y < highestPoint + 0.5 &&
      vector.y > lowestPoint - 0.5 &&
      this.isPointInPoly(polygonVertices, vector)
    );
  }

  static triarea2(a: VectorLike, b: VectorLike, c: VectorLike): number {
    const ax = b.x - a.x;
    const az = b.z - a.z;
    const bx = c.x - a.x;
    const bz = c.z - a.z;
    return bx * az - ax * bz;
  }

  static vequal(a: VectorLike, b: VectorLike): boolean {
    return this.distanceToSquared(a, b) < 0.00001;
  }

  static mergeVertices(
    geometry: BufferGeometry,
    tolerance = 1e-4
  ): BufferGeometry {
    tolerance = Math.max(tolerance, Number.EPSILON);

    const hashToIndex: Record<string, number> = {};
    const indices = geometry.getIndex();
    const positions = geometry.getAttribute("position") as BufferAttribute;
    const vertexCount = indices ? indices.count : positions.count;

    let nextIndex = 0;
    const newIndices: number[] = [];
    const newPositions: number[] = [];

    const decimalShift = Math.log10(1 / tolerance);
    const shiftMultiplier = Math.pow(10, decimalShift);

    for (let i = 0; i < vertexCount; i++) {
      const index = indices ? indices.getX(i) : i;

      const hash =
        `${~~(positions.getX(index) * shiftMultiplier)},` +
        `${~~(positions.getY(index) * shiftMultiplier)},` +
        `${~~(positions.getZ(index) * shiftMultiplier)},`;

      if (hash in hashToIndex) {
        newIndices.push(hashToIndex[hash]);
      } else {
        newPositions.push(
          positions.getX(index),
          positions.getY(index),
          positions.getZ(index)
        );

        hashToIndex[hash] = nextIndex;
        newIndices.push(nextIndex);
        nextIndex++;
      }
    }

    const positionAttribute = new BufferAttribute(
      new Float32Array(newPositions),
      positions.itemSize,
      positions.normalized
    );

    const result = new BufferGeometry();
    result.setAttribute("position", positionAttribute);
    result.setIndex(newIndices);

    return result;
  }
}

interface AStarNode {
  id: number;
  neighbours: number[];
  centroid: VectorLike;

  // Runtime properties added by A*:
  f?: number;
  g?: number;
  h?: number;
  cost?: number;
  visited?: boolean;
  closed?: boolean;
  parent?: AStarNode | null;
}

class AStar {
  static init(graph: AStarNode[]) {
    for (let x = 0; x < graph.length; x++) {
      const node = graph[x];
      node.f = 0;
      node.g = 0;
      node.h = 0;
      node.cost = 1.0;
      node.visited = false;
      node.closed = false;
      node.parent = null;
    }
  }

  static cleanUp(graph: AStarNode[]) {
    for (let x = 0; x < graph.length; x++) {
      const node = graph[x];
      delete node.f;
      delete node.g;
      delete node.h;
      delete node.cost;
      delete node.visited;
      delete node.closed;
      delete node.parent;
    }
  }

  static heap(): BinaryHeap<AStarNode> {
    return new BinaryHeap((node: AStarNode) => node.f ?? 0);
  }

  static search(
    graph: AStarNode[],
    start: AStarNode,
    end: AStarNode
  ): AStarNode[] {
    this.init(graph);
    const openHeap = this.heap();
    openHeap.push(start);

    while (openHeap.size() > 0) {
      const currentNode = openHeap.pop();

      if (currentNode === end) {
        let curr: AStarNode | null = currentNode;
        const ret: AStarNode[] = [];
        while (curr.parent) {
          ret.push(curr);
          curr = curr.parent;
        }
        this.cleanUp(ret);
        return ret.reverse();
      }

      currentNode!.closed = true;

      const neighbours = this.neighbours(graph, currentNode!);

      for (let i = 0; i < neighbours.length; i++) {
        const neighbour = neighbours[i];

        if (neighbour.closed) continue;

        const gScore = currentNode!.g! + (neighbour.cost ?? 1);
        const beenVisited = neighbour.visited;

        if (!beenVisited || gScore < (neighbour.g ?? Infinity)) {
          neighbour.visited = true;
          neighbour.parent = currentNode;

          if (!neighbour.centroid || !end.centroid) {
            throw new Error("Unexpected state: Missing centroids");
          }

          neighbour.h =
            neighbour.h ?? this.heuristic(neighbour.centroid, end.centroid);
          neighbour.g = gScore;
          neighbour.f = neighbour.g + neighbour.h;

          if (!beenVisited) {
            openHeap.push(neighbour);
          } else {
            openHeap.rescoreElement(neighbour);
          }
        }
      }
    }

    return []; // no path found
  }

  static heuristic(pos1: VectorLike, pos2: VectorLike): number {
    return Utils.distanceToSquared(pos1, pos2);
  }

  static neighbours(graph: AStarNode[], node: AStarNode): AStarNode[] {
    const ret: AStarNode[] = [];
    for (let i = 0; i < node.neighbours.length; i++) {
      const n = graph[node.neighbours[i]];
      if (n) ret.push(n);
    }
    return ret;
  }
}

class BinaryHeap<T> {
  private content: T[] = [];
  private scoreFunction: (element: T) => number;

  constructor(scoreFunction: (element: T) => number) {
    this.scoreFunction = scoreFunction;
  }

  push(element: T): void {
    this.content.push(element);
    this.sinkDown(this.content.length - 1);
  }

  pop(): T | undefined {
    const result = this.content[0];
    const end = this.content.pop();

    if (this.content.length > 0 && end !== undefined) {
      this.content[0] = end;
      this.bubbleUp(0);
    }

    return result;
  }

  remove(node: T): void {
    const i = this.content.indexOf(node);
    const end = this.content.pop();

    if (i === -1 || end === undefined) return;

    if (i !== this.content.length) {
      this.content[i] = end;

      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  }

  size(): number {
    return this.content.length;
  }

  rescoreElement(node: T): void {
    const index = this.content.indexOf(node);
    if (index !== -1) this.sinkDown(index);
  }

  private sinkDown(n: number): void {
    const element = this.content[n];

    while (n > 0) {
      const parentN = ((n + 1) >> 1) - 1;
      const parent = this.content[parentN];

      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        n = parentN;
      } else {
        break;
      }
    }
  }

  private bubbleUp(n: number): void {
    const length = this.content.length;
    const element = this.content[n];
    const elemScore = this.scoreFunction(element);

    while (true) {
      const child2N = (n + 1) << 1;
      const child1N = child2N - 1;
      let swap: number | null = null;
      let child1Score: number;

      if (child1N < length) {
        const child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);

        if (child1Score < elemScore) {
          swap = child1N;
        }
      }

      if (child2N < length) {
        const child2 = this.content[child2N];
        const child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score!)) {
          swap = child2N;
        }
      }

      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      } else {
        break;
      }
    }
  }
}

interface Portal {
  left: VectorLike;
  right: VectorLike;
}

export class Channel {
  private portals: Portal[] = [];
  public path: VectorLike[] = [];

  constructor() {
    this.portals = [];
  }

  push(p1: VectorLike, p2?: VectorLike): void {
    if (p2 === undefined) p2 = p1;
    this.portals.push({ left: p1, right: p2 });
  }

  stringPull(): VectorLike[] {
    const portals = this.portals;
    const pts: VectorLike[] = [];

    if (portals.length === 0) return pts;

    let portalApex = portals[0].left;
    let portalLeft = portals[0].left;
    let portalRight = portals[0].right;

    let apexIndex = 0;
    let leftIndex = 0;
    let rightIndex = 0;

    pts.push(portalApex);

    for (let i = 1; i < portals.length; i++) {
      const left = portals[i].left;
      const right = portals[i].right;

      // Update right vertex
      if (Utils.triarea2(portalApex, portalRight, right) <= 0.0) {
        if (
          Utils.vequal(portalApex, portalRight) ||
          Utils.triarea2(portalApex, portalLeft, right) > 0.0
        ) {
          portalRight = right;
          rightIndex = i;
        } else {
          pts.push(portalLeft);
          portalApex = portalLeft;
          apexIndex = leftIndex;
          portalLeft = portalApex;
          portalRight = portalApex;
          leftIndex = apexIndex;
          rightIndex = apexIndex;
          i = apexIndex;
          continue;
        }
      }

      // Update left vertex
      if (Utils.triarea2(portalApex, portalLeft, left) >= 0.0) {
        if (
          Utils.vequal(portalApex, portalLeft) ||
          Utils.triarea2(portalApex, portalRight, left) < 0.0
        ) {
          portalLeft = left;
          leftIndex = i;
        } else {
          pts.push(portalRight);
          portalApex = portalRight;
          apexIndex = rightIndex;
          portalLeft = portalApex;
          portalRight = portalApex;
          leftIndex = apexIndex;
          rightIndex = apexIndex;
          i = apexIndex;
          continue;
        }
      }
    }

    const lastPortal = portals[portals.length - 1].left;
    if (pts.length === 0 || !Utils.vequal(pts[pts.length - 1], lastPortal)) {
      pts.push(lastPortal);
    }

    this.path = pts;
    return pts;
  }
}
