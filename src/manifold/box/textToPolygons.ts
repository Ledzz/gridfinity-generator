import { Polygons, SimplePolygon } from "manifold-3d";
import { load } from "opentype.js";

export const textToPolygons = (
  text: string,
  fontSize: number,
): Promise<Polygons> =>
  new Promise((resolve) => {
    load("fonts/arial.ttf")
      .then((f) => {
        const path = f.getPath(text, 0, 0, fontSize);
        const polygons: Polygons = [];

        let currentPolygon: SimplePolygon = [];
        path.commands.forEach((command) => {
          const steps = 10;
          const lastPoint = currentPolygon[currentPolygon.length - 1];
          switch (command.type) {
            case "M":
              currentPolygon = [[command.x, command.y]];
              break;
            case "L":
              currentPolygon.push([command.x, command.y]);
              break;
            case "Q":
              for (let i = 0; i <= steps; i++) {
                const param = i / steps;
                const x =
                  (1 - param) * (1 - param) * lastPoint[0] +
                  2 * (1 - param) * param * command.x1 +
                  param * param * command.x;
                const y =
                  (1 - param) * (1 - param) * lastPoint[1] +
                  2 * (1 - param) * param * command.y1 +
                  param * param * command.y;
                currentPolygon.push([x, y]);
              }
              break;
            case "C":
              // TODO: Arial has only Q, so skip it for now
              break;
            case "Z":
              // @ts-expect-error wtf
              polygons.push(currentPolygon);
              currentPolygon = [];
              break;
          }
        });
        resolve(polygons);
      })
      .catch((e) => {
        console.error(e);
      });
  });
