import Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import geom2, { Geom2 } from "@jscad/modeling/src/geometries/geom2";
import path2 from "@jscad/modeling/src/geometries/path2";
import { create2DLineObject } from "./geom2.ts";
import { createClosedPolygonObject } from "./path2.ts";
import { Mesh } from "three";
import { createComplexGeometry, createComplexMaterial } from "./geom3.ts";
import { geom3 } from "@jscad/modeling/src/geometries/index";

export function toMesh(geom: Geom3 | Geom2) {
  if (geom2.isA(geom)) {
    return create2DLineObject(geom);
  }
  if (path2.isA(geom)) {
    return createClosedPolygonObject(geom);
  }
  if (geom3.isA(geom)) {
    return new Mesh(createComplexGeometry(geom), createComplexMaterial(geom));
  }

  console.error("unknown geometry type");

  return;
}
