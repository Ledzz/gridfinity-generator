import * as Vec3 from "@jscad/modeling/src/maths/vec3/index.js";

export const splitLineSegmentByPlane = (plane, p1, p2) => {
  const direction = Vec3.subtract(Vec3.create(), p2, p1);
  let lambda = (plane[3] - Vec3.dot(plane, p1)) / Vec3.dot(plane, direction);
  if (Number.isNaN(lambda)) lambda = 0;
  if (lambda > 1) lambda = 1;
  if (lambda < 0) lambda = 0;

  Vec3.scale(direction, direction, lambda);
  Vec3.add(direction, p1, direction);
  return direction;
};
