import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function CustomRobot({ color, eyeColor, glowColor }: any) {
  const { scene } = useGLTF("/robot.glb");
  const ref = useRef<any>();

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color,
          metalness: 0.4,
          roughness: 0.2,
        });
      }
    });
  }, [color]);

  // Eye LEDs
  useEffect(() => {
    const eye = scene.getObjectByName("Eye") || null;
    if (eye) {
      eye.material = new THREE.MeshBasicMaterial({ color: eyeColor, emissive: eyeColor });
    }
  }, [eyeColor]);

  // Glow under robot
  useEffect(() => {
    const glow = scene.getObjectByName("Glow") || null;
    if (glow) {
      glow.material = new THREE.MeshBasicMaterial({
        color: glowColor,
        transparent: true,
        opacity: 0.4,
      });
    }
  }, [glowColor]);

  // Floating animation
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.004;
    }
  });

  return (
    <primitive
      object={scene}
      ref={ref}
      scale={0.8}
      position={[0, -1, 0]}
    />
  );
}

export default function Builder() {
  const [bodyColor, setBodyColor] = useState("#5a4bff");
  const [eyeColor, setEyeColor] = useState("#00eaff");
  const [glowColor, setGlowColor] = useState("#7b47ff");

  const savePreset = () => {
    localStorage.setItem("robotPreset", JSON.stringify({ bodyColor, eyeColor, glowColor }));
    alert("Preset Saved! 🔥");
  };

  return (
    <div className="builder-page">

      {/* HEADER */}
      <header className="builder-header">
        <h2>🤖 Robot Builder</h2>
        <p>Create your personalized OpenMind robot.</p>
      </header>

      <div className="builder-container">

        {/* CONTROLS PANEL */}
        <div className="controls">

          <div className="control-box">
            <label>Body Color</label>
            <input
              type="color"
              value={bodyColor}
              onChange={(e) => setBodyColor(e.target.value)}
            />
          </div>

          <div className="control-box">
            <label>Eye LED Color</label>
            <input
              type="color"
              value={eyeColor}
              onChange={(e) => setEyeColor(e.target.value)}
            />
          </div>

          <div className="control-box">
            <label>Glow Color</label>
            <input
              type="color"
              value={glowColor}
              onChange={(e) => setGlowColor(e.target.value)}
            />
          </div>

          <button className="save-btn" onClick={savePreset}>
            Save Preset
          </button>
        </div>

        {/* 3D VIEW */}
        <div className="builder-3d">
          <Canvas camera={{ position: [3, 2, 5] }}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 9, 5]} intensity={1.4} />
            <CustomRobot
              color={bodyColor}
              eyeColor={eyeColor}
              glowColor={glowColor}
            />
            <OrbitControls enableZoom={true} />
          </Canvas>
        </div>
      </div>

      <style jsx>{`
        .builder-page {
          padding: 40px;
          font-family: 'Inter';
        }

        .builder-header h2 {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .builder-header p {
          opacity: 0.6;
          margin-bottom: 32px;
        }

        .builder-container {
          display: flex;
          justify-content: space-between;
        }

        .controls {
          width: 28%;
          display: flex;
          flex-direction: column;
          gap: 22px;
          padding: 18px;
          background: rgba(255,255,255,0.4);
          backdrop-filter: blur(12px);
          border-radius: 12px;
        }

        .control-box label {
          font-size: 18px;
          font-weight: 700;
        }

        .control-box input {
          width: 100%;
          height: 48px;
          border-radius: 10px;
          border: none;
          margin-top: 6px;
          background: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .save-btn {
          padding: 14px;
          background: linear-gradient(130deg, #5c3bff, #9a5cff);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          cursor: pointer;
          margin-top: 20px;
        }

        .save-btn:hover {
          opacity: 0.9;
        }

        .builder-3d {
          width: 68%;
          height: 520px;
          background: rgba(255,255,255,0.5);
          border-radius: 18px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.13);
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
