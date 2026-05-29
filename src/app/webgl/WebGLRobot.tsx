/**
 * WebGLRobot.tsx — WebGL replacement for RobotBuilder.tsx
 *
 * Accepts the same props as RobotBuilder so you can swap it in directly:
 *   <WebGLRobot progress={robotProgress} celebrateCount={itemsSorted} />
 *
 * How it works:
 *   The robot is broken into named "parts" (base, legs, body, arms, head, antenna).
 *   Each part has geometry described as triangles in an SVG-style coordinate
 *   space (120 × 160 logical units, matching the original viewBox).
 *
 *   A single vertex shader transforms those logical coordinates to NDC using
 *   the canvas dimensions. The fragment shader just applies a flat color.
 *   Parts are revealed as `progress` crosses their threshold, exactly like
 *   the original.
 *
 * Animation:
 *   - Idle:      antenna dot pulses via u_time
 *   - Celebrate: the entire robot bounces via a u_offset uniform (driven by
 *                a JS spring simulation triggered on celebrateCount changes)
 *   - Eye glow:  the eye circles use a different uniform-controlled color
 *
 * Next steps to make it yours:
 *   1. Replace the flat color shader with a gradient/glow shader per part
 *   2. Add a normal-mapped texture for a "metal panel" look
 *   3. Animate individual parts (e.g. arms swinging, legs stepping)
 *   4. Add a bloom post-process pass for the eye glow and antenna
 *
 * Coordinate system:
 *   Logical space  →  120 wide × 160 tall  (same as the original SVG viewBox)
 *   The vertex shader maps this to NDC with a simple linear transform and y-flip.
 */

import { useCallback, useRef, useEffect } from 'react';
import { WebGLCanvas, type GL } from './WebGLCanvas';
import {
  createProgram, createFloatBuffer, bindAttribute,
  rectVertices, circleVertices, roundedRectVertices, hexToRgb,
} from './webgl-utils';

// ---------------------------------------------------------------------------
// Shaders
// ---------------------------------------------------------------------------

// All robot geometry is defined in a 120×160 logical space.
// u_logicalSize tells the shader the logical canvas size.
// u_canvasSize  is the actual pixel size (for the NDC mapping).
// u_offset      is a pixel-space translation applied before projection
//               (used for the bounce animation).
const VERT = /* glsl */ `
  attribute vec2 a_position;    // in logical units (0–120, 0–160)

  uniform vec2  u_logicalSize;  // (120, 160)
  uniform vec2  u_canvasSize;   // actual canvas pixel size
  uniform vec2  u_offset;       // bounce offset in logical units

  void main() {
    vec2 pos = a_position + u_offset;

    // Logical → normalized (0–1) → NDC (−1 to +1), flip y because SVG y-down ≠ WebGL y-up
    vec2 ndc = (pos / u_logicalSize) * 2.0 - 1.0;
    ndc.y = -ndc.y;

    gl_Position = vec4(ndc, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform vec4 u_color; // rgba
  void main() {
    gl_FragColor = u_color;
  }
`;

// ---------------------------------------------------------------------------
// Robot geometry — all coordinates match the original SVG viewBox (120 × 160)
// ---------------------------------------------------------------------------

const LOGICAL_W = 120;
const LOGICAL_H = 160;

// Colors taken straight from the original RobotBuilder
const C = {
  orange:   hexToRgb('#f7931e'),
  red:      hexToRgb('#dc2626'),
  blue:     hexToRgb('#3498db'),
  dark:     hexToRgb('#0a0e27'),
  eyeGlow:  hexToRgb('#00d9ff'),
  eyeFlash: hexToRgb('#ffffff'),
  white:    hexToRgb('#ffffff'),
};

function rgba(rgb: [number, number, number], a = 1): [number, number, number, number] {
  return [...rgb, a] as [number, number, number, number];
}

/**
 * Each draw call is described as:
 *   color    — RGBA tuple passed to u_color
 *   vertices — Float32Array of (x, y) pairs forming TRIANGLES
 *   part     — which robot part this belongs to (for visibility threshold)
 */
interface DrawCall {
  color: [number, number, number, number];
  vertices: Float32Array;
  part: string;
}

function buildRobotGeometry(): DrawCall[] {
  const calls: DrawCall[] = [];

  // Helper to push a draw call
  const add = (part: string, color: [number, number, number, number], verts: Float32Array) =>
    calls.push({ part, color, vertices: verts });

  // -- BASE --
  add('base', rgba(C.orange), roundedRectVertices(40, 140, 40, 8, 4));

  // -- LEFT LEG --
  add('leftLeg', rgba(C.red), rectVertices(42, 110, 8, 30));
  add('leftLeg', rgba(C.red), circleVertices(46, 138, 4));

  // -- RIGHT LEG --
  add('rightLeg', rgba(C.red), rectVertices(70, 110, 8, 30));
  add('rightLeg', rgba(C.red), circleVertices(74, 138, 4));

  // -- BODY --
  add('body', rgba(C.orange, 0.9), roundedRectVertices(35, 65, 50, 45, 8));
  // Body detail circles (act as "buttons")
  add('body', rgba(C.dark), circleVertices(50, 85, 3));
  add('body', rgba(C.dark), circleVertices(70, 85, 3));
  // Body detail bar
  add('body', rgba(C.dark, 0.5), rectVertices(45, 95, 30, 3));

  // -- LEFT ARM --
  add('leftArm', rgba(C.blue), rectVertices(22, 70, 6, 25));
  add('leftArm', rgba(C.blue), circleVertices(25, 96, 4));

  // -- RIGHT ARM --
  add('rightArm', rgba(C.blue), rectVertices(92, 70, 6, 25));
  add('rightArm', rgba(C.blue), circleVertices(95, 96, 4));

  // -- HEAD --
  add('head', rgba(C.orange), roundedRectVertices(40, 30, 40, 35, 6));
  // Eye sockets (dark circles)
  add('head', rgba(C.dark), circleVertices(50, 45, 5));
  add('head', rgba(C.dark), circleVertices(70, 45, 5));
  // Eye pupils — tagged separately so we can change their color via a uniform
  // (In this skeleton they're separate DrawCalls. You can also pass a second
  //  uniform for "eye glow on/off" and handle it in the fragment shader.)
  add('eye_l', rgba(C.eyeGlow), circleVertices(50, 45, 2));
  add('eye_r', rgba(C.eyeGlow), circleVertices(70, 45, 2));

  // -- ANTENNA --
  // The vertical stick is a very thin rectangle
  add('antenna', rgba(C.blue), rectVertices(59, 15, 2, 15));
  // The pulsing antenna ball — drawn last so it's on top
  add('antennaBall', rgba(C.blue), circleVertices(60, 12, 4));
  add('antennaBall', rgba(C.blue, 0.3), circleVertices(60, 12, 6));

  return calls;
}

// ---------------------------------------------------------------------------
// Part visibility thresholds (mirrors RobotBuilder.tsx)
// ---------------------------------------------------------------------------

const PART_THRESHOLDS: Record<string, number> = {
  base:        0,
  leftLeg:     0.125,
  rightLeg:    0.25,
  body:        0.375,
  leftArm:     0.5,
  rightArm:    0.625,
  head:        0.75,
  eye_l:       0.75,  // eyes are part of the head
  eye_r:       0.75,
  antenna:     0.875,
  antennaBall: 0.875,
};

// ---------------------------------------------------------------------------
// Spring helper for the bounce animation
// ---------------------------------------------------------------------------

interface Spring {
  value: number;
  velocity: number;
  target: number;
}

function stepSpring(s: Spring, dt: number, stiffness = 300, damping = 20): void {
  const force = stiffness * (s.target - s.value) - damping * s.velocity;
  s.velocity += force * dt;
  s.value    += s.velocity * dt;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface WebGLRobotProps {
  progress: number;      // 0 → 1 — same as RobotBuilder
  celebrateCount?: number; // increment to trigger a celebration bounce
}

// Canvas size in pixels — scaled up from the 120×160 logical space (×1.5)
const CANVAS_W = 180;
const CANVAS_H = 240;

export function WebGLRobot({ progress, celebrateCount = 0 }: WebGLRobotProps) {
  // ---- GPU resources ----
  const gpuRef = useRef<{
    prog:       WebGLProgram;
    drawCalls:  Array<{ color: [number, number, number, number]; buf: WebGLBuffer; count: number; part: string }>;
    uLogical:   WebGLUniformLocation | null;
    uCanvas:    WebGLUniformLocation | null;
    uOffset:    WebGLUniformLocation | null;
    uColor:     WebGLUniformLocation | null;
    uTime:      WebGLUniformLocation | null;
  } | null>(null);

  // ---- Animation state ----
  const bounceSpringY = useRef<Spring>({ value: 0, velocity: 0, target: 0 });
  const eyeFlashRef   = useRef(false);
  const prevCelebrate = useRef(celebrateCount);

  // ---- Props refs (avoid stale closures in callbacks) ----
  const progressRef = useRef(progress);
  useEffect(() => { progressRef.current = progress; }, [progress]);

  // Trigger bounce + eye flash on celebrateCount change
  useEffect(() => {
    if (celebrateCount === prevCelebrate.current) return;
    prevCelebrate.current = celebrateCount;

    // Kick the spring upward
    bounceSpringY.current.velocity = -400;

    // Eye flash for 400 ms
    eyeFlashRef.current = true;
    const t = setTimeout(() => { eyeFlashRef.current = false; }, 400);
    return () => clearTimeout(t);
  }, [celebrateCount]);

  const onInit = useCallback((gl: GL) => {
    const prog = createProgram(gl, VERT, FRAG);
    if (!prog) return;

    // Pre-upload all geometry into separate GPU buffers (one per DrawCall)
    const template = buildRobotGeometry();
    const drawCalls = template.map(dc => ({
      color: dc.color,
      part:  dc.part,
      buf:   createFloatBuffer(gl, dc.vertices)!,
      count: dc.vertices.length / 2, // vertices = floats / 2 (x+y)
    }));

    gpuRef.current = {
      prog,
      drawCalls,
      uLogical: gl.getUniformLocation(prog, 'u_logicalSize'),
      uCanvas:  gl.getUniformLocation(prog, 'u_canvasSize'),
      uOffset:  gl.getUniformLocation(prog, 'u_offset'),
      uColor:   gl.getUniformLocation(prog, 'u_color'),
      uTime:    gl.getUniformLocation(prog, 'u_time'),
    };
  }, []);

  const onRender = useCallback((gl: GL, canvas: HTMLCanvasElement, timeMs: number, deltaMs: number) => {
    const gpu = gpuRef.current;
    if (!gpu) return;

    const dt = Math.min(deltaMs / 1000, 0.05);
    const t  = timeMs / 1000;

    // Step bounce spring
    bounceSpringY.current.target = 0;
    stepSpring(bounceSpringY.current, dt);
    const bounceY = bounceSpringY.current.value;

    // Antenna pulse (sine wave so it breathes even when idle)
    const antennaPulse = 0.5 + 0.5 * Math.sin(t * 2.5);

    gl.clearColor(0, 0, 0, 0); // transparent — lets the HTML background show through
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(gpu.prog);
    gl.uniform2f(gpu.uLogical, LOGICAL_W, LOGICAL_H);
    gl.uniform2f(gpu.uCanvas,  canvas.width, canvas.height);
    gl.uniform2f(gpu.uOffset,  0, bounceY);

    const p = progressRef.current;

    for (const dc of gpu.drawCalls) {
      // Skip parts that haven't been unlocked yet
      const threshold = PART_THRESHOLDS[dc.part] ?? 0;
      if (p < threshold) continue;

      // Dynamic color overrides
      let [r, g, b, a] = dc.color;

      if ((dc.part === 'eye_l' || dc.part === 'eye_r') && eyeFlashRef.current) {
        // Eye flash: override to white
        [r, g, b] = C.eyeFlash;
      }
      if (dc.part === 'antennaBall') {
        // Antenna breathes opacity
        a *= 0.4 + 0.6 * antennaPulse;
      }

      gl.uniform4f(gpu.uColor, r, g, b, a);
      bindAttribute(gl, gpu.prog, 'a_position', dc.buf, 2);
      gl.drawArrays(gl.TRIANGLES, 0, dc.count);
    }
  }, []);

  const onDestroy = useCallback((gl: GL) => {
    const gpu = gpuRef.current;
    if (!gpu) return;
    gl.deleteProgram(gpu.prog);
    for (const dc of gpu.drawCalls) gl.deleteBuffer(dc.buf);
    gpuRef.current = null;
  }, []);

  return (
    <WebGLCanvas
      onInit={onInit}
      onRender={onRender}
      onDestroy={onDestroy}
      style={{ width: CANVAS_W, height: CANVAS_H, flexShrink: 0 }}
    />
  );
}
