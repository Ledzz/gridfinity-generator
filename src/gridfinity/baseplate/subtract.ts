// import { cuboid } from "@jscad/modeling/src/primitives";
// import { subtract } from "../../app/utils/operations/booleans/subtract";
//
import { subtract } from "../utils/operations/gpu-subtract.ts";
import { cuboid } from "@jscad/modeling/src/primitives";

const cube1 = cuboid({
  size: [10, 10, 10],
  center: [10, 10, 10],
});
const cube2 = cuboid({
  size: [10, 10, 10],
  center: [5, 5, 5],
});

console.log("Input polygons:", cube1.polygons.length, cube2.polygons.length);
export const result = await subtract(cube1, cube2);
console.log("Result faces:", result);
