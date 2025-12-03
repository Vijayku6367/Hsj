import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function ARRobot({ position }: any) {
  const { scene } = useGLTF("/robot.glb");
  const ref = useRef<any>();

  // Floating animation
  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = Math.sin(Date.now() * 0.002) * 0.05 + position[1];
      ref.current.rotation.y += 0.006;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={0.35}
      position={position}
    />
  );
}

function ARButton({ onStart }: any) {
  return (
    <button className="ar-btn" onClick={onStart}>
      🚀 Start AR Mode
      <style jsx>{`
        .ar-btn {
          padding: 16px 28px;
          font-size: 20px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(130deg, #5e4bff, #9d5cff);
          color: white;
          font-weight: 700;
          cursor: pointer;
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 15;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
      `}</style>
    </button>
  );
}

export default function ARPage() {
  const [sessionActive, setSessionActive] = useState(false);
  const [hitPos, setHitPos] = useState<any>(null);

  const startAR = async () => {
    // Request AR session
    const session = await (navigator as any).xr.requestSession("immersive-ar", {
      requiredFeatures: ["hit-test", "local-floor"]
    });

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType("local-floor");
    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    let robot: any = null;
    const loader = new THREE.GLTFLoader();
    loader.load("/robot.glb", (gltf: any) => {
      robot = gltf.scene;
      robot.scale.set(0.35, 0.35, 0.35);
    });

    const reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: "#00d4ff" })
    );
    reticle.visible = false;
    scene.add(reticle);

    const refSpace = await session.requestReferenceSpace("viewer");
    const hitTestSource = await session.requestHitTestSource({ space: refSpace });

    session.addEventListener("select", () => {
      if (reticle.visible && robot) {
        robot.position.copy(reticle.position);
        scene.add(robot);
      }
    });

    renderer.setAnimationLoop((t: any, frame: any) => {
      if (frame) {
        const viewerPose = frame.getViewerPose(renderer.xr.getReferenceSpace());
        if (viewerPose) {
          const hitTestResults = frame.getHitTestResults(hitTestSource);
          if (hitTestResults.length) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(renderer.xr.getReferenceSpace());
            reticle.visible = true;
            reticle.position.set(
              pose.transform.position.x,
              pose.transform.position.y,
              pose.transform.position.z
            );
          } else {
            reticle.visible = false;
          }
        }
      }

      renderer.render(scene, camera);
    });

    renderer.xr.setSession(session);
    setSessionActive(true);
  };

  return (
    <div className="ar-page">
      {!sessionActive && <ARButton onStart={startAR} />}

      <h1 className="ar-title">AR Mode</h1>
      <p className="ar-sub">Place your robot in the real world</p>

      <style jsx>{`
        .ar-page {
          height: 100vh;
          width: 100%;
          background: #000;
          overflow: hidden;
        }

        .ar-title {
          position: absolute;
          top: 90px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          font-size: 32px;
          font-weight: 800;
          z-index: 10;
        }

        .ar-sub {
          position: absolute;
          top: 135px;
          left: 50%;
          transform: translateX(-50%);
          color: #ddd;
          font-size: 18px;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
