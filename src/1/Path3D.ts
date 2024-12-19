import {CubicBezierCurve3, CurvePath, LineCurve, QuadraticBezierCurve3, Vector3} from "three";
import {LineCurve3} from "three/src/extras/curves/LineCurve3";

export class Path3D extends CurvePath<Vector3> {
    currentPoint = new Vector3();
    type = 'Path3D';

    constructor( points?: Vector3[] ) {

        super();

        if ( points ) {

            this.setFromPoints( points );

        }

    }

    setFromPoints( points: Vector3[] ) {

        this.moveTo( points[ 0 ].x, points[ 0 ].y, points[ 0 ].z );

        for ( let i = 1, l = points.length; i < l; i ++ ) {

            this.lineTo( points[ i ].x, points[ i ].y , points[i].z);

        }

        return this;

    }

    moveTo( x:number, y:number ,z:number) {

        this.currentPoint.set( x, y ,z); // TODO consider referencing vectors instead of copying?

        return this;

    }

    lineTo( x:number, y:number,z:number, steps = 1 ) {

        const curve = new LineCurve3( this.currentPoint.clone(), new Vector3( x, y ,z) );
        curve.steps = steps;
        this.curves.push( curve );

        this.currentPoint.set( x, y,z );

        return this;

    }

   quadraticBezierCurveTo(ex: number, ey: number, ez: number, x: number, y: number, z: number, steps = 8) {
            const curve = new QuadraticBezierCurve3( this.currentPoint.clone(), new Vector3( x,y,z ), new Vector3( ex,ey, ez ) );
       curve.steps = steps;

            this.curves.push( curve );

            this.currentPoint.set( ex, ey, ez );

            return this;
   }getSpacedPoints(divisions?: number) {
        const points: Vector3[] = [];
        for (const curve of this.curves) {
            const curveSteps = (curve as Curve3WithSteps).steps || divisions || 12;
            const curvePoints = curve.getPoints(curveSteps);

            // Don't add the first point except for the first curve
            // to avoid duplicates at the joints
            points.push(...(points.length ? curvePoints.slice(1) : curvePoints));
        }
        return points;
    }
    // getSpacedPoints( _divisions = 40 ) {
    //
    //     const divisions=20;
    //     const points = [];
    //
    //     for ( let i = 0; i <= divisions; i ++ ) {
    //
    //         points.push( this.getPoint( i / divisions ) );
    //
    //     }
    //
    //     if ( this.autoClose ) {
    //
    //         points.push( points[ 0 ] );
    //
    //     }
    //
    //     return points;
    //
    // }

}