import { cuboid } from "@jscad/modeling/src/primitives";

interface BaseplateGeomProps {
  style: "refined-lite";
}

export const baseplate = ({
  style = "refined-lite",
}: Partial<BaseplateGeomProps> = {}) => {
  switch (style) {
    case "refined-lite":
      return cuboid();
  }

  console.warn("Unknown baseplate style:", style);
  return null;
};
