"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import * as THREE from "three";

const PLANET_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vLocalPos = position;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const PLANET_FRAGMENT = /* glsl */ `
  precision highp float;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;

  uniform float uTime;
  uniform vec3 uSunDir;
  uniform vec3 uFlare;

  // Hash + value noise — procedural, no textures.
  float hash(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.07;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 sn = normalize(vLocalPos);

    // Continent mask: low-freq fbm with a threshold.
    float continents = fbm(sn * 2.4);
    float land = smoothstep(0.48, 0.55, continents);

    // Detail terrain on land.
    float detail = fbm(sn * 8.0 + 13.0);
    vec3 oceanColor = vec3(0.012, 0.018, 0.030);
    vec3 landColor  = mix(vec3(0.045, 0.052, 0.070), vec3(0.075, 0.082, 0.100), detail);
    vec3 surface = mix(oceanColor, landColor, land);

    // Insolation — angle from sun, biased toward equator.
    float sunDot = clamp(dot(n, normalize(uSunDir)), -1.0, 1.0);
    float dayMask = smoothstep(-0.15, 0.6, sunDot);

    // Latitude band: brightest where |y| is small.
    float lat = 1.0 - abs(sn.y);
    float insolation = pow(lat, 2.2) * dayMask;

    // Heat signatures: hot spots only on land, modulated by insolation.
    float hotspots = smoothstep(0.62, 0.92, fbm(sn * 14.0 - uTime * 0.02));
    float flareMask = land * insolation * hotspots;

    vec3 flareCol = uFlare * flareMask * 2.4;

    // Subtle terminator glow on dark side.
    float terminator = smoothstep(0.0, 0.25, 1.0 - abs(sunDot)) * (1.0 - dayMask);
    vec3 nightGlow = uFlare * 0.12 * terminator * land;

    // Rim — fresnel against view vector approximation.
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
    vec3 rim = uFlare * fresnel * 0.18;

    vec3 col = surface * (0.25 + 0.55 * dayMask) + flareCol + nightGlow + rim;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Planet() {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunDir: { value: new THREE.Vector3(1.2, 0.4, 0.6).normalize() },
      uFlare: { value: new THREE.Color("#FFB23F") },
    }),
    [],
  );

  useFrame((_, dt) => {
    if (ref.current) {
      // ~1 rpm = 2*PI / 60 rad/s.
      ref.current.rotation.y += (Math.PI / 30) * dt;
    }
    if (matRef.current) {
      (matRef.current.uniforms.uTime.value as number) += dt;
    }
  });

  return (
    <mesh ref={ref} castShadow={false} receiveShadow={false}>
      <icosahedronGeometry args={[1, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={PLANET_VERTEX}
        fragmentShader={PLANET_FRAGMENT}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <mesh scale={1.035}>
      <icosahedronGeometry args={[1, 32]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        side={THREE.BackSide}
        uniforms={{ uFlare: { value: new THREE.Color("#FFB23F") } }}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          uniform vec3 uFlare;
          void main() {
            float intensity = pow(0.72 - dot(vNormal, vec3(0,0,1)), 3.0);
            gl_FragColor = vec4(uFlare * intensity * 0.35, intensity);
          }
        `}
      />
    </mesh>
  );
}

function SatelliteRing({ count = 9 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const tilt = THREE.MathUtils.degToRad(14);

  useFrame((_, dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.08;
    }
  });

  const positions = useMemo(() => {
    const arr: { angle: number; phase: number }[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({ angle: (i / count) * Math.PI * 2, phase: Math.random() });
    }
    return arr;
  }, [count]);

  return (
    <group ref={groupRef} rotation={[tilt, 0, 0]}>
      {/* Ring guideline. */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.55, 1.555, 128]} />
        <meshBasicMaterial
          color="#FFB23F"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
      {positions.map((p, i) => (
        <Satellite key={i} angle={p.angle} radius={1.55} phase={p.phase} />
      ))}
    </group>
  );
}

function Satellite({
  angle,
  radius,
  phase,
}: {
  angle: number;
  radius: number;
  phase: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.4 + phase * 6.28;
    const a = angle + t * 0.1;
    ref.current.position.set(
      Math.cos(a) * radius,
      Math.sin(a * 0.3) * 0.05,
      Math.sin(a) * radius,
    );
    ref.current.lookAt(0, 0, 0);
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.04, 0.04, 0.06]} />
        <meshStandardMaterial
          color="#A7B0C0"
          metalness={0.7}
          roughness={0.45}
        />
      </mesh>
      {/* Solar panels. */}
      <mesh position={[0.07, 0, 0]}>
        <boxGeometry args={[0.08, 0.005, 0.04]} />
        <meshStandardMaterial
          color="#1B2230"
          emissive="#FFB23F"
          emissiveIntensity={0.4}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[-0.07, 0, 0]}>
        <boxGeometry args={[0.08, 0.005, 0.04]} />
        <meshStandardMaterial
          color="#1B2230"
          emissive="#FFB23F"
          emissiveIntensity={0.4}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>
    </group>
  );
}

function Starfield() {
  const points = useMemo(() => {
    const n = 400;
    const positions = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 8 + Math.random() * 6;
      const t = Math.acos(2 * Math.random() - 1);
      const p = Math.random() * Math.PI * 2;
      positions[i * 3] = r * Math.sin(t) * Math.cos(p);
      positions[i * 3 + 1] = r * Math.sin(t) * Math.sin(p);
      positions[i * 3 + 2] = r * Math.cos(t);
    }
    return positions;
  }, []);

  const geomProps: ThreeElements["bufferGeometry"] = {};

  return (
    <points>
      <bufferGeometry {...geomProps}>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#6B7488"
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
}

function AutoOrbit() {
  useFrame((state) => {
    const cam = state.camera;
    const t = state.clock.elapsedTime * 0.04;
    const r = 3.4;
    cam.position.x = Math.cos(t) * r;
    cam.position.z = Math.sin(t) * r;
    cam.position.y = 0.6;
    cam.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: true,
      }}
      camera={{ position: [3.2, 0.6, 1.5], fov: 38, near: 0.1, far: 100 }}
    >
      <color attach="background" args={["#05070B"]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 2, 3]} intensity={1.1} color="#FFE3B0" />

      <Suspense fallback={null}>
        <Starfield />
        <Planet />
        <Atmosphere />
        <SatelliteRing count={9} />
        <AutoOrbit />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.25}
          autoRotate={false}
          makeDefault
        />
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.65}
            luminanceThreshold={0.32}
            luminanceSmoothing={0.18}
            mipmapBlur
          />
          <Noise opacity={0.04} premultiply />
          <Vignette eskil={false} offset={0.2} darkness={0.85} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
