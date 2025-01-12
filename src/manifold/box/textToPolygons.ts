const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const fontSize = 72;

// Set canvas size
canvas.width = 800;
canvas.height = 200;

export const textToPolygons = (text) => {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set text properties
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "black";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  // Draw text
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Function to get pixel value
  const getPixel = (x, y) => {
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return 0;
    return data[(y * canvas.width + x) * 4 + 3] > 128 ? 1 : 0;
  };

  // Modified Moore Neighborhood tracing algorithm
  const traceContour = (startX, startY) => {
    const path = [];
    const visited = new Set();
    let x = startX;
    let y = startY;

    // Moore neighborhood: clockwise from right
    const directions = [
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
    ];

    let dir = 0; // Start moving right
    let firstPoint = true;
    let backToStart = false;

    do {
      // Add current point to path
      if (!visited.has(`${x},${y}`)) {
        path.push([x, y]);
        visited.add(`${x},${y}`);
      }

      // Look for next boundary pixel
      let found = false;
      let count = 0;

      // Start looking from the last successful direction - 2
      // This ensures we always take the rightmost path relative to our current direction
      let startDir = (dir + 6) % 8;

      while (count < 8) {
        const checkDir = (startDir + count) % 8;
        const [dx, dy] = directions[checkDir];
        const newX = x + dx;
        const newY = y + dy;

        if (getPixel(newX, newY)) {
          x = newX;
          y = newY;
          dir = checkDir;
          found = true;
          break;
        }
        count++;
      }

      if (!found) break;

      // Check if we're back to start
      if (!firstPoint && x === startX && y === startY) {
        backToStart = true;
      }

      firstPoint = false;
    } while (!backToStart);

    // Smooth the path by removing redundant points
    return smoothPath(path);
  };

  // Function to smooth the path by removing redundant points
  const smoothPath = (path) => {
    if (path.length < 3) return path;

    const smoothed = [path[0]];
    let i = 1;

    while (i < path.length - 1) {
      const prev = path[i - 1];
      const curr = path[i];
      const next = path[i + 1];

      // Check if current point is needed to maintain shape
      const dx1 = curr[0] - prev[0];
      const dy1 = curr[1] - prev[1];
      const dx2 = next[0] - curr[0];
      const dy2 = next[1] - curr[1];

      // If direction changes significantly, keep the point
      if (Math.abs(dx1 * dy2 - dx2 * dy1) > 0.1) {
        smoothed.push(curr);
      }

      i++;
    }

    smoothed.push(path[path.length - 1]);
    return smoothed;
  };

  // Find and trace all shapes
  const newPaths = [];
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      if (data[i + 3] > 128) {
        const path = traceContour(x, y);
        if (path.length > 10) {
          // Filter out noise
          newPaths.push(path);
        }
        // Mark all points in the path as visited
        path.forEach(([px, py]) => {
          const idx = (py * canvas.width + px) * 4;
          data[idx + 3] = 0;
        });
      }
    }
  }
  return newPaths;
};
