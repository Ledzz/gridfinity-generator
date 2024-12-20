//https://github.com/johnwebbcole/jscad-utils/blob/243595a5ad6461b6ba86fbc6b7aa6d9922d9a8ed/src/util.js
export function fillet(object, radius, orientation, options) {
  options = options || {};
  return reShape(
    object,
    radius,
    orientation,
    options,
    function (first, last, slice) {
      var v1 = new CSG.Vector3D(first);
      var v2 = new CSG.Vector3D(last);

      var res = options.resolution || CSG.defaultResolution3D;

      var slices = array.range(0, res).map(function (i) {
        var p = i > 0 ? i / (res - 1) : 0;
        var v = v1.lerp(v2, p);

        var size = -radius * 2 - Math.cos(Math.asin(p)) * (-radius * 2);

        return {
          poly: enlarge(slice, [size, size]),
          offset: v,
        };
      });

      return slices;
    },
  );
}

export function reShape(object, radius, orientation, options, slicer) {
  options = options || {};
  var b = object.getBounds();
  var absoluteRadius = Math.abs(radius);
  var si = sliceParams(orientation, radius, b);

  debug("reShape", absoluteRadius, si);

  if (si.axis !== "z")
    throw new Error(
      'reShape error: CAG._toPlanePolytons only uses the "z" axis.  You must use the "z" axis for now.',
    );

  var cutplane = CSG.OrthoNormalBasis.GetCartesian(
    si.orthoNormalCartesian[0],
    si.orthoNormalCartesian[1],
  ).translate(si.cutDelta);

  var slice = object.sectionCut(cutplane);

  var first = axisApply(si.axis, function () {
    return si.positive ? 0 : absoluteRadius;
  });

  var last = axisApply(si.axis, function () {
    return si.positive ? absoluteRadius : 0;
  });

  var plane = si.positive ? cutplane.plane : cutplane.plane.flipped();
  debug("reShape first/last", first, last);
  var slices = slicer(first, last, slice, radius);

  var delta = slices2poly(
    slices,
    Object.assign(options, {
      si: si,
    }),
    si.axis,
  ).color(options.color);

  var remainder = object.cutByPlane(plane);
  return union([
    options.unionOriginal ? object : remainder,
    delta.translate(si.moveDelta),
  ]);
}
