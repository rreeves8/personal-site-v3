import * as tf from "@tensorflow/tfjs";
import { Chess } from "chess.js";

export function createModel() {
  const model = tf.sequential({
    layers: [
      tf.layers.conv2d({
        inputShape: [8, 8, 12],
        filters: 64,
        kernelSize: 3,
        padding: "same",
        activation: "relu",
      }),
      tf.layers.conv2d({
        filters: 64,
        kernelSize: 3,
        padding: "same",
        activation: "relu",
      }),
      tf.layers.conv2d({
        filters: 12,
        kernelSize: 1,
        padding: "same",
        activation: "sigmoid",
      }),
    ],
  });

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: "binaryCrossentropy",
  });

  return model;
}

const pieceMap = new Map([
  ["p", 0],
  ["n", 1],
  ["b", 2],
  ["r", 3],
  ["q", 4],
  ["k", 5],
]);

export function chessToBitBoard(chess: Chess) {
  const board = chess.board();

  const tensor = tf.buffer([8, 8, 12]);

  board.forEach((r, x) => {
    r.forEach((p, y) => {
      if (p) {
        let zLayer = pieceMap.get(p.type)!;

        if (p.color === "w") {
          zLayer += 5;
        }

        const z = tensor.set(1, x, y, zLayer);
      }
    });
  });

  return tensor.toTensor();
}
