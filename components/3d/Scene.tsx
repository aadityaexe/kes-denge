"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import * as THREE from "three";

/* ─── Wireframe Code Bracket ─── */
function CodeBracket({ position, rotation, scale = 1, color = "#C9A96E" }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const points: [number, number, number][] = [
    [0.4, 0.8, 0],
    [-0.4, 0, 0],
    [0.4, -0.8, 0],
  ];

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={position} rotation={rotation} scale={scale}>
        <Line points={points} color={color} lineWidth={1.5} transparent opacity={0.5} />
      </group>
    </Float>
  );
}

/* ─── Floating Ring / Orbit ─── */
function OrbitRing({ radius = 2, color = "#D9D9D9", speed = 0.3 }: {
  radius?: number;
  color?: string;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed;
      ref.current.rotation.x += delta * speed * 0.5;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} />
    </mesh>
  );
}

/* ─── Data Node (small floating dot) ─── */
function DataNode({ position, color = "#C9A96E", size = 0.04 }: {
  position: [number, number, number];
  color?: string;
  size?: number;
}) {
  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={1.2}>
      <mesh position={position}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </Float>
  );
}

/* ─── Wireframe Icosahedron (tech polyhedron) ─── */
function WireIcosahedron({ position, scale = 1, color = "#111111" }: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.12;
      ref.current.rotation.x += delta * 0.06;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.3}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.1} />
      </mesh>
    </Float>
  );
}

/* ─── Network Connection Lines ─── */
function ConnectionLines() {
  const nodes: [number, number, number][] = [
    [-2, 1.5, -1],
    [0.5, 2, -2],
    [2.5, 0.5, -1],
    [1, -1.5, -1.5],
    [-1.5, -1, -1],
    [-0.5, 0.5, -0.5],
  ];

  const connections = [[0,5], [5,1], [1,2], [2,3], [3,4], [4,5], [5,2]];

  return (
    <group>
      {connections.map(([a, b], i) => (
        <Line key={i} points={[nodes[a], nodes[b]]} color="#C9A96E" lineWidth={0.5} transparent opacity={0.08} />
      ))}
    </group>
  );
}

/* ─── Main Tech Scene ─── */
function TechScene() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.025;
    }
  });

  return (
    <group ref={group}>
      {/* Central wireframe polyhedron */}
      <WireIcosahedron position={[0, 0, 0]} scale={1.8} color="#111111" />
      
      {/* Orbit rings */}
      <OrbitRing radius={2.8} color="#C9A96E" speed={0.12} />
      <OrbitRing radius={2} color="#D9D9D9" speed={-0.08} />
      
      {/* Code brackets */}
      <CodeBracket position={[-2.5, 1.2, 0]} rotation={[0, 0, 0.2]} scale={0.8} color="#C9A96E" />
      <CodeBracket position={[2.8, -0.8, 0]} rotation={[0, Math.PI, -0.3]} scale={0.7} color="#999999" />
      <CodeBracket position={[1.5, 2, -1]} rotation={[0.3, 0.5, 0]} scale={0.5} color="#C9A96E" />
      
      {/* Network graph */}
      <ConnectionLines />
      
      {/* Floating data nodes */}
      <DataNode position={[-2, 1.5, -1]} color="#C9A96E" size={0.05} />
      <DataNode position={[0.5, 2, -2]} color="#111111" size={0.04} />
      <DataNode position={[2.5, 0.5, -1]} color="#C9A96E" size={0.06} />
      <DataNode position={[1, -1.5, -1.5]} color="#999999" size={0.04} />
      <DataNode position={[-1.5, -1, -1]} color="#C9A96E" size={0.05} />
      <DataNode position={[-0.5, 0.5, -0.5]} color="#111111" size={0.03} />
    </group>
  );
}

/* ─── Exported Canvas ─── */
export function Scene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 40 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <TechScene />
      </Canvas>
    </div>
  );
}
