import {Geom2} from "@jscad/modeling/src/geometries/geom2";
import {BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineSegments, Matrix4} from "three";

function create2DLineGeometry(jsonData: Geom2) {
    // Create a new BufferGeometry
    const geometry = new BufferGeometry();

    // Extract points from the sides array
    const positions = [];

    // Process each line segment
    jsonData.sides.forEach(side => {
        // Each side is an array of two points
        const [[x1, y1], [x2, y2]] = side;

        // Add the points to create the line segment
        // Using Z=0 since this is 2D
        positions.push(x1, y1, 0);
        positions.push(x2, y2, 0);
    });

    // Create position attribute
    geometry.setAttribute(
        'position',
        new Float32BufferAttribute(positions, 3)
    );

    // Apply transforms if provided
    if (jsonData.transforms) {
        const matrix = new Matrix4();
        matrix.fromArray(jsonData.transforms);
        geometry.applyMatrix4(matrix);
    }

    return geometry;
}

function create2DLineMaterial() {
    return new LineBasicMaterial({
        color: 0xff0000,  // Default to white
        linewidth: 1,     // Note: linewidth > 1 not supported on most WebGL platforms
        transparent: false,
        opacity: 1.0
    });
}

export function create2DLineObject(jsonData: Geom2) {
    const geometry = create2DLineGeometry(jsonData);
    const material = create2DLineMaterial();

    // Create a Line object instead of Mesh since we're rendering lines
    const lineObject = new LineSegments(geometry, material);

    return lineObject;
}