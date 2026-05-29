/**
 * webgl-utils.ts — Core WebGL helper functions
 *
 * These utilities are the foundation for every WebGL component in this project.
 * Import what you need; nothing here has side effects.
 */

// ---------------------------------------------------------------------------
// Shader compilation
// ---------------------------------------------------------------------------

/**
 * Compile a single GLSL shader stage.
 * type is gl.VERTEX_SHADER or gl.FRAGMENT_SHADER.
 */
export function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      `[WebGL] Shader compile error (${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'}):`,
      gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Link a vertex + fragment source into a usable program.
 * Returns null and logs on any error.
 */
export function createProgram(
  gl: WebGLRenderingContext,
  vertSrc: string,
  fragSrc: string
): WebGLProgram | null {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vert || !frag) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);

  // Intermediate shader objects are no longer needed once linked
  gl.deleteShader(vert);
  gl.deleteShader(frag);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('[WebGL] Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

// ---------------------------------------------------------------------------
// Buffer helpers
// ---------------------------------------------------------------------------

/**
 * Upload a Float32Array to a new ARRAY_BUFFER.
 * Pass gl.DYNAMIC_DRAW for buffers you update every frame (particles, etc.).
 */
export function createFloatBuffer(
  gl: WebGLRenderingContext,
  data: Float32Array,
  usage: number = gl.STATIC_DRAW
): WebGLBuffer | null {
  const buf = gl.createBuffer();
  if (!buf) return null;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, data, usage);
  return buf;
}

/**
 * Re-upload data into an existing buffer (DYNAMIC_DRAW pattern).
 * Call this every frame for buffers that change (e.g. particle positions).
 */
export function updateFloatBuffer(
  gl: WebGLRenderingContext,
  buf: WebGLBuffer,
  data: Float32Array
): void {
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
}

/**
 * Bind a buffer to a vertex attribute and describe its layout.
 *   name   — GLSL attribute name (e.g. "a_position")
 *   size   — number of floats per vertex for this attribute (1–4)
 *   stride — byte distance between consecutive vertices (0 = tightly packed)
 *   offset — byte offset of this attribute within each vertex
 */
export function bindAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  buf: WebGLBuffer,
  size: number,
  stride = 0,
  offset = 0
): void {
  const loc = gl.getAttribLocation(program, name);
  if (loc === -1) return; // attribute was optimized away or name is wrong
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset);
}

// ---------------------------------------------------------------------------
// 2-D geometry helpers (all return Float32Array ready for gl.ARRAY_BUFFER)
// ---------------------------------------------------------------------------

/**
 * Returns 6 (x,y) pairs that form two triangles covering an axis-aligned rect.
 * Coordinates are in whatever space your vertex shader expects.
 */
export function rectVertices(
  x: number, y: number, w: number, h: number
): Float32Array {
  return new Float32Array([
    x,     y,
    x + w, y,
    x,     y + h,
    x + w, y,
    x + w, y + h,
    x,     y + h,
  ]);
}

/**
 * Returns a triangle fan that approximates a filled circle.
 * `segments` controls smoothness — 20 is fine for small radii, use 48+ for large.
 */
export function circleVertices(
  cx: number, cy: number, r: number, segments = 24
): Float32Array {
  const verts: number[] = [];
  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * Math.PI * 2;
    const a1 = ((i + 1) / segments) * Math.PI * 2;
    verts.push(
      cx, cy,
      cx + Math.cos(a0) * r, cy + Math.sin(a0) * r,
      cx + Math.cos(a1) * r, cy + Math.sin(a1) * r
    );
  }
  return new Float32Array(verts);
}

/**
 * Returns vertices for a rounded rectangle by combining a center rect,
 * two horizontal edge rects, two vertical edge rects, and four corner circles.
 * This is one approach — you can also do it purely in a fragment shader.
 */
export function roundedRectVertices(
  x: number, y: number, w: number, h: number, r: number,
  segments = 12
): Float32Array {
  r = Math.min(r, w / 2, h / 2);
  const parts: Float32Array[] = [
    rectVertices(x + r, y,     w - r * 2, h),        // center column
    rectVertices(x,     y + r, r,         h - r * 2), // left strip
    rectVertices(x + w - r, y + r, r, h - r * 2),    // right strip
    circleVertices(x + r,     y + r,     r, segments), // TL corner
    circleVertices(x + w - r, y + r,     r, segments), // TR corner
    circleVertices(x + r,     y + h - r, r, segments), // BL corner
    circleVertices(x + w - r, y + h - r, r, segments), // BR corner
  ];
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Float32Array(total);
  let cursor = 0;
  for (const p of parts) { out.set(p, cursor); cursor += p.length; }
  return out;
}

// ---------------------------------------------------------------------------
// Color utilities
// ---------------------------------------------------------------------------

/** Parse a CSS hex color (#rrggbb or #rgb) into [r, g, b] in 0–1 range. */
export function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace('#', '');
  if (c.length === 3) {
    return [
      parseInt(c[0] + c[0], 16) / 255,
      parseInt(c[1] + c[1], 16) / 255,
      parseInt(c[2] + c[2], 16) / 255,
    ];
  }
  return [
    parseInt(c.slice(0, 2), 16) / 255,
    parseInt(c.slice(2, 4), 16) / 255,
    parseInt(c.slice(4, 6), 16) / 255,
  ];
}

// ---------------------------------------------------------------------------
// Coordinate-space conversions
// ---------------------------------------------------------------------------

/**
 * Map a point from a logical 2-D space (e.g. 120×160 SVG viewBox) to WebGL
 * Normalized Device Coordinates (NDC: x,y both in [-1, 1]).
 *
 * WebGL's y-axis points UP, but SVG/CSS y-axis points DOWN.
 * Pass flipY=true (the default) to account for this.
 */
export function toNDC(
  x: number, y: number,
  logicalW: number, logicalH: number,
  flipY = true
): [number, number] {
  const nx = (x / logicalW) * 2 - 1;
  const ny = (y / logicalH) * 2 - 1;
  return [nx, flipY ? -ny : ny];
}
