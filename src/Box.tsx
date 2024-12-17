import {Addition, Base, Geometry, Subtraction} from "@react-three/csg";
import {useLayoutEffect, useMemo, useRef} from "react";
import {Curve, CurvePath, ExtrudeGeometry, LineCurve3, QuadraticBezierCurve3, Shape, Vector2, Vector3} from "three";
import {Shape3D} from "./Shape3D.ts";
import {extend} from "@react-three/fiber";
import {MyExtrudeGeometry} from "./ExtrudeGeometry.ts";

extend({MyExtrudeGeometry})

export const Asdf = () => {
    return <group position={[0, 0, 0]}>
        <mesh>
            <Geometry>
                <Base>
                    <BaseGeometry/>
                </Base>
                {/*<Addition position={[0, (0.8 + 1.8 + 2.15)/2, 0]}>*/}
                {/*    <boxGeometry args={[42,0.8 + 1.8 + 2.15,42]}/>*/}
                {/*</Addition>*/}
            </Geometry>
            <meshNormalMaterial wireframe/>
            <axesHelper args={[10]}/>
            {/*<arrowHelper args={[new Vector3(0, 0, -42).normalize(), new Vector3(0, 0, 0), 42, 0xff0000]}/>*/}
        </mesh>
    </group>
}

function BaseGeometry() {
    const geometry = useRef<ExtrudeGeometry>(null!)

    const shape = useMemo(() => {
        const s = new Shape3D();
        s.moveTo(0, 0, 0);
        s.lineTo(0.8, 0.8, 0);
        s.lineTo(0.8, 1.8, 0);
        s.lineTo(0.8 + 2.15, 0.8 + 1.8 + 2.15, 0);
        s.lineTo(0, 0.8 + 1.8 + 2.15, 0);
        s.lineTo(0.1, 0, 0);

        s.normalize();

        return s;
    }, []);

    const extrudePath = useMemo(() => {
        const s = new Shape3D();
        const r = 0.8;
        const fs = 42;
        const size = fs/2;
        const inner = size  - r;
        s.moveTo(size, 0, inner);
        s.lineTo(size, 0, -inner);
        s.quadraticBezierCurveTo(inner, 0, -size, size, 0, -size);
        s.lineTo(-inner, 0, -size);
        s.quadraticBezierCurveTo(-size, 0, -inner, -size, 0, -size);
        s.lineTo(-size, 0, inner);
        s.quadraticBezierCurveTo(-inner, 0, size, -size, 0, size);
        s.lineTo(inner, 0, size);
        s.quadraticBezierCurveTo(size,0,inner,size,0,size);
        return s;
    }, []);

    return <myExtrudeGeometry ref={geometry} args={[shape, {extrudePath, steps: 512}]}/>
}


export function createSquarePathWithFillets(size: number = 42, radius: number = 3.25) {
    const path = new CurvePath<Vector3>();

    // Calculate positions for straight segments
    // Moving inward by radius at each corner
    const innerSize = size - radius;

    // Start at top-right and go counter-clockwise
    const points = [
        new Vector3(0, 0, 0),            // Start point
        new Vector3(0, 0, -innerSize),   // Top edge
        new Vector3(0, 0, -size),        // First corner control
        new Vector3(-radius, 0, -size),  // First corner end
        new Vector3(-innerSize, 0, -size), // Right edge
        new Vector3(-size, 0, -size),    // Second corner control
        new Vector3(-size, 0, -innerSize), // Second corner end
        new Vector3(-size, 0, -radius),  // Bottom edge
        new Vector3(-size, 0, 0),        // Third corner control
        new Vector3(-innerSize, 0, 0),   // Third corner end
        new Vector3(-radius, 0, 0),      // Left edge
        new Vector3(0, 0, 0),            // Back to start
    ];

    // Create the path segments
    for (let i = 0; i < points.length - 1; i += 3) {
        if (i + 2 < points.length) {
            // Create quadratic curve for corners
            path.add(new QuadraticBezierCurve3(
                points[i],
                points[i + 1],
                points[i + 2]
            ));
        }

        // Add straight segment if there is one
        if (i + 3 < points.length) {
            path.add(new LineCurve3(
                points[i + 2],
                points[i + 3]
            ));
        }
    }

    return path;
}