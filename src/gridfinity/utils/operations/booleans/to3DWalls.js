/*
 * Create a polygon (wall) from the given Z values and side.
 */
import geom2 from "@jscad/modeling/src/geometries/geom2";
import { geom3 } from "@jscad/modeling/src/geometries/index";
import * as Vec3 from "@jscad/modeling/src/maths/vec3/index.js";
import * as poly3 from "@jscad/modeling/src/geometries/poly3";

const to3DWall = (z0, z1, side) => {
  const points = [
    Vec3.fromVec2(Vec3.create(), side[0], z0),
    Vec3.fromVec2(Vec3.create(), side[1], z0),
    Vec3.fromVec2(Vec3.create(), side[1], z1),
    Vec3.fromVec2(Vec3.create(), side[0], z1),
  ];
  return poly3.create(points);
};

/*
 * Create a 3D geometry with walls, as constructed from the given options and geometry.
 *
 * @param {Object} options - options with Z offsets
 * @param {geom2} geometry - geometry used as base of walls
 * @return {geom3} the new geometry
 */
export const to3DWalls = (options, geometry) => {
  const sides = geom2.toSides(geometry);

  const polygons = sides.map((side) => to3DWall(options.z0, options.z1, side));

  const result = geom3.create(polygons);
  return result;
};
