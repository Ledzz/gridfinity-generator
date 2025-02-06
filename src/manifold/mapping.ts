import { Manifold } from "manifold-3d";

export const ManifoldEntries: [string, Manifold][] = [];

export const addManifold = (id: string, manifold: Manifold) => {
  ManifoldEntries.push([id, manifold]);
  return manifold;
};
