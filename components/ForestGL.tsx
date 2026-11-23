"use client";

import { useEffect, useRef } from "react";

/**
 * Фон-ліс у WebGL: об'єм через карту глибини (паралакс від курсора + легке «дихання»)
 * і м'які об'ємні промені світла, що проходять крізь туман між ялинами.
 * Якщо WebGL недоступний — лишається звичайне зображення-фолбек.
 */
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform sampler2D uDepth;
uniform vec2 uRes;
uniform vec2 uImg;
uniform vec2 uMouse;
uniform float uTime;
uniform float uMotion;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
             mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
}
vec2 coverUV(vec2 frag){
  float s = max(uRes.x / uImg.x, uRes.y / uImg.y);
  vec2 scale = uRes / (uImg * s);
  vec2 uv = (frag - 0.5) * scale + 0.5;
  uv = (uv - 0.5) / 1.09 + 0.5;
  return vec2(uv.x, 1.0 - uv.y);
}
float lum(vec3 c){ return dot(c, vec3(.299, .587, .114)); }

void main(){
  vec2 frag = gl_FragCoord.xy / uRes;
  vec2 uv = coverUV(frag);

  // паралакс по глибині: ближні ялини зміщуються сильніше, туман — майже стоїть
  vec2 sway = vec2(sin(uTime * 0.13) * 0.0045, cos(uTime * 0.10) * 0.003) * uMotion;
  vec2 off = uMouse * vec2(0.020, 0.013) + sway;
  float d = texture2D(uDepth, uv).r;
  vec2 uv2 = uv + off * (d - 0.4);
  d = texture2D(uDepth, uv2).r;
  uv2 = uv + off * (d - 0.4);
  vec3 col = texture2D(uTex, uv2).rgb;

  // джерело світла: над кадром, трохи правіше центру (не з кута)
  vec2 L = vec2(0.60 + 0.05 * sin(uTime * 0.07) * uMotion, 1.20);
  float aspect = uRes.x / uRes.y;
  vec2 toL = L - frag;
  float dist = length(vec2(toL.x * aspect, toL.y));

  // промені: вибірка уздовж променя до джерела; світло пробивається там, де туман яскравий
  float acc = 0.;
  float w = 1.;
  for (int i = 0; i < 36; i++){
    float s = float(i) / 36.;
    vec2 q = mix(frag, L, s * 0.9);
    float l = lum(texture2D(uTex, clamp(coverUV(q), 0., 1.)).rgb);
    acc += smoothstep(0.32, 0.92, l) * w;
    w *= 0.955;
  }
  acc /= 9.;

  float ang = atan(-toL.y, -toL.x * aspect);
  float shafts = 0.55 + 0.75 * noise(vec2(ang * 11. + uTime * 0.05 * uMotion, 3.7))
                      + 0.35 * noise(vec2(ang * 27. - uTime * 0.03 * uMotion, 9.1));
  float flick = 0.84 + 0.12 * sin(uTime * 0.31) + 0.06 * sin(uTime * 0.83 + 1.3) + 0.05 * sin(uTime * 1.7 + 4.0);
  flick = mix(1.0, flick, uMotion);
  float fall = smoothstep(1.7, 0.15, dist);
  float rays = acc * shafts * flick * fall * (1.0 - 0.35 * d);

  // контрове підсвічування країв ялин з боку світла — відчуття об'єму
  vec2 dirL = normalize(vec2(toL.x * aspect, toL.y));
  vec2 stepv = dirL * 4.5 / uRes;
  float lHere = lum(col);
  float lN = lum(texture2D(uTex, clamp(coverUV(frag + vec2(stepv.x, stepv.y)), 0., 1.)).rgb);
  float rim = clamp((lN - lHere) * 1.6 - 0.02, 0., 1.) * (1. - smoothstep(0.0, 0.45, lHere));

  float glow = exp(-dist * 2.4) * 0.22;
  vec3 warm = vec3(1.0, 0.92, 0.70);
  col *= 0.86;
  col += warm * (rays * 0.85 + rim * 1.3 * flick + glow * flick);
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

function loadTex(gl: WebGLRenderingContext, unit: number, src: string) {
  return new Promise<{ w: number; h: number }>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = src;
  });
}

export default function ForestGL() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const hero = canvas?.closest<HTMLElement>(".hero");
    if (!canvas || !hero) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false }) as WebGLRenderingContext | null;
    if (!gl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("uRes"), uImg = U("uImg"), uMouse = U("uMouse"), uTime = U("uTime"), uMotion = U("uMotion");
    gl.uniform1i(U("uTex"), 0);
    gl.uniform1i(U("uDepth"), 1);
    gl.uniform1f(uMotion, reduce ? 0 : 1);

    let raf = 0, alive = true, ready = false;
    let tx = 0, ty = 0, mx = 0, my = 0;

    const resize = () => {
      const r = hero.getBoundingClientRect();
      const k = Math.min(window.devicePixelRatio || 1, 1.5) * 0.7;
      canvas.width = Math.max(2, Math.round(r.width * k));
      canvas.height = Math.max(2, Math.round(r.height * k));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(hero);
    resize();

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => { tx = 0; ty = 0; };
    if (!reduce) {
      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
    }

    const t0 = performance.now();
    const frame = () => {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      if (document.hidden || !ready) return;
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uTime, reduce ? 0 : (performance.now() - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    Promise.all([loadTex(gl, 0, "/images/hero-forest.jpg"), loadTex(gl, 1, "/images/forest-depth.png")])
      .then(([img]) => {
        gl.uniform2f(uImg, img.w, img.h);
        ready = true;
        hero.classList.add("gl-ready");
      })
      .catch(() => {});
    raf = requestAnimationFrame(frame);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.classList.remove("gl-ready");
    };
  }, []);

  return <canvas ref={ref} className="forest-gl" aria-hidden />;
}
