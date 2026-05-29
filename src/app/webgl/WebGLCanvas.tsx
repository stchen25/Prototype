/**
 * WebGLCanvas.tsx — Generic React wrapper for a WebGL <canvas>
 *
 * Drop this in wherever you need a WebGL surface. It handles:
 *   - Creating and exposing the WebGL context
 *   - A requestAnimationFrame render loop with elapsed time
 *   - High-DPI (devicePixelRatio) canvas sizing
 *   - Proper cleanup on unmount
 *
 * Pattern of use:
 *   1. Create your shaders/buffers/programs in onInit.
 *   2. Draw with those resources in onRender every frame.
 *   3. Delete GPU resources in onDestroy.
 *
 * Example:
 *   function MyEffect() {
 *     const glRef = useRef<{ prog: WebGLProgram; buf: WebGLBuffer } | null>(null);
 *
 *     const init = useCallback((gl: WebGLRenderingContext) => {
 *       const prog = createProgram(gl, VERT, FRAG)!;
 *       const buf  = createFloatBuffer(gl, quadVertices)!;
 *       glRef.current = { prog, buf };
 *     }, []);
 *
 *     const render = useCallback((gl: WebGLRenderingContext, canvas: HTMLCanvasElement, t: number) => {
 *       gl.clear(gl.COLOR_BUFFER_BIT);
 *       const { prog, buf } = glRef.current!;
 *       gl.useProgram(prog);
 *       gl.uniform1f(gl.getUniformLocation(prog, 'u_time'), t / 1000);
 *       bindAttribute(gl, prog, 'a_position', buf, 2);
 *       gl.drawArrays(gl.TRIANGLES, 0, 6);
 *     }, []);
 *
 *     return <WebGLCanvas onInit={init} onRender={render} className="w-full h-full" />;
 *   }
 */

import { useEffect, useRef } from 'react';

export type GL = WebGLRenderingContext;

export type RenderFn = (
  gl: GL,
  canvas: HTMLCanvasElement,
  timeMs: number,    // total elapsed milliseconds since first frame
  deltaMs: number    // milliseconds since last frame — useful for physics updates
) => void;

interface WebGLCanvasProps {
  onInit?: (gl: GL, canvas: HTMLCanvasElement) => void;
  onRender: RenderFn;
  onDestroy?: (gl: GL) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function WebGLCanvas({ onInit, onRender, onDestroy, className, style }: WebGLCanvasProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const prevTimeRef = useRef<number>(0);

  // Keep callback refs stable so the loop always calls the latest version
  // without needing to restart the loop when props change.
  const onInitRef    = useRef(onInit);
  const onRenderRef  = useRef(onRender);
  const onDestroyRef = useRef(onDestroy);
  useEffect(() => { onInitRef.current    = onInit;    }, [onInit]);
  useEffect(() => { onRenderRef.current  = onRender;  }, [onRender]);
  useEffect(() => { onDestroyRef.current = onDestroy; }, [onDestroy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Prefer WebGL2 for better feature set; fall back gracefully.
    const gl =
      (canvas.getContext('webgl2') as unknown as GL | null) ??
      canvas.getContext('webgl');
    if (!gl) {
      console.error('[WebGLCanvas] WebGL not available in this browser.');
      return;
    }

    // Enable standard alpha blending so your graphics can be transparent
    // over whatever is rendered behind the canvas in HTML.
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    /**
     * Sync canvas pixel dimensions to its CSS display size.
     * Must be called each frame (or at least on resize) because the element's
     * CSS layout size can change independently of its pixel buffer.
     * Multiplying by devicePixelRatio prevents blurry output on retina screens.
     */
    function syncSize() {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.floor(canvas!.clientWidth  * dpr);
      const h = Math.floor(canvas!.clientHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width  = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
      }
    }

    syncSize();
    onInitRef.current?.(gl, canvas);

    function loop(timestamp: number) {
      const delta = timestamp - prevTimeRef.current;
      prevTimeRef.current = timestamp;
      syncSize();
      onRenderRef.current(gl!, canvas!, timestamp, delta);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      onDestroyRef.current?.(gl);
    };
  }, []); // intentionally empty — runs once per mount

  return (
    <canvas
      ref={canvasRef}
      className={className}
      // display:block removes the extra baseline space browsers add to inline elements
      style={{ display: 'block', ...style }}
    />
  );
}
