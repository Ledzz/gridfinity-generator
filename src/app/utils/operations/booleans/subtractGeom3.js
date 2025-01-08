const flatten = require('../../utils/flatten')

const retessellate = require('../modifiers/retessellate')

const subtractSub = require('./subtractGeom3Sub')

/*
 * Return a new 3D geometry representing space in this geometry but not in the given geometries.
 * Neither this geometry nor the given geometries are modified.
 * @param {...geom3} geometries - list of geometries
 * @returns {geom3} new 3D geometry
 */
const subtract = (...geometries) => {
  geometries = flatten(geometries)

  let newgeometry = geometries.shift()
  geometries.forEach((geometry, index) => {
    console.time(`subtractSub ${index}`)
    newgeometry = subtractSub(newgeometry, geometry)
    console.timeEnd(`subtractSub ${index}`)
  })
  console.time('retessellate')

  newgeometry = retessellate(newgeometry)
  console.timeEnd('retessellate')

  return newgeometry
}

module.exports = subtract
