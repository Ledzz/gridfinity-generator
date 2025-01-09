import { subtractGeom3Sub } from "./subtractGeom3Sub";
import { flatten } from "@jscad/modeling/src/utils/index.js";
import { retessellate } from "@jscad/modeling/src/operations/modifiers/index.js";
/*
 * Return a new 3D geometry representing space in this geometry but not in the given geometries.
 * Neither this geometry nor the given geometries are modified.
 * @param {...geom3} geometries - list of geometries
 * @returns {geom3} new 3D geometry
 */
export const subtract = (...geometries) => {
  geometries = flatten(geometries);

  let newgeometry = geometries.shift();
  geometries.forEach((geometry, index) => {
    console.time(`subtractGeom3Sub ${index}`);
    newgeometry = subtractGeom3Sub(newgeometry, geometry);
    console.timeEnd(`subtractGeom3Sub ${index}`);
  });
  console.time("retessellate");

  newgeometry = retessellate(newgeometry);
  console.timeEnd("retessellate");

  return newgeometry;
};
