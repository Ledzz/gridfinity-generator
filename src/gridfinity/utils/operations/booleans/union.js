import geom2 from "@jscad/modeling/src/geometries/geom2";
import { geom3 } from "@jscad/modeling/src/geometries/index";
import { union as unionGeom2 } from "./unionGeom2";
import { union as unionGeom3 } from "./unionGeom3";
import {
  areAllShapesTheSameType,
  flatten,
} from "@jscad/modeling/src/utils/index.js";

/**
 * Return a new geometry representing the total space in the given geometries.
 * The given geometries should be of the same type, either geom2 or geom3.
 *
 * @param {...Object} geometries - list of geometries
 * @returns {geom2|geom3} a new geometry
 * @alias module:modeling/booleans.union
 *
 * @example
 * let myshape = union(cube({size: [5,5,5]}), cube({size: [5,5,5], center: [5,5,5]}))
 *
 * @example
 * +-------+            +-------+
 * |       |            |       |
 * |   A   |            |       |
 * |    +--+----+   =   |       +----+
 * +----+--+    |       +----+       |
 *      |   B   |            |       |
 *      |       |            |       |
 *      +-------+            +-------+
 */
export const union = (...geometries) => {
  geometries = flatten(geometries);
  if (geometries.length === 0) throw new Error("wrong number of arguments");

  if (!areAllShapesTheSameType(geometries)) {
    throw new Error("only unions of the same type are supported");
  }

  const geometry = geometries[0];
  // if (path.isA(geometry)) return pathunion(matrix, geometries)
  if (geom2.isA(geometry)) return unionGeom2(geometries);
  if (geom3.isA(geometry)) return unionGeom3(geometries);
  return geometry;
};
