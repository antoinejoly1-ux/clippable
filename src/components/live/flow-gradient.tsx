"use client";

import { useEffect, useRef } from "react";

/*
 * The brand gradient, flowing. A tiny WebGL shader draws the same ramp as the hero sky
 * (black → indigo → electric blue → sky → pale), as a dome rising from the bottom. The
 * field is displaced by slow travelling sine waves, so the colour bands swell and roll
 * left to right like water, with no visible wave shapes. Grain keeps the ramps smooth.
 * Runs only while on screen; reduced motion (or no WebGL) gets the still gradient.
 */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `precision highp float;
uniform vec2 r;uniform float t;
float hash(vec2 q){return fract(sin(dot(q,vec2(12.9898,78.233)))*43758.5453);}
vec3 ramp(float d){
  vec3 k0=vec3(0.),k1=vec3(.004,.008,.059),k2=vec3(.027,.039,.29),k3=vec3(.086,.188,.784),
       k4=vec3(.043,.361,1.),k5=vec3(.29,.576,1.),k6=vec3(.639,.8,1.),k7=vec3(.89,.937,1.),k8=vec3(.957,.965,.984);
  if(d<.14)return mix(k0,k1,d/.14);
  if(d<.27)return mix(k1,k2,(d-.14)/.13);
  if(d<.40)return mix(k2,k3,(d-.27)/.13);
  if(d<.50)return mix(k3,k4,(d-.40)/.10);
  if(d<.60)return mix(k4,k5,(d-.50)/.10);
  if(d<.72)return mix(k5,k6,(d-.60)/.12);
  if(d<.84)return mix(k6,k7,(d-.72)/.12);
  if(d<.96)return mix(k7,k8,(d-.84)/.12);
  return k8;
}
void main(){
  vec2 uv=gl_FragCoord.xy/r; // y = 0 at the bottom
  float a=r.x/r.y;
  // Travelling swells: the field is pushed up and down by sines moving left to right.
  float w=.075*sin(uv.x*a*2.1-t*.55)+.045*sin(uv.x*a*3.7-t*.9+uv.y*1.7)+.025*sin(uv.x*a*6.3-t*1.4);
  // A slow horizontal drift of the whole dome.
  vec2 o=vec2(.5+.08*sin(t*.12),-.16+w);
  vec2 q=(uv-o)*vec2(1./1.15,1./.95);
  float d=length(q);
  vec3 col=ramp(d);
  col+=(hash(gl_FragCoord.xy+fract(t))-.5)*.035; // grain
  gl_FragColor=vec4(col,1.);
}`;

export function FlowGradient({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      premultipliedAlpha: false,
    });
    if (!gl) return; // the CSS gradient behind the canvas stays as the fallback

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;
    const start = performance.now();

    const draw = (now: number) => {
      gl.uniform1f(uT, still ? 4 : (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      draw(now);
      raf = visible && !still ? requestAnimationFrame(loop) : 0;
    };
    const resize = () => {
      // Soft gradients don't need full resolution; cap the pixel ratio to keep it cheap.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uR, canvas.width, canvas.height);
      draw(performance.now());
      canvas.dataset.ready = "true";
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !still) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100 ${className ?? ""}`}
    />
  );
}
