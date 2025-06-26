import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Text3D, Center, Environment } from "@react-three/drei";
import { Vector2 } from "three";

const dedcoreText = `DEDCORE`;

function Dedcore3DLogo() {
  const mesh = useRef<any>(null);
  const { mouse, size } = useThree();

  // Animate rotation based on mouse position
  useFrame(() => {
    if (mesh.current) {
      // Normalize mouse to [-1, 1]
      const x = (mouse.x || 0);
      const y = (mouse.y || 0);
      mesh.current.rotation.y = x * 0.7;
      mesh.current.rotation.x = -y * 0.5;
    }
  });

  return (
    <Center>
      <Text3D
        ref={mesh}
        font={"/fonts/Roboto_Regular.json"}
        size={2.2}
        height={0.5}
        curveSegments={8}
        bevelEnabled
        bevelThickness={0.1}
        bevelSize={0.07}
        bevelOffset={0}
        bevelSegments={5}
      >
        {dedcoreText}
        <meshPhysicalMaterial color="#00eaff" roughness={0.2} metalness={0.7} clearcoat={1} emissive="#00eaff" emissiveIntensity={0.25} />
      </Text3D>
    </Center>
  );
}

export default function ThreeDedcore() {
  return (
    <div className="w-full h-[300px] md:h-[400px] lg:h-[500px]">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 12], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} />
        <Dedcore3DLogo />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
} 