import { Mesh } from "manifold-3d/manifold-encapsulated-types";
import stringify from "onml/stringify";
import { strToU8, zipSync } from "fflate";

const contenttype = `<?xml version="1.0" encoding="UTF-8" ?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml">
  </Default>
  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml">
  </Default>
</Types>`;

const rels = `<?xml version="1.0" encoding="UTF-8" ?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel">
  </Relationship>
</Relationships>`;

export function to3MF(meshes: Mesh[]) {
  const body = [
    "model",
    {
      unit: "millimeter",
      "xml:lang": "und",
    },
    ["metadata", { name: "Application" }, "JSCAD"],
  ];
  body.push(["metadata", { name: "CreationDate" }, new Date().toISOString()]);
  body.push(translateResources([meshe));
  body.push(translateBuild([meshes]));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
${stringify(body, 2)}`;

  const data = {
    "3D": {
      "3dmodel.model": strToU8(xml),
    },
    _rels: {
      ".rels": strToU8(rels),
    },
    "[Content_Types].xml": strToU8(contenttype),
  };
  const opts = {
    comment: "created by JSCAD",
  };
  const zipData = zipSync(data, opts);
  return [zipData.buffer];
  // return [xml];
}

function translateResources(meshes: Mesh[]) {
  let resources = ["resources", {}, translateMaterials(meshes)];
  resources = resources.concat(translateObjects(meshes));
  return resources;
}

function translateMaterials(meshes: Mesh[]) {
  let basematerials = ["basematerials", { id: "0" }];

  const materials = [];
  meshes.forEach((object, i) => {
    // let srgb = colors.rgbToHex(options.defaultcolor).toUpperCase();
    // if (object.color) {
    //   srgb = colors.rgbToHex(object.color).toUpperCase();
    // }
    const srgb = "FF0000"; // TODO
    materials.push(["base", { name: `mat${i}`, displaycolor: srgb }]);
  });

  basematerials = basematerials.concat(materials);
  return basematerials;
}

function translateObjects(meshes: Mesh[] ) {
  const contents = [];
  meshes.forEach((object, i) => {
    const options = {id : i};
    contents.push(convertToObject(object, options));
  });
  return contents;
}

function translateBuild(meshes: Mesh[], options) {
  let build = ["build", {}];

  const items = [];
  meshes.forEach((object, i) => {
    items.push(["item", { objectid: `${i + 1}` }]);
  });

  build = build.concat(items);
  return build;
}

function convertToObject(mesh: Mesh, options) {
  const name = mesh.name ? mesh.name : `Part ${options.id}`;
  const contents = [
    "object",
    {
      id: `${options.id + 1}`,
      type: "model",
      pid: "0",
      pindex: `${options.id}`,
      name: name,
    },
    convertToMesh(mesh, options),
  ];
  return contents;
}

function convertToMesh(mesh: Mesh, options) {
  const vertices = ["vertices", {}];

  for (let i = 0; i < mesh.vertProperties.length; i += 3) {
    vertices.push([
      "vertex",
      {
        x: mesh.vertProperties[i],
        y: mesh.vertProperties[i + 1],
        z: mesh.vertProperties[i + 2],
      },
    ]);
  }

  let polygons = ["triangles", {}];

  for (let i = 0; i < mesh.triVerts.length; i += 3) {
    polygons.push([
      "triangle",
      {
        v1: mesh.triVerts[i],
        v2: mesh.triVerts[i + 1],
        v3: mesh.triVerts[i + 2],
      },
    ]);
  }

  const contents = ["mesh", {}, vertices, polygons];
  return contents;
}
