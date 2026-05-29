/**
 * WebGLBackground.tsx — Animated circuit-board background
 *
 * Replaces the static CSS gradients and SVG circuit decoration in App.tsx and
 * QuizStart.tsx with a real-time WebGL shader.
 *
 * The shader draws:
 *   1. A dark gradient base (matches the dark theme palette)
 *   2. A subtle grid of circuit-trace lines
 *   3. Pulsing node dots at grid intersections (random timing per node)
 *   4. A "signal pulse" that travels along horizontal traces
 *
 * How to integrate into App.tsx:
 *   Replace:
 *     <div className="absolute inset-0 bg-gradient-to-br from-background ..." />
 *     <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 ..." />
 *     <div className="absolute bottom-0 left-0 w-96 h-96 ..." />
 *   With:
 *     <WebGLBackground className="absolute inset-0 w-full h-full" />
 *
 * Customisation ideas:
 *   - Change GRID_SCALE for denser / sparser grid
 *   - Swap COLOR_A / COLOR_B for different palettes
 *   - Add a vertical-trace signal by mirroring the horizontal signal logic
 *   - Add a second pass for diagonal traces (change grid to a hex grid)
 */

import { useCallback, useRef } from 'react';
import { WebGLCanvas, type GL } from './WebGLCanvas';
import { createProgram, createFloatBuffer, bindAttribute } from './webgl-utils';

// ---------------------------------------------------------------------------
// Shaders
// ---------------------------------------------------------------------------

// A fullscreen quad covering clip-space. The fragment shader does all the work.
const VERT = /* glsl */ `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;

  uniform float u_time;       // seconds elapsed
  uniform vec2  u_resolution; // canvas pixel size (width, height)

  // Quick & dirty pseudo-random based on grid cell ID
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    // UV: (0,0) bottom-left → (1,1) top-right
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // ---- Base gradient ----
    // Dark navy at top, slightly lighter at bottom — matches the dark theme
    vec3 col = mix(vec3(0.04, 0.06, 0.12), vec3(0.02, 0.03, 0.07), uv.y);

    // ---- Grid ----
    float scale = 14.0;  // number of cells across the screen — increase for denser grid
    vec2 cell = uv * scale;          // position within the grid (continuous)
    vec2 cellId = floor(cell);        // which cell we're in (integer coords)
    vec2 cellUV = fract(cell);        // (0,0)→(1,1) within this cell

    float lineThickness = 0.04;      // fraction of a cell occupied by a trace
    float hLine = step(1.0 - lineThickness, cellUV.y);
    float vLine = step(1.0 - lineThickness, cellUV.x);
    float lines = clamp(hLine + vLine, 0.0, 1.0);

    // Dim blue-grey trace color
    col += vec3(0.06, 0.12, 0.22) * lines;

    // ---- Node dots at intersections ----
    // Each corner of a cell is shared with three neighbours; we sample at the
    // top-right corner of every cell (which is the bottom-left of the cell to
    // the top-right). Using floor(cell + 0.5) gives the nearest grid node.
    vec2 nodeId = floor(cell + 0.5);
    float nodeRand = hash(nodeId);

    // Unique pulse speed and phase per node
    float pulseFreq  = 0.6 + nodeRand * 1.4;      // 0.6–2.0 Hz
    float pulsePhase = nodeRand * 6.2832;          // random start phase
    float pulse = 0.5 + 0.5 * sin(u_time * pulseFreq + pulsePhase);

    float nodeDist = length(cell - nodeId);        // distance to nearest node
    float nodeR    = 0.18;                         // node radius in cell units
    float nodeMask = 1.0 - smoothstep(0.08, nodeR, nodeDist);

    // Mix between blue (cool, inactive) and orange (warm, active)
    vec3 nodeBase = mix(vec3(0.15, 0.35, 0.70), vec3(0.97, 0.58, 0.12), nodeRand);
    col += nodeBase * nodeMask * pulse * 0.55;

    // Soft halo around the node
    float haloMask = 1.0 - smoothstep(nodeR, nodeR * 2.5, nodeDist);
    col += nodeBase * haloMask * pulse * 0.12;

    // ---- Signal pulse travelling along horizontal traces ----
    // One signal per row, offset by a per-row hash so they don't all move together
    float rowHash   = hash(vec2(cellId.y, 42.0));
    float signalPos = fract(u_time * 0.18 + rowHash);   // 0→1 over ~5.5 s
    float distToSignal = abs(cellUV.x - signalPos);
    // Gaussian glow around the signal head
    float signalGlow = exp(-distToSignal * distToSignal * 600.0);
    // Only show the signal on horizontal traces (top edge of cell)
    col += vec3(0.0, 0.85, 1.0) * signalGlow * hLine * 0.85;

    // ---- Vignette ----
    vec2 q = uv - 0.5;
    float vignette = 1.0 - dot(q, q) * 1.6;
    col *= clamp(vignette, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

// Two triangles forming a fullscreen quad in clip space [-1,1]
const QUAD = new Float32Array([
  -1, -1,   1, -1,  -1,  1,
   1, -1,   1,  1,  -1,  1,
]);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface WebGLBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders the animated circuit background. Mount as a sibling of your
 * content with absolute positioning so it fills the screen behind everything.
 *
 * The canvas has pointer-events:none so it never intercepts user interactions.
 */
export function WebGLBackground({ className, style }: WebGLBackgroundProps) {
  // GPU resources — allocated in onInit, referenced in onRender
  const gpuRef = useRef<{
    prog: WebGLProgram;
    buf: WebGLBuffer;
    uTime: WebGLUniformLocation | null;
    uRes:  WebGLUniformLocation | null;
  } | null>(null);

  const onInit = useCallback((gl: GL) => {
    const prog = createProgram(gl, VERT, FRAG);
    const buf  = createFloatBuffer(gl, QUAD);
    if (!prog || !buf) return;

    gpuRef.current = {
      prog,
      buf,
      uTime: gl.getUniformLocation(prog, 'u_time'),
      uRes:  gl.getUniformLocation(prog, 'u_resolution'),
    };
  }, []);

  const onRender = useCallback((gl: GL, canvas: HTMLCanvasElement, timeMs: number) => {
    const gpu = gpuRef.current;
    if (!gpu) return;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(gpu.prog);

    // Pass time in seconds and current canvas size to the shader
    gl.uniform1f(gpu.uTime, timeMs / 1000);
    gl.uniform2f(gpu.uRes, canvas.width, canvas.height);

    bindAttribute(gl, gpu.prog, 'a_position', gpu.buf, 2);
    gl.drawArrays(gl.TRIANGLES, 0, 6); // 6 vertices = 2 triangles = 1 quad
  }, []);

  const onDestroy = useCallback((gl: GL) => {
    const gpu = gpuRef.current;
    if (!gpu) return;
    gl.deleteProgram(gpu.prog);
    gl.deleteBuffer(gpu.buf);
    gpuRef.current = null;
  }, []);

  return (
    <WebGLCanvas
      onInit={onInit}
      onRender={onRender}
      onDestroy={onDestroy}
      className={className}
      style={{ pointerEvents: 'none', ...style }}
    />
  );
}
