import * as vec3 from "@jscad/modeling/src/maths/vec3";
import { Vec3 } from "@jscad/modeling/src/maths/vec3";
import Geom3 from "@jscad/modeling/src/geometries/geom3/type";

class GPUSubtract {
  device: GPUDevice = null;
  queue: GPUQueue = null;

  async initialize() {
    if (!navigator.gpu) throw new Error("WebGPU not supported");
    const adapter = await navigator.gpu.requestAdapter();
    this.device = await adapter.requestDevice();
    this.queue = this.device.queue;
  }

  createBuffer(data, usage) {
    const buffer = this.device.createBuffer({
      size: data.byteLength,
      usage: usage | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    new Float32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();
    return buffer;
  }

  async checkOverlap(geom1: Geom3, geom2: Geom3) {
    if (geom1.polygons.length === 0 || geom2.polygons.length === 0) {
      return false;
    }
    // Extract bounding boxes
    const boxes1 = this.computeBoundingBoxes(geom1.polygons);
    const boxes2 = this.computeBoundingBoxes(geom2.polygons);

    const boxBuffer1 = this.createBuffer(boxes1, GPUBufferUsage.STORAGE);
    const boxBuffer2 = this.createBuffer(boxes2, GPUBufferUsage.STORAGE);
    const resultBuffer = this.device.createBuffer({
      size: geom1.polygons.length * geom2.polygons.length * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const bindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "read-only-storage" },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "read-only-storage" },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" },
        },
      ],
    });

    const computePipeline = this.device.createComputePipeline({
      layout: this.device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout],
      }),
      compute: {
        module: this.device.createShaderModule({
          code: `
            struct Box { min: vec3<f32>, max: vec3<f32> }
            
            @group(0) @binding(0) var<storage> boxes1: array<Box>;
            @group(0) @binding(1) var<storage> boxes2: array<Box>;
            @group(0) @binding(2) var<storage, read_write> results: array<u32>;

            @compute @workgroup_size(256)
            fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
              let idx = global_id.x;
              let box1_idx = idx / arrayLength(&boxes2);
              let box2_idx = idx % arrayLength(&boxes2);

              let box1 = boxes1[box1_idx];
              let box2 = boxes2[box2_idx];

              results[idx] = u32(
                box2.min.x <= box1.max.x && box2.max.x >= box1.min.x &&
                box2.min.y <= box1.max.y && box2.max.y >= box1.min.y &&
                box2.min.z <= box1.max.z && box2.max.z >= box1.min.z
              );
            }
          `,
        }),
        entryPoint: "main",
      },
    });

    // Execute compute shader
    const commandEncoder = this.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(computePipeline);
    passEncoder.setBindGroup(
      0,
      this.device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
          { binding: 0, resource: { buffer: boxBuffer1 } },
          { binding: 1, resource: { buffer: boxBuffer2 } },
          { binding: 2, resource: { buffer: resultBuffer } },
        ],
      }),
    );
    passEncoder.dispatchWorkgroups(
      Math.ceil((geom1.polygons.length * geom2.polygons.length) / 256),
    );
    passEncoder.end();

    // Get results
    const readBuffer = this.device.createBuffer({
      size: resultBuffer.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    commandEncoder.copyBufferToBuffer(
      resultBuffer,
      0,
      readBuffer,
      0,
      resultBuffer.size,
    );
    this.queue.submit([commandEncoder.finish()]);

    await readBuffer.mapAsync(GPUMapMode.READ);
    const mappedRange = readBuffer.getMappedRange();
    const hasOverlap = new Uint32Array(mappedRange).some((x) => x === 1);
    readBuffer.unmap();

    return hasOverlap;
  }

  async splitPolygons(polygons: Array<Poly3>, plane: Plane) {
    if (polygons.length === 0) {
      return { front: [], back: [] };
    }
    const vertexData = new Float32Array(
      polygons.reduce((acc, poly) => {
        poly.vertices.forEach((v) => acc.push(...v));
        return acc;
      }, []),
    );

    const vertexBuffer = this.createBuffer(vertexData, GPUBufferUsage.STORAGE);
    const planeBuffer = this.createBuffer(
      new Float32Array(plane),
      GPUBufferUsage.UNIFORM,
    );

    const resultBuffer = this.device.createBuffer({
      size: vertexData.byteLength * 2, // Space for both front and back polygons
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const bindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "read-only-storage" },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "uniform" },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" },
        },
      ],
    });

    const computePipeline = this.device.createComputePipeline({
      layout: this.device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout],
      }),
      compute: {
        module: this.device.createShaderModule({
          code: `
            @group(0) @binding(0) var<storage> vertices: array<vec3<f32>>;
            @group(0) @binding(1) var<uniform> plane: vec4<f32>;
            @group(0) @binding(2) var<storage, read_write> results: array<vec3<f32>>;

            fn classifyPoint(point: vec3<f32>) -> f32 {
              return dot(plane.xyz, point) - plane.w;
            }

            fn interpolate(p1: vec3<f32>, p2: vec3<f32>, d1: f32, d2: f32) -> vec3<f32> {
              let t = d1 / (d1 - d2);
              return p1 + t * (p2 - p1);
            }

            @compute @workgroup_size(256)
            fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
              let poly_idx = global_id.x;
              let v1 = vertices[poly_idx * 3];
              let v2 = vertices[poly_idx * 3 + 1];
              let v3 = vertices[poly_idx * 3 + 2];

              let d1 = classifyPoint(v1);
              let d2 = classifyPoint(v2);
              let d3 = classifyPoint(v3);

              // Split polygon and output results
              // Store vertices for front polygon
              if (d1 >= 0.0) { results[poly_idx * 6] = v1; }
              if (d2 >= 0.0) { results[poly_idx * 6 + 1] = v2; }
              if (d3 >= 0.0) { results[poly_idx * 6 + 2] = v3; }

              // Store vertices for back polygon
              if (d1 < 0.0) { results[poly_idx * 6 + 3] = v1; }
              if (d2 < 0.0) { results[poly_idx * 6 + 4] = v2; }
              if (d3 < 0.0) { results[poly_idx * 6 + 5] = v3; }

              // Handle spanning case
              if (d1 * d2 < 0.0) {
                let i = interpolate(v1, v2, d1, d2);
                let base_idx = poly_idx * 6u;
                let offset = select(5u, 2u, d1 >= 0.0);
                results[base_idx + offset] = i;
              }
              if (d2 * d3 < 0.0) {
                let i = interpolate(v2, v3, d2, d3);
                let base_idx = poly_idx * 6u;
                let offset = select(5u, 2u, d2 >= 0.0);
                results[base_idx + offset] = i;
              }
              if (d3 * d1 < 0.0) {
                let i = interpolate(v3, v1, d3, d1);
                let base_idx = poly_idx * 6u;
                let offset = select(5u, 2u, d3 >= 0.0);
                results[base_idx + offset] = i;
              }
            }
          `,
        }),
        entryPoint: "main",
      },
    });

    // Execute and get results
    const commandEncoder = this.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(computePipeline);
    passEncoder.setBindGroup(
      0,
      this.device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
          { binding: 0, resource: { buffer: vertexBuffer } },
          { binding: 1, resource: { buffer: planeBuffer } },
          { binding: 2, resource: { buffer: resultBuffer } },
        ],
      }),
    );
    passEncoder.dispatchWorkgroups(Math.ceil(polygons.length / 256));
    passEncoder.end();

    // Read results
    const readBuffer = this.device.createBuffer({
      size: resultBuffer.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    commandEncoder.copyBufferToBuffer(
      resultBuffer,
      0,
      readBuffer,
      0,
      resultBuffer.size,
    );
    this.queue.submit([commandEncoder.finish()]);

    await readBuffer.mapAsync(GPUMapMode.READ);
    const results = new Float32Array(readBuffer.getMappedRange());
    readBuffer.unmap();

    return this.reconstructPolygons(results, polygons.length);
  }

  private computeBoundingBoxes(polygons: Array<Poly3>): Float32Array {
    const result = new Float32Array(polygons.length * 6);
    polygons.forEach((poly, i) => {
      let minX = Infinity,
        minY = Infinity,
        minZ = Infinity;
      let maxX = -Infinity,
        maxY = -Infinity,
        maxZ = -Infinity;

      poly.vertices.forEach((v) => {
        minX = Math.min(minX, v[0]);
        maxX = Math.max(maxX, v[0]);
        minY = Math.min(minY, v[1]);
        maxY = Math.max(maxY, v[1]);
        minZ = Math.min(minZ, v[2]);
        maxZ = Math.max(maxZ, v[2]);
      });

      const idx = i * 6;
      result[idx] = minX;
      result[idx + 1] = minY;
      result[idx + 2] = minZ;
      result[idx + 3] = maxX;
      result[idx + 4] = maxY;
      result[idx + 5] = maxZ;
    });
    return result;
  }

  private reconstructPolygons(
    vertexData: Float32Array,
    numPolygons: number,
  ): { front: Array<Poly3>; back: Array<Poly3> } {
    const front: Array<Poly3> = [];
    const back: Array<Poly3> = [];

    for (let i = 0; i < numPolygons; i++) {
      const frontVerts = [];
      const backVerts = [];

      // Each polygon has 6 potential vertices (3 front, 3 back)
      for (let j = 0; j < 3; j++) {
        const frontIdx = i * 18 + j * 3;
        const backIdx = i * 18 + (j + 3) * 3;

        if (!isNaN(vertexData[frontIdx])) {
          frontVerts.push([
            vertexData[frontIdx],
            vertexData[frontIdx + 1],
            vertexData[frontIdx + 2],
          ] as Vec3);
        }

        if (!isNaN(vertexData[backIdx])) {
          backVerts.push([
            vertexData[backIdx],
            vertexData[backIdx + 1],
            vertexData[backIdx + 2],
          ] as Vec3);
        }
      }

      if (frontVerts.length >= 3) front.push({ vertices: frontVerts });
      if (backVerts.length >= 3) back.push({ vertices: backVerts });
    }

    return { front, back };
  }

  async subtract(geom1: Geom3, geom2: Geom3): Promise<Geom3> {
    if (!(await this.checkOverlap(geom1, geom2))) {
      return geom1;
    }

    // For each polygon in geom2, split polygons of geom1
    let currentGeom = { ...geom1 };
    for (const poly2 of geom2.polygons) {
      const plane = poly2.plane || this.calculatePlane(poly2);
      const { front } = await this.splitPolygons(currentGeom.polygons, plane);
      currentGeom = { ...currentGeom, polygons: front };
    }

    return currentGeom;
  }

  private calculatePlane(poly: Poly3): Plane {
    const v1 = poly.vertices[0];
    const v2 = poly.vertices[1];
    const v3 = poly.vertices[2];

    const normal = vec3.cross(
      vec3.create(),
      vec3.subtract(vec3.create(), v2, v1),
      vec3.subtract(vec3.create(), v3, v1),
    );
    vec3.normalize(normal, normal);

    return [normal[0], normal[1], normal[2], vec3.dot(normal, v1)];
  }
}

export const subtract = async (...geometries: Array<Geom3>): Promise<Geom3> => {
  const gpuSubtract = new GPUSubtract();
  await gpuSubtract.initialize();

  let result = geometries[0];
  for (let i = 1; i < geometries.length; i++) {
    result = await gpuSubtract.subtract(result, geometries[i]);
  }

  return result;
};
