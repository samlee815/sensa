"use client";
import { MutableRefObject, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SIMPLEX } from "@/lib/glsl";

/**
 * A terrain of EEG-like traces rendered as points. `progress` sweeps a
 * coherence front from left to right: noisy, spiking signal on one side,
 * calm phase-aligned waves on the other.
 */
const ROWS = 56;
const COLS = 300;

const vertex = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uPx;
uniform vec2 uSize;
attribute float aRow;
attribute float aRnd;
varying float vAlpha;
varying float vK;
varying float vRow;
${SIMPLEX}

void main(){
  float x = position.x;          // -1..1
  float r = aRow;                // 0 (front) .. 1 (back)
  float t = uTime;

  float front = mix(-1.5, 1.6, uProgress);
  float k = 1.0 - smoothstep(front - 0.45, front + 0.45, x + (r - 0.5) * 0.25);

  float env = smoothstep(-1.0, -0.55, x) * (1.0 - smoothstep(0.55, 1.0, x));

  float chaos = snoise(vec3(x * 2.6, r * 5.0, t * 0.35)) * 0.5
              + snoise(vec3(x * 9.0, r * 8.0, t * 0.9)) * 0.22
              + snoise(vec3(x * 26.0, r * 3.0, t * 2.0)) * 0.07;
  float spike = pow(max(snoise(vec3(x * 1.7, r * 11.0, t * 0.45)), 0.0), 5.0) * 2.8;
  chaos += spike;

  float calm = sin(x * 6.28318 * 1.15 - t * 1.1 + r * 1.2) * 0.3
             * (0.75 + 0.25 * sin(r * 6.28318 + t * 0.3));

  float y = mix(chaos, calm, k) * env;

  vec3 pos = vec3(x * uSize.x, y * uSize.y, (r - 0.5) * 7.0);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uPx * (1.1 + aRnd * 1.1 + k * 0.6) * (5.5 / -mv.z);

  float depthFade = 1.0 - r * 0.82;
  vAlpha = depthFade * (0.4 + 0.6 * env) * mix(0.85, 1.0, k);
  vK = k;
  vRow = r;
}
`;

const fragment = /* glsl */ `
uniform vec3 uHot;
uniform vec3 uCool;
varying float vAlpha;
varying float vK;
varying float vRow;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.05, 0.5, d));
  vec3 c = mix(uHot, uCool, vK);
  c = mix(c, vec3(0.94, 0.92, 0.88), 0.35 * (1.0 - vRow));
  gl_FragColor = vec4(c, a * vAlpha);
}
`;

function Field({ progress }: { progress: MutableRefObject<number> }) {
  const { viewport, size, camera } = useThree();
  const smooth = useRef(0);
  const geo = useMemo(() => {
    const n = ROWS * COLS;
    const pos = new Float32Array(n * 3);
    const row = new Float32Array(n);
    const rnd = new Float32Array(n);
    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        pos[i * 3] = (c / (COLS - 1)) * 2 - 1;
        row[i] = r / (ROWS - 1);
        rnd[i] = Math.random();
        i++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aRow", new THREE.BufferAttribute(row, 1));
    g.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 1));
    return g;
  }, []);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uPx: { value: 1 },
          uSize: { value: new THREE.Vector2(6, 0.8) },
          uHot: { value: new THREE.Color("#e8a48c") },
          uCool: { value: new THREE.Color("#9db4bf") },
        },
      }),
    []
  );

  useFrame((s) => {
    smooth.current += (progress.current - smooth.current) * 0.08;
    mat.uniforms.uTime.value = s.clock.elapsedTime;
    mat.uniforms.uProgress.value = smooth.current;
    mat.uniforms.uPx.value = s.gl.getPixelRatio() * (size.width < 860 ? 1.6 : 2.2);
    mat.uniforms.uSize.value.set(Math.max(viewport.width * 0.62, 5.2), size.width < 860 ? 0.9 : 1.05);
    camera.position.x = Math.sin(s.clock.elapsedTime * 0.08) * 0.4;
    camera.lookAt(0, -0.2, -1);
  });

  return <points geometry={geo} material={mat} />;
}

export default function SignalField({ progress, active }: { progress: MutableRefObject<number>; active: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 38, position: [0, 2.3, 5.6], near: 0.1, far: 60 }}
      frameloop={active ? "always" : "never"}
      style={{ position: "absolute", inset: 0 }}
    >
      <Field progress={progress} />
    </Canvas>
  );
}
