"use client";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SIMPLEX } from "@/lib/glsl";

export type ChromeDrive = {
  progress: number; // 0 → 1 as the hero scrolls away
  intro: number; // 0 → 1 once the page is revealed
};

const vertex = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uCalm;
uniform vec2  uMouse;
uniform mat3  uNormalWorld;
varying vec3 vN;
varying vec3 vPos;
varying float vD;
${SIMPLEX}

float field(vec3 p){
  float t = uTime * 0.2;
  vec3 q = p * uFreq;
  vec3 w = vec3(
    snoise(q + vec3(0.0, t, 0.0)),
    snoise(q + vec3(5.2, 1.3, t)),
    snoise(q + vec3(t, 2.1, 7.7))
  );
  float n = snoise(q + w * 0.35 + vec3(0.0, t * 0.7, t * 0.4));
  float fine = snoise(q * 2.4 + vec3(t * 1.4)) * 0.045 * (1.0 - uCalm);
  vec3 m = normalize(vec3(uMouse * 1.5, 1.0));
  float md = smoothstep(0.6, 1.0, dot(p, m));
  return (n + fine) * uAmp + md * 0.14 * (1.0 - uCalm * 0.6);
}

vec3 displaced(vec3 p){ return p * (1.0 + field(p)); }

void main(){
  vec3 p = normalize(position);
  vec3 up = abs(p.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 tangent = normalize(cross(p, up));
  vec3 bitan = normalize(cross(p, tangent));
  float e = 0.005;
  vec3 a = displaced(p);
  vec3 b = displaced(normalize(p + tangent * e));
  vec3 c = displaced(normalize(p + bitan * e));
  vec3 nrm = normalize(cross(b - a, c - a));
  if (dot(nrm, p) < 0.0) nrm = -nrm;
  vD = field(p);
  vec4 wp = modelMatrix * vec4(a, 1.0);
  vPos = wp.xyz;
  vN = normalize(uNormalWorld * nrm);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const fragment = /* glsl */ `
uniform float uTime;
uniform vec3 uTint;
uniform vec3 uWarm;
uniform float uCalm;
uniform float uIntro;
varying vec3 vN;
varying vec3 vPos;
varying float vD;

vec3 env(vec3 r){
  float y = r.y;
  float ang = atan(r.x, r.z);
  vec3 col = mix(vec3(0.012, 0.012, 0.016), vec3(0.075, 0.075, 0.085), smoothstep(-0.6, 0.8, y));
  // key light behind the camera, upper left — the main sculpting highlight
  col += vec3(1.0, 0.975, 0.945) * pow(max(dot(r, normalize(vec3(-0.55, 0.6, 0.85))), 0.0), 7.0) * 2.4;
  // broad soft fill from the front
  col += vec3(0.42, 0.44, 0.47) * pow(max(dot(r, normalize(vec3(0.35, 0.1, 1.0))), 0.0), 2.5) * 0.7;
  // crisp vertical bar light behind camera, right
  col += vec3(1.0) * (1.0 - smoothstep(0.0, 0.05, abs(r.x - 0.42))) * smoothstep(-0.1, 0.7, r.y) * step(0.0, r.z) * 1.6;
  // overhead softbox
  col += vec3(1.0, 0.985, 0.965) * smoothstep(0.6, 0.97, y) * 1.7;
  // right strip light, slowly drifting
  float a1 = 1.05 + sin(uTime * 0.13) * 0.18;
  col += vec3(0.96, 0.975, 1.0) * (1.0 - smoothstep(0.0, 0.1, abs(ang - a1))) * smoothstep(-0.45, 0.55, y) * 1.9;
  // left strip light, state-tinted
  col += uTint * (1.0 - smoothstep(0.0, 0.16, abs(ang + 1.3))) * smoothstep(-0.6, 0.65, y) * 1.5;
  // back warm rim
  col += uWarm * (1.0 - smoothstep(0.0, 0.5, abs(abs(ang) - 3.14159))) * 0.9;
  // floor bounce
  col += vec3(0.32, 0.26, 0.21) * (1.0 - smoothstep(-0.95, -0.15, y)) * 0.8;
  return col;
}

void main(){
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vPos);
  float nv = max(dot(N, V), 0.0);
  vec3 R = reflect(-V, N);
  vec3 off = vec3(0.022, 0.012, 0.0);
  vec3 c = vec3(
    env(reflect(-V, normalize(N + off))).r,
    env(R).g,
    env(reflect(-V, normalize(N - off))).b
  );
  float fres = pow(1.0 - nv, 3.5);
  vec3 irid = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + fres * 1.4 + vD * 2.2 + uTime * 0.04));
  c = c * vec3(0.94, 0.93, 0.915);
  c += irid * fres * 0.32 * (1.0 - uCalm * 0.55);
  c += uTint * fres * 0.22;
  c = c / (1.0 + c * 0.32);
  c = pow(c, vec3(0.94));
  gl_FragColor = vec4(c * uIntro, 1.0);
}
`;

function Blob({ drive, tint }: { drive: MutableRefObject<ChromeDrive>; tint: string }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const bead = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const mouse = useRef(new THREE.Vector2());
  const target = useRef(new THREE.Vector2());
  const nm = useMemo(() => new THREE.Matrix3(), []);
  const isMobile = size.width < 860;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.3 },
      uFreq: { value: 1.05 },
      uCalm: { value: 0 },
      uIntro: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uNormalWorld: { value: new THREE.Matrix3() },
      uTint: { value: new THREE.Color(tint) },
      uWarm: { value: new THREE.Color("#d8a48f") },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const material = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms }),
    [uniforms]
  );

  useEffect(() => {
    uniforms.uTint.value.set(tint);
  }, [tint, uniforms]);

  useEffect(() => {
    const on = (e: PointerEvent) => {
      target.current.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener("pointermove", on);
    return () => window.removeEventListener("pointermove", on);
  }, []);

  useFrame((state, dt) => {
    const d = drive.current;
    const p = d.progress;
    const t = state.clock.elapsedTime;
    mouse.current.lerp(target.current, 0.045);
    uniforms.uTime.value = t;
    uniforms.uMouse.value.copy(mouse.current);
    uniforms.uCalm.value = p;
    uniforms.uIntro.value = Math.min(1, d.intro * 1.4);
    // restless → calm: amplitude settles as the visitor scrolls
    uniforms.uAmp.value = THREE.MathUtils.lerp(0.21, 0.05, THREE.MathUtils.smoothstep(p, 0, 0.85)) + (1 - d.intro) * 0.12;
    uniforms.uFreq.value = THREE.MathUtils.lerp(0.78, 0.62, p);

    const g = group.current!;
    const baseR = Math.min(viewport.height * 0.25, viewport.width * (isMobile ? 0.26 : 0.17));
    const s = baseR * THREE.MathUtils.lerp(0.55, 1, easeOut(d.intro)) * THREE.MathUtils.lerp(1, 0.78, p);
    g.scale.setScalar(s);
    const x0 = isMobile ? 0 : viewport.width * 0.23;
    const y0 = isMobile ? viewport.height * 0.25 : viewport.height * 0.07;
    g.position.x = THREE.MathUtils.lerp(x0, 0, p) + mouse.current.x * 0.12;
    g.position.y = THREE.MathUtils.lerp(y0, viewport.height * 0.06, p) + mouse.current.y * 0.08;

    const m = mesh.current!;
    m.rotation.y += dt * 0.07;
    m.rotation.x = mouse.current.y * -0.25;
    m.rotation.z = mouse.current.x * 0.12;
    // pebble proportion, relaxing toward a smooth stone as it calms
    m.scale.set(THREE.MathUtils.lerp(1.12, 1.28, p), THREE.MathUtils.lerp(0.98, 0.82, p), 1.0);
    m.updateMatrixWorld();
    nm.getNormalMatrix(m.matrixWorld);
    uniforms.uNormalWorld.value.copy(nm);

    ring1.current!.rotation.set(1.28 + Math.sin(t * 0.2) * 0.05, 0.1, t * 0.05);
    ring2.current!.rotation.set(1.05, -0.35 + Math.sin(t * 0.15) * 0.08, -t * 0.035);
    const ringOpacity = easeOut(d.intro) * (0.35 + p * 0.5);
    (ring1.current!.material as THREE.MeshBasicMaterial).opacity = ringOpacity;
    (ring2.current!.material as THREE.MeshBasicMaterial).opacity = ringOpacity * 0.45;
    const a = t * 0.35;
    const r = 1.62;
    const bp = new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0).applyEuler(ring1.current!.rotation);
    bead.current!.position.copy(bp);
    (bead.current!.material as THREE.MeshBasicMaterial).opacity = ringOpacity * 1.6;
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} material={material}>
        <sphereGeometry args={[1, isMobile ? 140 : 220, isMobile ? 140 : 220]} />
      </mesh>
      <mesh ref={ring1}>
        <torusGeometry args={[1.62, 0.0032, 8, 320]} />
        <meshBasicMaterial color="#f3e7d8" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[1.95, 0.0022, 8, 320]} />
        <meshBasicMaterial color="#c9d4da" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={bead}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} />
      </mesh>
      <Dust />
    </group>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 380;
    const pos = new Float32Array(n * 3);
    const rnd = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const r = 1.5 + Math.random() * 2.6;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      pos[i * 3 + 2] = r * Math.cos(ph);
      rnd[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 1));
    return g;
  }, []);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uPx: { value: 1 } },
        vertexShader: /* glsl */ `
          uniform float uTime; uniform float uPx; attribute float aRnd; varying float vA;
          void main(){
            vec3 p = position;
            p.y += sin(uTime * 0.3 + aRnd * 20.0) * 0.08;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (1.2 + aRnd * 2.2) * uPx;
            vA = 0.25 + 0.75 * (0.5 + 0.5 * sin(uTime * (0.6 + aRnd) + aRnd * 40.0));
          }`,
        fragmentShader: /* glsl */ `
          varying float vA;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            gl_FragColor = vec4(vec3(0.95, 0.92, 0.88), (1.0 - smoothstep(0.0, 0.5, d)) * vA * 0.55);
          }`,
      }),
    []
  );
  useFrame((s, dt) => {
    mat.uniforms.uTime.value = s.clock.elapsedTime;
    mat.uniforms.uPx.value = s.gl.getPixelRatio();
    if (ref.current) ref.current.rotation.y += dt * 0.015;
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);

export default function LiquidChrome({
  drive,
  active,
  tint = "#9db4bf",
}: {
  drive: MutableRefObject<ChromeDrive>;
  active: boolean;
  tint?: string;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 30, position: [0, 0, 8], near: 0.1, far: 50 }}
      frameloop={active ? "always" : "never"}
      style={{ position: "absolute", inset: 0 }}
    >
      <Blob drive={drive} tint={tint} />
    </Canvas>
  );
}
