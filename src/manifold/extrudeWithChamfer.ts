import { CrossSection } from "manifold-3d";

export const extrudeWithChamfer = (
  { height, chamfer }: { height: number; chamfer: number },
  shape: CrossSection,
) => {
  const reducedShape = shape.offset(chamfer, "Miter");
  return reducedShape
    .extrude(
      Math.abs(chamfer),
      undefined,
      undefined,

      [
        1 - chamfer / reducedShape.bounds().max[0],
        1 - chamfer / reducedShape.bounds().max[1],
      ],
    )
    .add(
      shape
        .extrude(height - Math.abs(chamfer))
        .translate([0, 0, Math.abs(chamfer)]),
    );
};
