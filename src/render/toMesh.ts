import Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import { Geom2 } from "@jscad/modeling/src/geometries/geom2";
import { Path2 } from "@jscad/modeling/src/geometries/path2";
import { create2DLineObject } from "./geom2.ts";
import { createClosedPolygonObject } from "./path2.ts";
import { Mesh } from "three";
import { createComplexGeometry, createComplexMaterial } from "./geom3.ts";

export function toMesh(geom: Geom3 | Geom2) {
  if (isGeom2(geom)) {
    return create2DLineObject(geom);
  }
  if (isPath2(geom)) {
    return createClosedPolygonObject(geom);
  }
  if (isGeom3(geom)) {
    return new Mesh(createComplexGeometry(geom), createComplexMaterial(geom));
  }

  console.error("unknown geometry type");

  return;
}

function isGeom3(jsonData: Geom3 | Geom2): jsonData is Geom3 {
  return (jsonData as Geom3).polygons !== undefined;
}

function isGeom2(geom: Geom3 | Geom2): geom is Geom2 {
  return (geom as Geom2).sides !== undefined;
}

function isPath2(jsonData: Path2 | Geom3 | Geom2): jsonData is Path2 {
  return (jsonData as Path2).points !== undefined;
}
