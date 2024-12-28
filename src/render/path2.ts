import { Path2 } from "@jscad/modeling/src/geometries/path2";
import {
  BufferGeometry,
  Color,
  DoubleSide,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Shape,
  ShapeGeometry,
} from "three";

function createPath2Geometry(jsonData: Path2): BufferGeometry | null {
  // Create a new BufferGeometry
  const geometry = new BufferGeometry();

  const points = jsonData.points;

  if (points.length < 3) {
    console.error("Need at least 3 points to create a polygon");
    return null;
  }

  // For filled polygon, we need to triangulate
  // Convert points to 2D shape for triangulation
  const shape = new Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  if (jsonData.isClosed) {
    shape.closePath();
  }

  // Create geometry from shape
  const shapeGeometry = new ShapeGeometry(shape);
  geometry.setAttribute("position", shapeGeometry.getAttribute("position"));
  geometry.setIndex(shapeGeometry.getIndex());

  // Apply transforms if provided
  if (jsonData.transforms) {
    const matrix = new Matrix4();
    matrix.fromArray(jsonData.transforms);
    geometry.applyMatrix4(matrix);
  }

  return geometry;
}

function createPolygonMaterial(jsonData: Path2) {
  const [r = 0.5, g = 0.5, b = 0.5, a = 1] = jsonData.color ?? [];
  return new MeshBasicMaterial({
    color: new Color(r, g, b),
    opacity: a,
    transparent: a < 1,
    side: DoubleSide,
  });
}

export function createClosedPolygonObject(jsonData: Path2) {
  const geometry = createPath2Geometry(jsonData);
  const material = createPolygonMaterial(jsonData);
  if (!geometry) {
    return null;
  }

  return new Mesh(geometry, material);
}
