import { Polygons, SimplePolygon, Vec2 } from "manifold-3d";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;
const fontSize = 72;

// Set canvas size to be larger to handle text better
canvas.width = 1000;
canvas.height = 300;

export const textToPolygons = (text: string): Polygons => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "black";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const visited = new Uint8Array(canvas.width * canvas.height);

  const getPixel = (x: number, y: number): number => {
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return 0;
    const idx = y * canvas.width + x;
    return data[idx * 4 + 3] > 128 ? 1 : 0;
  };

  const markVisited = (x: number, y: number) => {
    const idx = y * canvas.width + x;
    visited[idx] = 1;
  };

  const isVisited = (x: number, y: number): boolean => {
    const idx = y * canvas.width + x;
    return visited[idx] === 1;
  };

  const findStartPoint = (): Vec2 | null => {
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        if (getPixel(x, y) === 1 && !isVisited(x, y)) {
          return [x, y];
        }
      }
    }
    return null;
  };

  const directions: Vec2[] = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  const traceContour = (startX: number, startY: number): SimplePolygon => {
    const contour: SimplePolygon = [];
    let x = startX;
    let y = startY;
    let dirIndex = 0;
    let steps = 0;
    const maxSteps = 1000; // Safety limit

    while (steps < maxSteps) {
      if (!isVisited(x, y)) {
        contour.push([x, y]);
        markVisited(x, y);
      }

      // Try all directions
      let moved = false;
      for (let i = 0; i < directions.length; i++) {
        const newDir = (dirIndex + i) % directions.length;
        const [dx, dy] = directions[newDir];
        const newX = x + dx;
        const newY = y + dy;

        if (getPixel(newX, newY) === 1 && !isVisited(newX, newY)) {
          x = newX;
          y = newY;
          dirIndex = newDir;
          moved = true;
          break;
        }
      }

      if (!moved) {
        // If we can't move and we're close to start, connect back
        if (
          contour.length > 2 &&
          Math.abs(x - startX) <= 1 &&
          Math.abs(y - startY) <= 1
        ) {
          contour.push([startX, startY]);
        }
        break;
      }

      steps++;
    }

    return contour;
  };

  const simplifyPolygon = (poly: SimplePolygon): SimplePolygon => {
    if (poly.length < 3) return poly;

    const simplified: SimplePolygon = [poly[0]];
    const threshold = 3;

    for (let i = 1; i < poly.length - 1; i++) {
      const curr = poly[i];
      const prev = simplified[simplified.length - 1];
      const dx = curr[0] - prev[0];
      const dy = curr[1] - prev[1];

      if (dx * dx + dy * dy >= threshold * threshold) {
        simplified.push(curr);
      }
    }

    simplified.push(poly[poly.length - 1]);
    return simplified;
  };

  const polygons: SimplePolygon[] = [];
  let start: Vec2 | null;

  while ((start = findStartPoint()) !== null) {
    const contour = traceContour(start[0], start[1]);
    if (contour.length > 10) {
      const simplified = simplifyPolygon(contour);
      if (simplified.length >= 3) {
        polygons.push(simplified);
      }
    }
  }

  return polygons;
};
