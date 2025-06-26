"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Suspense, useRef } from "react"
import type { Mesh } from "three"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Download from "@/components/download"
import Footer from "@/components/footer"

function TerminalCube({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null)

  return (
    <mesh ref={meshRef} position={position} rotation={[0.5, 0.5, 0]}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshBasicMaterial color="#00ff00" wireframe />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <TerminalCube position={[-3, 2, -2]} />
      <TerminalCube position={[3, -1, -3]} />
      <TerminalCube position={[0, 1, -4]} />
      <Environment preset="night" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
    </>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Simple terminal grid pattern */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Simple Three.js Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Download />
        <Footer />
      </div>
    </div>
  )
}
