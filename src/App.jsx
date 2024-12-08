/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, forwardRef } from "react";
import "./App.css";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";

function Particles() {
  const pointsRef = useRef();
  const pr = useRef();
  const particlesCount = 500;
  const starTexture = useLoader(TextureLoader, "./model/star.png");

  // Generate random particle positions
  const positions = new Float32Array(particlesCount * 3); // x, y, z for each particle
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 5; // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5; // z
  }

  // Animate the particles
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const size = .05 + Math.sin(time * 5) * .05; // Adjust the frequency and amplitude
    if (pr.current) {
      pr.current.size = size;
    }
    pointsRef.current.rotation.y += 0.005;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={starTexture}
        ref={pr}
        transparent={true}
        alphaTest={0.5} // Removes unwanted edges
        sizeAttenuation={true} // Perspective size adjustment
        color="white"
      />
    </points>
  );
}

function BasicRing({ scale, speed = 0, arc = Math.PI * 2 }) {
  const ringRef = useRef();

  useFrame(() => {
    ringRef.current.rotation.y += speed;
    ringRef.current.rotation.z = arc * 0.5;
  });

  return (
    <mesh ref={ringRef} scale={scale} castShadow receiveShadow>
      <torusGeometry args={[1.5, 0.05, 80, 80, arc]} />
      <meshStandardMaterial color="gold" side={2} flatShading />
    </mesh>
  );
}

const ClockWise = forwardRef(({ color, position, scale }, ref) => (
  <group ref={ref}>
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <boxGeometry args={[0.1, 1.5, 0.01]} />
      <meshPhongMaterial color={color} shininess={100} />
    </mesh>
  </group>
));

function ClockWises() {
  const hour = useRef();
  const min = useRef();
  const sec = useRef();

  useFrame(() => {
    const now = new Date();
    const hours = now.getHours() % 12;
    const mins = now.getMinutes();
    const secs = now.getSeconds();

    if (hour.current) {
      hour.current.rotation.z = -((hours * 60 + mins) / 720) * 2 * Math.PI;
    }
    if (min.current) {
      min.current.rotation.z = -((mins + secs / 60) / 60) * 2 * Math.PI;
    }
    if (sec.current) {
      sec.current.rotation.z = -(secs / 60) * 2 * Math.PI;
    }
  });

  return (
    <>
      <ClockWise
        ref={hour}
        scale={0.7}
        color="blue"
        position={[0, 0.28, 0.02]}
      />
      <ClockWise
        ref={min}
        scale={0.9}
        color="green"
        position={[0, 0.36, 0.01]}
      />
      <ClockWise ref={sec} scale={1} color="red" position={[0, 0.4, 0]} />
    </>
  );
}

export default function App() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas shadows camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 5, 5]} intensity={1} castShadow />

        <group>
          <BasicRing scale={1.1} speed={-0.01} arc={Math.PI} />
          <BasicRing scale={1.1} speed={0.03} arc={-Math.PI} />
          <BasicRing scale={1} />
          <ClockWises />
        </group>
        <OrbitControls />
        {/* <axesHelper /> */}
        <Particles />
      </Canvas>
    </div>
  );
}
