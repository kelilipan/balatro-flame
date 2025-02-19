import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";
import { Html, Stats } from "@react-three/drei";
import { useSliderBlade, useTweakpane } from "react-tweakpane";
import fragmentShader from "./shaders/fragmentShader.glsl";
import vertexShader from "./shaders/vertexShader.glsl";
// Flame shader material
const UNIFORMS = {
  time: { value: 1 },
  amount: { value: 10 },
  texture_details: { value: [1, 1, 1, 1] },
  image_details: { value: [1, 1] },
  colour_1: { value: [0.996, 0.373, 0.333, 1] },
  colour_2: { value: [1, 1, 1, 1] },
  id: { value: 1.0 },
};

function FlameWithNumber({ position, number, color1, color2, amount = 10 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
      meshRef.current.material.uniforms.amount.value = amount;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={position} rotation-z={Math.PI}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={{
            ...UNIFORMS,
            colour_1: { value: color1 },
            colour_2: { value: color2 },
          }}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Html
        position={[0, -0.31, 0]}
        center
        style={{
          width: "178px",
          maxWidth: "178px",
          pointerEvents: "none",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: "48px",
            fontWeight: "bold",
            background: `rgb(${color1[0] * 255}, ${color1[1] * 255}, ${
              color1[2] * 255
            })`,
            padding: "8px 16px",
            height: "64px",
            borderRadius: "4px",
          }}
        >
          {number}
        </div>
      </Html>
    </>
  );
}

const App = () => {
  const pane = useTweakpane(
    {
      position: { x: 0, y: 0, z: 0 },
    },
    {
      title: "Scene Settings",
    }
  );
  const [amount] = useSliderBlade(pane, {
    label: "Amount",
    value: 10,
    min: 0,
    max: 10,
    step: 0.1,
    format: (value) => value.toFixed(1),
  });
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto",
            gap: "40px",
          }}
        >
          <div style={{ width: "350px", height: "350px" }}>
            <Canvas
              camera={{
                position: [0, 0, 2],
                fov: 45,
              }}
            >
              <FlameWithNumber
                position={[0, 0, 0]}
                number={Math.floor(amount * 1000)}
                color1={[0, 0, 1, 1]}
                color2={[0.5, 0.5, 1, 1]}
                amount={amount}
              />
            </Canvas>
          </div>

          <div style={{ width: "350px", height: "350px" }}>
            <Canvas
              camera={{
                position: [0, 0, 2],
                fov: 45,
              }}
            >
              <FlameWithNumber
                position={[0, 0, 0]}
                number={Math.floor(amount * 1000)}
                color1={[1, 0, 0, 1]}
                color2={[1, 1, 0, 1]}
                amount={amount}
              />
            </Canvas>
          </div>
        </div>
      </div>
      <h1 style={{ position: "absolute", top: 20, left: 20 }}>#AkuBalatro</h1>
      <Stats />
    </div>
  );
};

export default App;
