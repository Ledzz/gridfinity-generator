// import { Geom3 } from "@jscad/modeling/src/geometries/geom3";
// import { Poly3 } from "@jscad/modeling/src/geometries/poly3";
// import { Vec3 } from "@jscad/modeling/src/maths/vec3";
// import { create } from "@jscad/modeling/src/maths/mat4";
//
// // Type definition for JSCAD Mat4
// type Mat4 = [
//   number,
//   number,
//   number,
//   number,
//   number,
//   number,
//   number,
//   number,
//   number,
//   number,
//   number,
//   number,
//   number,
//   number,
//   number,
//   number,
// ];
//
// // Sparse Indices class to mimic Manifold's implementation
// class SparseIndices {
//   private data: Map<number, [number, number]> = new Map();
//
//   constructor() {}
//
//   // Encode two integers into a single 64-bit key
//   static encodePQ(p: number, q: number): number {
//     return (BigInt(p) << 32n) | BigInt(q);
//   }
//
//   get(index: number, first: boolean): number {
//     const entry = this.data.get(index);
//     return entry ? (first ? entry[0] : entry[1]) : -1;
//   }
//
//   set(index: number, first: number, second: number) {
//     this.data.set(index, [first, second]);
//   }
//
//   size(): number {
//     return this.data.size;
//   }
//
//   // Simplified sorting and filtering
//   sort() {}
//
//   keepFinite(xyzz: any[], s: any[]) {
//     // Remove entries that are not finite
//     const keysToRemove: number[] = [];
//     this.data.forEach((_, key) => {
//       if (!xyzz.some((v) => v !== undefined && v !== null)) {
//         keysToRemove.push(key);
//       }
//     });
//     keysToRemove.forEach((key) => this.data.delete(key));
//   }
// }
//
// // Vector and math utilities
// const vec3 = {
//   subtract: (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
//
//   dot: (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
//
//   cross: (a: Vec3, b: Vec3): Vec3 => [
//     a[1] * b[2] - a[2] * b[1],
//     a[2] * b[0] - a[0] * b[2],
//     a[0] * b[1] - a[1] * b[0],
//   ],
//
//   length: (v: Vec3): number =>
//     Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]),
//
//   transform: (v: Vec3, matrix: Mat4): Vec3 => [
//     matrix[0] * v[0] + matrix[1] * v[1] + matrix[2] * v[2] + matrix[3],
//     matrix[4] * v[0] + matrix[5] * v[1] + matrix[6] * v[2] + matrix[7],
//     matrix[8] * v[0] + matrix[9] * v[1] + matrix[10] * v[2] + matrix[11],
//   ],
//
//   // Fused multiply-add, approximating C++'s fma
//   fma: (a: number, b: number, c: number): number => a * b + c,
// };
//
// // Shadow 01 utility (simplified from Manifold implementation)
// const shadow01 = (
//   p0: Vec3,
//   q1: Vec3,
//   vertPosP: Vec3[],
//   vertPosQ: Vec3[],
//   expandP: number,
// ): { s01: number; yz01: Vec3 | null } => {
//   const shadows = (p: number, q: number, dir: number): boolean =>
//     p === q ? dir < 0 : p < q;
//
//   const s01 = shadows(q1[0], p0[0], expandP * (q1[0] < p0[0] ? 1 : -1))
//     ? 1
//     : -1;
//
//   const yz01: Vec3 = [0, p0[1], p0[2]];
//
//   return { s01, yz01 };
// };
//
// // Advanced subtract function following Manifold-like approach
// export const subtractGeom3 = (a: Geom3, b: Geom3): Geom3 => {
//   // Validate input
//   if (!a?.polygons?.length || !b?.polygons?.length) {
//     console.warn("Invalid input geometries");
//     return a;
//   }
//
//   // Use identity matrix if no transforms exist
//   const transformA = a.transforms || create();
//   const transformB = b.transforms || create();
//
//   // Transform polygons
//   const transformedAPolys = a.polygons.map((poly) => ({
//     ...poly,
//     vertices: poly.vertices.map((v) => vec3.transform(v, transformA)),
//   }));
//
//   const transformedBPolys = b.polygons.map((poly) => ({
//     ...poly,
//     vertices: poly.vertices.map((v) => vec3.transform(v, transformB)),
//   }));
//
//   // Level 3: Edge-triangle overlaps (broad phase)
//   const p1q2 = new SparseIndices();
//   const p2q1 = new SparseIndices();
//
//   // Find edge collisions
//   for (let i = 0; i < transformedAPolys.length; i++) {
//     for (let j = 0; j < transformedBPolys.length; j++) {
//       const polyA = transformedAPolys[i];
//       const polyB = transformedBPolys[j];
//
//       // Simplified edge collision detection
//       for (let a_vert = 0; a_vert < polyA.vertices.length; a_vert++) {
//         for (let b_vert = 0; b_vert < polyB.vertices.length; b_vert++) {
//           if (
//             vec3.length(
//               vec3.subtract(polyA.vertices[a_vert], polyB.vertices[b_vert]),
//             ) < 0.1
//           ) {
//             p1q2.set(p1q2.size(), i, j);
//             break;
//           }
//         }
//       }
//     }
//   }
//
//   // Vertex-triangle overlaps
//   const p0q2 = new SparseIndices();
//
//   // Generate additional intersection faces
//   const intersectionFaces: Poly3[] = [];
//
//   // Symbolic perturbation for subtraction (contract)
//   const expandP = -1.0;
//
//   // Find vertex overlaps
//   for (let i = 0; i < transformedAPolys.length; i++) {
//     const polyA = transformedAPolys[i];
//
//     for (let j = 0; j < transformedBPolys.length; j++) {
//       const polyB = transformedBPolys[j];
//
//       for (let a_vert = 0; a_vert < polyA.vertices.length; a_vert++) {
//         const vertex = polyA.vertices[a_vert];
//
//         // Simplified point-in-polygon test
//         const testVertices = polyB.vertices.slice(0, 3);
//         const [v0, v1, v2] = testVertices;
//
//         const normal = vec3.cross(vec3.subtract(v1, v0), vec3.subtract(v2, v0));
//
//         const d = -vec3.dot(normal, v0);
//         const dist = vec3.dot(normal, vertex) + d;
//
//         if (Math.abs(dist) < 1e-6) {
//           // Very close to the plane, consider as in polygon
//           p0q2.set(p0q2.size(), a_vert, j);
//
//           // Generate intersection face
//           if (testVertices.length >= 3) {
//             intersectionFaces.push({
//               vertices: testVertices,
//               plane: [normal[0], normal[1], normal[2], d],
//             });
//           }
//         }
//       }
//     }
//   }
//
//   // Collect result polygons
//   const resultPolygons: Poly3[] = [];
//
//   // Keep polygons from A not completely inside B
//   for (let i = 0; i < transformedAPolys.length; i++) {
//     const poly = transformedAPolys[i];
//
//     // Count vertices marked as inside B
//     const markedVertices = poly.vertices.filter((_, v_idx) =>
//       Array.from(
//         { length: p0q2.size() },
//         (_, j) => p0q2.get(j, true) === v_idx,
//       ).some(Boolean),
//     );
//
//     // If not all vertices are inside, keep the polygon
//     if (markedVertices.length < poly.vertices.length) {
//       resultPolygons.push(poly);
//     }
//   }
//
//   // Combine result with intersection faces
//   const finalPolygons = [...resultPolygons, ...intersectionFaces];
//
//   console.log("Input polygons:", a.polygons.length, b.polygons.length);
//   console.log("Result polygons:", finalPolygons.length);
//   console.log(
//     "Result face vertex counts:",
//     finalPolygons.map((p) => p.vertices.length),
//   );
//
//   return {
//     ...a,
//     polygons: finalPolygons,
//   };
// };
