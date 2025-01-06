import Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import geom2, { Geom2 } from "@jscad/modeling/src/geometries/geom2";
import path2, { Path2 } from "@jscad/modeling/src/geometries/path2";
import { create2DLineObject } from "./geom2.ts";
import { createClosedPolygonObject } from "./path2.ts";
import { Group, LineSegments, Mesh, Object3DEventMap } from "three";
import { createComplexGeometry, createComplexMaterial } from "./geom3.ts";
import { geom3 } from "@jscad/modeling/src/geometries/index";
import RecursiveArray from "@jscad/modeling/src/utils/recursiveArray";

export function toMesh(
  geom: Geom3 | Geom2 | Path2 | RecursiveArray<Geom3> | null,
): Mesh | LineSegments | Group<Object3DEventMap> | null {
  if (!geom) {
    return null;
  }
  // TODO: Fix orientation of geom2 and path2
  if (geom2.isA(geom)) {
    return create2DLineObject(geom);
  }
  if (path2.isA(geom)) {
    return createClosedPolygonObject(geom);
  }
  if (geom3.isA(geom)) {
    return new Mesh(createComplexGeometry(geom), createComplexMaterial(geom));
  }
  if (Array.isArray(geom)) {
    const group = new Group();

    const meshes = geom.map((g) => toMesh(g)).filter(Boolean);
    meshes.forEach((m) => group.add(m));

    return group;
  }

  console.error("unknown geometry type");

  return null;
}
