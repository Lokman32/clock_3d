/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import "./App.css";
import { useRef } from "react";

function BasicRing({ scale, speed = 0 }) {
  const ringRef = useRef();

  useFrame(() => {
    ringRef.current.rotation.y += speed;
  });

  return (
    <mesh ref={ringRef} scale={scale}>
      <torusGeometry args={[1, 0.05, 100, 100]} />
      <meshStandardMaterial color="gold" side={2} />
    </mesh>
  );
}

function ClockWise({ color, position, scale, speed }) {
  const wise = useRef();

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime() / 60 ** speed;
    wise.current.rotation.z = -elapsedTime * 2 * Math.PI;
  });

  return (
    <group ref={wise}>
      <mesh position={position} scale={scale}>
        <boxGeometry args={[0.1, 0.8, 0.01]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50, far:.01, away:1000 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} />

      <group /* rotation-y={Math.PI * 0.15} */>
        <BasicRing scale={1.575} speed={-0.01} />
        <BasicRing scale={1.4} speed={0.01} />
        <BasicRing scale={1} />
        <ClockWise scale={1} speed={1} color="red" position={[0, 0.4, 0]} />
        <ClockWise
          scale={0.9}
          speed={2}
          color="green"
          position={[0, 0.36, 0.01]}
        />
        <ClockWise
          scale={0.7}
          speed={3}
          color="blue"
          position={[0, 0.28, 0.02]}
        />
      </group>

      <OrbitControls />
      {/* <axesHelper /> */}
    </Canvas>
  );
}
