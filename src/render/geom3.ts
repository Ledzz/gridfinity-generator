import Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Matrix4,
  MeshStandardMaterial,
} from "three";

export function createComplexGeometry(jsonData: Geom3) {
  // Create a new BufferGeometry
  const geometry = new BufferGeometry();

  // Arrays to store all vertex positions and indices
  const positions = [];
  const indices = [];
  let vertexIndex = 0;

  // Process each polygon
  jsonData.polygons.forEach((polygon) => {
    // Add vertices for this polygon
    // Swap y and z axes to match Three.js coordinate system
    polygon.vertices.forEach((vertex) => {
      positions.push(vertex[0], vertex[1], vertex[2]);
    });

    // For polygons with more than 3 vertices, we need to triangulate
    // We'll use a simple fan triangulation
    const numVertices = polygon.vertices.length;
    for (let i = 1; i < numVertices - 1; i++) {
      indices.push(vertexIndex, vertexIndex + i, vertexIndex + i + 1);
    }

    vertexIndex += numVertices;
  });

  // Create attributes
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);

  // Compute vertex normals for proper lighting
  geometry.computeVertexNormals();

  // Apply transforms if provided
  if (jsonData.transforms) {
    const matrix = new Matrix4();
    matrix.fromArray(jsonData.transforms);
    geometry.applyMatrix4(matrix);
  }

  return geometry;
}

export function createComplexMaterial(jsonData: Geom3) {
  // Extract color components
  const [r, g, b, a] = jsonData.color ?? [0.5, 0.5, 0.5, 1];

  // Create material with proper transparency handling
  const material = new MeshStandardMaterial({
    color: new Color(r, g, b),
    opacity: a,
    transparent: a < 1,
  });

  return material;
}
