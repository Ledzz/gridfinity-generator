import { Mesh } from "manifold-3d/manifold-encapsulated-types";
import { stringify } from "onml";
import { strToU8, zipSync } from "fflate";
import { flatten, RecursiveArray } from "../manifold/utils/nestedArray.ts";
import { Manifold } from "manifold-3d";

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

export function to3MF(manifolds: RecursiveArray<Manifold>) {
  const meshes = flatten(manifolds).map((m) => m.getMesh());
  const body: any[] = [
    "model",
    {
      unit: "millimeter",
      "xml:lang": "und",
    },
    ["metadata", { name: "Application" }, "JSCAD"],
  ];
  body.push(["metadata", { name: "CreationDate" }, new Date().toISOString()]);
  body.push(translateResources(meshes));
  body.push(translateBuild(meshes));

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

  const materials: any[] = [];
  meshes.forEach((_, i) => {
    const srgb = "FF0000"; // TODO
    materials.push(["base", { name: `mat${i}`, displaycolor: srgb }]);
  });

  basematerials = basematerials.concat(materials);
  return basematerials;
}

function translateObjects(meshes: Mesh[]): any[] {
  const contents: any[] = [];
  meshes.forEach((object, i) => {
    const options = { id: i };
    contents.push(convertToObject(object, options));
  });
  return contents;
}

function translateBuild(meshes: Mesh[]) {
  let build = ["build", {}];

  const items: any[] = [];
  meshes.forEach((_, i) => {
    items.push(["item", { objectid: `${i + 1}` }]);
  });

  build = build.concat(items);
  return build;
}

function convertToObject(mesh: Mesh, options: { id: number }) {
  const name = `Part ${options.id}`;
  return [
    "object",
    {
      id: `${options.id + 1}`,
      type: "model",
      pid: "0",
      pindex: `${options.id}`,
      name: name,
    },
    convertToMesh(mesh),
  ];
}

function convertToMesh(mesh: Mesh) {
  const vertices: any[] = ["vertices", {}];

  for (let i = 0; i < mesh.vertProperties.length; i += mesh.numProp) {
    vertices.push([
      "vertex",
      {
        x: mesh.vertProperties[i],
        y: mesh.vertProperties[i + 1],
        z: mesh.vertProperties[i + 2],
      },
    ]);
  }

  const polygons: any[] = ["triangles", {}];

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

  return ["mesh", {}, vertices, polygons];
}
