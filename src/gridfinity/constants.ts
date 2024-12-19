import Vec2 from "@jscad/modeling/src/maths/vec2/type";

export const basePoly = [
  [0, 0], // Innermost bottom point
  [0.8, 0.8], // Up and out at a 45 degree angle
  [0.8, 0.8 + 1.8], // Straight up
  [0.8 + 2.15, 0.8 + 1.8 + 2.15], // Up and out at a 45 degree angle
  [0, 0.8 + 1.8 + 2.15],
] satisfies Vec2[];
export const baseWidth = Math.max(...basePoly.map((point) => point[0]));
export const baseHeight = Math.max(...basePoly.map((point) => point[1]));
