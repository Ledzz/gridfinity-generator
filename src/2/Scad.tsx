import {useMemo} from "react";
import {booleans, colors, primitives
,extrusions,
    transforms} from '@jscad/modeling';
import Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import {Mesh} from "three";
import {Geom2} from "@jscad/modeling/src/geometries/geom2";
import {Path2} from "@jscad/modeling/src/geometries/path2";
import {create2DLineObject} from "./geom2.ts";
import {createClosedPolygonObject} from "./path2.ts";
import {createComplexGeometry, createComplexMaterial} from "./geom3.ts";

export const Scad = () => {
    const mesh = useMemo(() => {
        const { colorize } = colors

        return toMesh(demo()[0])
    }, []);

    return <primitive object={mesh}></primitive>
}

function demo() {

    const { cylinder } = primitives
    const { subtract, union } = booleans
    const { colorize } = colors
    const { extrudeFromSlices, slice } = extrusions
    const { translate } = transforms

    const options = {
        hexWidth: 10,
        hexHeight: 8,
        threadLength: 32,
        threadSize: 4,
        innerRadius: 4,
        outerRadius: 5.6,
        slicesPerRevolution: 12,
        segments: 32
    }

    const main = () => {
        return [
            colorize([0.9, 0.6, 0.2], bolt(options)),
            colorize([0.4, 0.4, 0.4], translate([30, 0, 0], nut(options)))
        ]
    }

// generate bolt by attaching threads to a hex head
    const bolt = (options) => {
        return union(
            translate([0, 0, options.threadLength], hex(options)),
            threads(options)
        )
    }

// generate nut by subtracting threads from a hex block
    const nut = (options) => {
        return subtract(
            hex(options),
            threads({ ...options, threadLength: options.hexHeight })
        )
    }

// generate hexagonal block
    const hex = (options) => {
        const radius = options.hexWidth * 1.1547005 // hexagon outer radius
        const height = options.hexHeight
        return cylinder({ center: [0, 0, height / 2], height, radius, segments: 6 })
    }

// generate a threaded shaft using extrudeFromSlices
    const threads = (options) => {
        const { innerRadius, outerRadius, segments, threadLength } = options
        const revolutions = threadLength / options.threadSize
        const numberOfSlices = options.slicesPerRevolution * revolutions
        return extrudeFromSlices({
            numberOfSlices,
            callback: (progress, index, base) => {
                // generate each slice manually
                const points = []
                for (let i = 0; i < segments; i++) {
                    const pointAngle = Math.PI * 2 * i / segments
                    const threadAngle = (2 * Math.PI * revolutions * progress) % (Math.PI * 2)

                    // define the shape of the threads
                    const phase = angleDiff(threadAngle, pointAngle) / Math.PI
                    const radius = lerp(innerRadius, outerRadius, 1.4 * phase - 0.2)

                    const x = radius * Math.cos(pointAngle)
                    const y = radius * Math.sin(pointAngle)
                    points.push([x, y, threadLength * progress])
                }
                return slice.fromPoints(points)
            }
        }, {})
    }

// linear interpolation with bounding
    const lerp = (a, b, t) => Math.max(a, Math.min(b, a + (b - a) * t))

    const angleDiff = (angle1, angle2) => {
        const diff = Math.abs((angle1 - angle2) % (Math.PI * 2))
        return diff > Math.PI ? Math.PI * 2 - diff : diff
    }
return main()
}

function toMesh(geom: Geom3|Geom2) {
    if (isGeom2(geom)) {return create2DLineObject(geom);}
    if (isPath2(geom)) {return createClosedPolygonObject(geom)}
    if (isGeom3(geom)) {return   new Mesh(
        createComplexGeometry(geom),
        createComplexMaterial(geom)
    );}

    console.error('unknown geometry type');

    return ;
}

function isGeom3(jsonData: Geom3|Geom2): jsonData is Geom3 {
    return (jsonData as Geom3).polygons !== undefined;
}

function isGeom2(geom: Geom3|Geom2): geom is Geom2 {
    return (geom as Geom2).sides !== undefined;
}

function isPath2(jsonData: Path2|Geom3|Geom2): jsonData is Path2 {
    return (jsonData as Path2).points !== undefined;
}

