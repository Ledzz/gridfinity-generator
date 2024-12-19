import {Path3D} from "./Path3D.ts";
import {MathUtils} from 'three';
import {Vector3} from "three";
import {LineCurve3} from "three/src/extras/curves/LineCurve3";

const {generateUUID} = MathUtils;

export class Shape3D extends Path3D {
    uuid = generateUUID();
    type = 'Shape3D';
    holes: Path3D[] = [];

    constructor(public points?: Vector3[]) {
        super(points);
    }

    getPointsHoles(divisions: number) {

        const holesPts = [];

        for (let i = 0, l = this.holes.length; i < l; i++) {

            holesPts[i] = this.holes[i].getPoints(divisions);

        }

        return holesPts;

    }

    normalize() {
        function swap(a: Vector3) {
            [a.x, a.y, a.z] = [-a.y, -a.x, a.z];
        }
        this.curves?.forEach(c => {
            if (c instanceof LineCurve3) {
                swap(c.v1);
                swap(c.v2);
            }
        })
    }

    extractPoints(divisions: number) {

        return {

            shape: this.getPoints(divisions),
            holes: this.getPointsHoles(divisions)

        };

    }
}