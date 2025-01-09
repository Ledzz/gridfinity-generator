/*
 * Return a new 2D geometry representing the total space in the given 2D geometries.
 * @param {...geom2} geometries - list of 2D geometries to union
 * @returns {geom2} new 2D geometry
 */
import { flatten } from "@jscad/modeling/src/utils/index.js";
import { to3DWalls } from "./to3DWalls.js";
import { measureEpsilon } from "@jscad/modeling/src/measurements/index.js";
import { fromFakePolygons } from "./fromFakePolygons.js";
import { geom3 } from "@jscad/modeling/src/geometries/index";
import { union as unionGeom3 } from "./unionGeom3";

export const union = (...geometries) => {
  geometries = flatten(geometries);
  const newgeometries = geometries.map((geometry) =>
    to3DWalls({ z0: -1, z1: 1 }, geometry),
  );

  const newgeom3 = unionGeom3(newgeometries);
  const epsilon = measureEpsilon(newgeom3);

  return fromFakePolygons(epsilon, geom3.toPolygons(newgeom3));
};
