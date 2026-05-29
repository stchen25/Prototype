/**
 * WebGLParticles.tsx — GPU-accelerated particle system
 *
 * Replaces these existing components:
 *   - Sparkle (in RobotBuilder.tsx)           — the star-burst when an item is sorted
 *   - FloatingParticles (FloatingParticles.tsx) — ambient drifting dots
 *   - canvas-confetti (ResultsScreen.tsx)      — celebration confetti
 *
 * Architecture overview:
 *   Particles are simulated on the CPU (position, velocity, life), then uploaded
 *   to the GPU as a DYNAMIC_DRAW buffer each frame. The vertex shader converts
 *   each particle's screen-space position to NDC and sets gl_PointSize.
 *   The fragment shader draws a soft circular sprite, fading with particle life.
 *
 *   This keeps the simulation logic in easy-to-tweak JavaScript while still
 *   doing the actual rendering on the GPU (fast even for thousands of particles).
 *
 * How to use for sparkle bursts (replacing the Sparkle component):
 *   const [burstKey, setBurstKey] = useState(0);
 *   // Call setBurstKey(k => k + 1) whenever an item is sorted
 *   <WebGLParticles
 *     mode="burst"
 *     trigger={burstKey}
 *     origin={{ x: 0.5, y: 0.5 }}   // 0–1 normalized screen coords
 *     colors={['#f7931e', '#3498db', '#dc2626']}
 *   />
 *
 * How to use for ambient floating particles (replacing FloatingParticles):
 *   <WebGLParticles mode="ambient" colors={['#f7931e', '#3498db']} />
 *
 * How to use for confetti (replacing canvas-confetti):
 *   <WebGLParticles
 *     mode="confetti"
 *     trigger={showResults ? 1 : 0}
 *     colors={['#f7931e', '#3498db', '#dc2626', '#16a34a']}
 *   />
 */

import { useCallback, useRef, useEffect } from 'react';
import { WebGLCanvas, type GL } from './WebGLCanvas';
import { createProgram, createFloatBuffer, updateFloatBuffer, bindAttribute, hexToRgb } from './webgl-utils';

// ---------------------------------------------------------------------------
// Shaders
// ---------------------------------------------------------------------------

const VERT = /* glsl */ `
  attribute vec2  a_pos;    // screen-space position (pixels, origin top-left)
  attribute float a_life;   // 0 = dead, 1 = just spawned
  attribute vec3  a_color;
  attribute float a_size;   // desired point size in pixels

  uniform vec2 u_resolution; // canvas size in pixels

  varying float v_life;
  varying vec3  v_color;

  void main() {
    // Convert from pixel-space (top-left origin) to NDC (center origin, y-up)
    vec2 ndc = (a_pos / u_resolution) * 2.0 - 1.0;
    ndc.y = -ndc.y; // flip y because CSS y-axis points down

    gl_Position  = vec4(ndc, 0.0, 1.0);
    gl_PointSize = a_size * a_life; // shrink as particle dies

    v_life  = a_life;
    v_color = a_color;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;

  varying float v_life;
  varying vec3  v_color;

  void main() {
    // gl_PointCoord is (0,0)→(1,1) across the square point sprite
    vec2 pc = gl_PointCoord - 0.5;  // center at (0,0)
    float d = length(pc);

    // Discard pixels outside the circle (makes the point look round)
    if (d > 0.5) discard;

    // Soft edge + fade by life
    float alpha = (1.0 - smoothstep(0.3, 0.5, d)) * v_life;
    gl_FragColor = vec4(v_color, alpha);
  }
`;

// ---------------------------------------------------------------------------
// Particle simulation (CPU side)
// ---------------------------------------------------------------------------

/** Float32Array layout per particle:  x, y, vx, vy, life, r, g, b, size  (9 floats) */
const FLOATS_PER_PARTICLE = 9;

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number;  // 1 → 0
  decay: number; // life lost per second
  r: number; g: number; b: number;
  size: number;
}

function spawnBurst(
  particles: Particle[],
  maxCount: number,
  origin: { x: number; y: number }, // normalized 0–1
  colors: [number, number, number][],
  canvasW: number,
  canvasH: number
): void {
  const ox = origin.x * canvasW;
  const oy = origin.y * canvasH;
  const spawned = Math.min(30, maxCount); // burst size

  for (let i = 0; i < spawned; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 80 + Math.random() * 200;
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Find a dead slot to reuse, or push if not full
    const dead = particles.findIndex(p => p.life <= 0);
    const p: Particle = {
      x: ox, y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      decay: 0.8 + Math.random() * 0.8, // dies in 0.6–1.25 s
      r: color[0], g: color[1], b: color[2],
      size: 6 + Math.random() * 10,
    };
    if (dead !== -1) particles[dead] = p;
    else if (particles.length < maxCount) particles.push(p);
  }
}

function spawnAmbient(
  particles: Particle[],
  maxCount: number,
  colors: [number, number, number][],
  canvasW: number,
  canvasH: number
): void {
  if (particles.length >= maxCount) return;
  const color = colors[Math.floor(Math.random() * colors.length)];
  particles.push({
    x: Math.random() * canvasW,
    y: canvasH + 10,  // start just below the canvas
    vx: (Math.random() - 0.5) * 30,
    vy: -(20 + Math.random() * 60), // drift upward
    life: 1.0,
    decay: 0.15 + Math.random() * 0.15, // slow fade
    r: color[0], g: color[1], b: color[2],
    size: 3 + Math.random() * 5,
  });
}

function spawnConfetti(
  particles: Particle[],
  maxCount: number,
  colors: [number, number, number][],
  canvasW: number
): void {
  if (particles.length >= maxCount) return;
  const count = Math.min(5, maxCount - particles.length);
  for (let i = 0; i < count; i++) {
    const side = Math.random() < 0.5 ? 0.1 + Math.random() * 0.2 : 0.7 + Math.random() * 0.2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    particles.push({
      x: side * canvasW,
      y: -10,
      vx: (Math.random() - 0.5) * 150,
      vy: 80 + Math.random() * 200,
      life: 1.0,
      decay: 0.25 + Math.random() * 0.2,
      r: color[0], g: color[1], b: color[2],
      size: 8 + Math.random() * 8,
    });
  }
}

function stepParticles(particles: Particle[], dtSec: number): void {
  for (const p of particles) {
    if (p.life <= 0) continue;
    p.x  += p.vx * dtSec;
    p.y  += p.vy * dtSec;
    p.vy += 200 * dtSec; // gravity (pixels/s²)
    p.life = Math.max(0, p.life - p.decay * dtSec);
  }
}

/** Pack live particles into a flat Float32Array for the GPU. */
function packParticles(particles: Particle[], out: Float32Array): number {
  let count = 0;
  for (const p of particles) {
    if (p.life <= 0) continue;
    const base = count * FLOATS_PER_PARTICLE;
    out[base + 0] = p.x;
    out[base + 1] = p.y;
    out[base + 2] = p.vx;
    out[base + 3] = p.vy;
    out[base + 4] = p.life;
    out[base + 5] = p.r;
    out[base + 6] = p.g;
    out[base + 7] = p.b;
    out[base + 8] = p.size;
    count++;
  }
  return count;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type ParticleMode = 'burst' | 'ambient' | 'confetti';

interface WebGLParticlesProps {
  mode: ParticleMode;
  /** Increment this value to trigger a burst (for mode="burst"). */
  trigger?: number;
  /** Normalized screen-space origin of burst, e.g. { x: 0.5, y: 0.5 }. */
  origin?: { x: number; y: number };
  colors?: string[]; // CSS hex colors
  maxParticles?: number;
  className?: string;
  style?: React.CSSProperties;
}

const MAX_PARTICLES_DEFAULT = 200;

export function WebGLParticles({
  mode,
  trigger = 0,
  origin = { x: 0.5, y: 0.5 },
  colors = ['#f7931e', '#3498db', '#dc2626'],
  maxParticles = MAX_PARTICLES_DEFAULT,
  className,
  style,
}: WebGLParticlesProps) {
  const gpuRef = useRef<{
    prog: WebGLProgram;
    buf: WebGLBuffer;
    uRes: WebGLUniformLocation | null;
    cpuBuf: Float32Array;
  } | null>(null);

  const particlesRef = useRef<Particle[]>([]);
  const prevTriggerRef = useRef(trigger);
  const canvasSizeRef = useRef({ w: 1, h: 1 });

  // Parse colors once
  const rgbColors = colors.map(hexToRgb) as [number, number, number][];

  // React to trigger changes (burst mode)
  useEffect(() => {
    if (mode !== 'burst') return;
    if (trigger !== prevTriggerRef.current) {
      prevTriggerRef.current = trigger;
      spawnBurst(
        particlesRef.current, maxParticles, origin, rgbColors,
        canvasSizeRef.current.w, canvasSizeRef.current.h
      );
    }
  }, [trigger, mode, maxParticles, origin, rgbColors]);

  const onInit = useCallback((gl: GL, canvas: HTMLCanvasElement) => {
    // Buffer max size pre-allocated so we never re-allocate on the GPU
    const cpuBuf = new Float32Array(maxParticles * FLOATS_PER_PARTICLE);
    const prog = createProgram(gl, VERT, FRAG);
    // DYNAMIC_DRAW hints to the driver that we'll update this buffer often
    const buf = createFloatBuffer(gl, cpuBuf, gl.DYNAMIC_DRAW);
    if (!prog || !buf) return;

    gpuRef.current = {
      prog, buf,
      uRes: gl.getUniformLocation(prog, 'u_resolution'),
      cpuBuf,
    };
    canvasSizeRef.current = { w: canvas.width, h: canvas.height };
  }, [maxParticles]);

  // Ambient spawn timer
  const ambientTimerRef = useRef(0);

  const onRender = useCallback((gl: GL, canvas: HTMLCanvasElement, _time: number, deltaMs: number) => {
    const gpu = gpuRef.current;
    if (!gpu) return;

    const dt = Math.min(deltaMs / 1000, 0.05); // cap dt to avoid spiral-of-death on tab switch
    canvasSizeRef.current = { w: canvas.width, h: canvas.height };

    // Spawn logic by mode
    if (mode === 'ambient') {
      ambientTimerRef.current += dt;
      if (ambientTimerRef.current > 0.15) { // spawn a particle every ~150 ms
        ambientTimerRef.current = 0;
        spawnAmbient(particlesRef.current, maxParticles, rgbColors, canvas.width, canvas.height);
      }
    } else if (mode === 'confetti') {
      spawnConfetti(particlesRef.current, maxParticles, rgbColors, canvas.width);
    }

    stepParticles(particlesRef.current, dt);

    // Remove fully dead particles to keep the array from growing forever
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);

    const count = packParticles(particlesRef.current, gpu.cpuBuf);
    if (count === 0) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      return;
    }

    // Upload only the live portion of the buffer
    updateFloatBuffer(gl, gpu.buf, gpu.cpuBuf.subarray(0, count * FLOATS_PER_PARTICLE));

    gl.clearColor(0, 0, 0, 0); // transparent background
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(gpu.prog);
    gl.uniform2f(gpu.uRes, canvas.width, canvas.height);

    const stride = FLOATS_PER_PARTICLE * Float32Array.BYTES_PER_ELEMENT; // 36 bytes
    const F = Float32Array.BYTES_PER_ELEMENT;

    // Interleaved buffer: each vertex has [x, y, vx, vy, life, r, g, b, size]
    // We only send the attributes the shader cares about (x,y  life  r,g,b  size)
    bindAttribute(gl, gpu.prog, 'a_pos',   gpu.buf, 2, stride, 0);       // x, y
    bindAttribute(gl, gpu.prog, 'a_life',  gpu.buf, 1, stride, 4 * F);   // life
    bindAttribute(gl, gpu.prog, 'a_color', gpu.buf, 3, stride, 5 * F);   // r, g, b
    bindAttribute(gl, gpu.prog, 'a_size',  gpu.buf, 1, stride, 8 * F);   // size

    gl.drawArrays(gl.POINTS, 0, count);
  }, [mode, maxParticles, rgbColors]);

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
