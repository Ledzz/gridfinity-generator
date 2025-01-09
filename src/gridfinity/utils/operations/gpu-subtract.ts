import { Vec3 } from "@jscad/modeling/src/maths/vec3";
import Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import { Poly3 } from "@jscad/modeling/src/geometries/poly3";

class GPUSubtract {
  device: GPUDevice = null;
  queue: GPUQueue = null;

  async initialize() {
    if (!navigator.gpu) throw new Error("WebGPU not supported");
    const adapter = await navigator.gpu.requestAdapter();
    this.device = await adapter.requestDevice();
    this.queue = this.device.queue;
  }

  async splitPolygons(polygons: Array<Poly3>, plane: Plane) {
    console.log(
      "Input vertices:",
      polygons.map((p) => p.vertices),
    );
    console.log("Splitting plane:", plane);

    if (polygons.length === 0) return { front: [], back: [] };

    const testResults = polygons.map((poly) => ({
      vertices: poly.vertices,
      distances: poly.vertices.map(
        (v) => plane[0] * v[0] + plane[1] * v[1] + plane[2] * v[2] - plane[3],
      ),
    }));
    console.log("Vertex classification results:", testResults);

    // Prepare data for GPU
    const vertexData = new Float32Array(
      polygons.reduce((acc, poly) => {
        poly.vertices.forEach((v) => acc.push(...v));
        return acc;
      }, []),
    );
    console.log("Vertex buffer data:", vertexData);

    const vertexBuffer = this.createBuffer(vertexData, GPUBufferUsage.STORAGE);
    const planeBuffer = this.createBuffer(
      new Float32Array(plane),
      GPUBufferUsage.UNIFORM,
    );

    const debugBuffer = this.device.createBuffer({
      size: 16, // 4 u32 values
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const resultBuffer = this.device.createBuffer({
      size: vertexData.byteLength * 2,
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
        {
          binding: 3,
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
            struct DebugData {
              front_count: atomic<u32>,
              back_count: atomic<u32>,
              spanning_count: atomic<u32>,
              total_processed: atomic<u32>,
            }

            @group(0) @binding(0) var<storage> vertices: array<vec3<f32>>;
            @group(0) @binding(1) var<uniform> plane: vec4<f32>;
            @group(0) @binding(2) var<storage, read_write> results: array<vec3<f32>>;
            @group(0) @binding(3) var<storage, read_write> debug: DebugData;

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
              if (poly_idx >= arrayLength(&vertices) / 3u) { return; }

              atomicAdd(&debug.total_processed, 1u);

              let v1 = vertices[poly_idx * 3u];
              let v2 = vertices[poly_idx * 3u + 1u];
              let v3 = vertices[poly_idx * 3u + 2u];

              let d1 = classifyPoint(v1);
              let d2 = classifyPoint(v2);
              let d3 = classifyPoint(v3);

              let all_front = d1 >= 0.0 && d2 >= 0.0 && d3 >= 0.0;
              let all_back = d1 < 0.0 && d2 < 0.0 && d3 < 0.0;

              if (all_front) {
                atomicAdd(&debug.front_count, 1u);
                results[poly_idx * 6u] = v1;
                results[poly_idx * 6u + 1u] = v2;
                results[poly_idx * 6u + 2u] = v3;
              } else if (all_back) {
                atomicAdd(&debug.back_count, 1u);
                results[poly_idx * 6u + 3u] = v1;
                results[poly_idx * 6u + 4u] = v2;
                results[poly_idx * 6u + 5u] = v3;
              } else {
                atomicAdd(&debug.spanning_count, 1u);
                // Handle spanning case
                if (d1 >= 0.0) { results[poly_idx * 6u] = v1; }
                if (d2 >= 0.0) { results[poly_idx * 6u + 1u] = v2; }
                if (d3 >= 0.0) { results[poly_idx * 6u + 2u] = v3; }
                
                if (d1 < 0.0) { results[poly_idx * 6u + 3u] = v1; }
                if (d2 < 0.0) { results[poly_idx * 6u + 4u] = v2; }
                if (d3 < 0.0) { results[poly_idx * 6u + 5u] = v3; }
                
                if (d1 * d2 < 0.0) {
                  let i = interpolate(v1, v2, d1, d2);
                  let base_idx = poly_idx * 6u;
                  let offset = select(3u, 2u, d1 >= 0.0);
                  results[base_idx + offset] = i;
                }
                if (d2 * d3 < 0.0) {
                  let i = interpolate(v2, v3, d2, d3);
                  let base_idx = poly_idx * 6u;
                  let offset = select(4u, 1u, d2 >= 0.0);
                  results[base_idx + offset] = i;
                }
                if (d3 * d1 < 0.0) {
                  let i = interpolate(v3, v1, d3, d1);
                  let base_idx = poly_idx * 6u;
                  let offset = select(5u, 0u, d3 >= 0.0);
                  results[base_idx + offset] = i;
                }
              }
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
          { binding: 0, resource: { buffer: vertexBuffer } },
          { binding: 1, resource: { buffer: planeBuffer } },
          { binding: 2, resource: { buffer: resultBuffer } },
          { binding: 3, resource: { buffer: debugBuffer } },
        ],
      }),
    );

    const workgroupCount = Math.ceil(polygons.length / 256);
    console.log("Dispatching workgroups:", workgroupCount);
    passEncoder.dispatchWorkgroups(workgroupCount);
    passEncoder.end();

    // Read debug data
    const debugReadBuffer = this.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    commandEncoder.copyBufferToBuffer(debugBuffer, 0, debugReadBuffer, 0, 16);

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

    // Get debug results
    await debugReadBuffer.mapAsync(GPUMapMode.READ);
    const debugData = new Uint32Array(debugReadBuffer.getMappedRange());
    console.log("Debug data:", {
      frontCount: debugData[0],
      backCount: debugData[1],
      spanningCount: debugData[2],
      totalProcessed: debugData[3],
    });
    debugReadBuffer.unmap();

    // Get polygon results
    await readBuffer.mapAsync(GPUMapMode.READ);
    const results = new Float32Array(readBuffer.getMappedRange());
    console.log("Raw results:", results);
    readBuffer.unmap();

    return this.reconstructPolygons(results, polygons.length);
  }

  private createBuffer(data: Float32Array, usage: number): GPUBuffer {
    const buffer = this.device.createBuffer({
      size: data.byteLength,
      usage: usage | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    new Float32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();
    return buffer;
  }

  private reconstructPolygons(
    vertexData: Float32Array,
    numPolygons: number,
  ): { front: Array<Poly3>; back: Array<Poly3> } {
    const vertexArray = Array.from(vertexData);
    console.log("Reconstructing polygons from data:", {
      dataLength: vertexArray.length,
      numPolygons,
      sampleData: vertexArray.slice(0, 18),
    });

    const front: Array<Poly3> = [];
    const back: Array<Poly3> = [];

    for (let i = 0; i < numPolygons; i++) {
      const frontVerts: Vec3[] = [];
      const backVerts: Vec3[] = [];

      // Process front vertices
      for (let j = 0; j < 3; j++) {
        const idx = i * 18 + j * 3;
        const vertex: Vec3 = [
          vertexData[idx],
          vertexData[idx + 1],
          vertexData[idx + 2],
        ];
        if (!vertex.some(isNaN)) {
          frontVerts.push(vertex);
        }
      }

      // Process back vertices
      for (let j = 0; j < 3; j++) {
        const idx = i * 18 + (j + 3) * 3;
        const vertex: Vec3 = [
          vertexData[idx],
          vertexData[idx + 1],
          vertexData[idx + 2],
        ];
        if (!vertex.some(isNaN)) {
          backVerts.push(vertex);
        }
      }

      console.log(`Polygon ${i} vertices:`, {
        front: frontVerts,
        back: backVerts,
      });

      if (frontVerts.length >= 3) front.push({ vertices: frontVerts });
      if (backVerts.length >= 3) back.push({ vertices: backVerts });
    }

    console.log("Reconstruction results:", {
      frontPolygons: front.length,
      backPolygons: back.length,
    });

    return { front, back };
  }

  async subtract(geom1: Geom3, geom2: Geom3): Promise<Geom3> {
    console.log("Subtracting geometries:", {
      geom1Polygons: geom1.polygons.length,
      geom2Polygons: geom2.polygons.length,
    });

    let currentGeom = { ...geom1 };

    for (let i = 0; i < geom2.polygons.length; i++) {
      console.log(
        `Processing geometry2 polygon ${i + 1}/${geom2.polygons.length}`,
      );
      const poly2 = geom2.polygons[i];
      const plane = this.calculatePlane(poly2);
      console.log("Using plane:", plane);

      const { front } = await this.splitPolygons(currentGeom.polygons, plane);
      console.log("Split result front polygons:", front.length);

      currentGeom = { ...currentGeom, polygons: front };
    }

    return currentGeom;
  }

  private calculatePlane(poly: Poly3): Plane {
    if (poly.plane) return poly.plane;

    const [v1, v2, v3] = poly.vertices;
    const e1: Vec3 = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
    const e2: Vec3 = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];

    // Cross product to get normal
    const normal: Vec3 = [
      e1[1] * e2[2] - e1[2] * e2[1],
      e1[2] * e2[0] - e1[0] * e2[2],
      e1[0] * e2[1] - e1[1] * e2[0],
    ];

    // Normalize
    const len = Math.sqrt(
      normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2],
    );
    normal[0] /= len;
    normal[1] /= len;
    normal[2] /= len;

    // Calculate d
    const d = normal[0] * v1[0] + normal[1] * v1[1] + normal[2] * v1[2];

    return [normal[0], normal[1], normal[2], d];
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
