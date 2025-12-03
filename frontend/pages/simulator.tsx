import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import io from "socket.io-client";
import Link from "next/link";

function RobotModel({ rotation, position }: any) {
  const { scene } = useGLTF("/robot.glb");
  const ref = useRef<any>();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = rotation;
      ref.current.position.y = -1.6;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={0.8}
      position={[0, -1.6, 0]}
    />
  );
}

export default function Simulator() {
  const [socket, setSocket] = useState<any>(null);
  const [connected, setConnected] = useState(false);

  const [battery, setBattery] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const s = io("http://localhost:3001", {
      transports: ["websocket"],
    });

    setSocket(s);       

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));

    s.on("telemetry", (data: any) => {
      setBattery(data.battery || 0);
      setRotation((data.rotation || 0) * (Math.PI / 180)); // convert deg → rad
      setPos({ x: data.x || 0, y: data.y || 0 });
    });

    return () => s.disconnect();
  }, []);

  const sendCommand = (cmd: string) => {
    if (socket) socket.emit("command", cmd);
  };

  return (
    <div className="simulator">

      {/* HEADER */}
      <header className="sim-header">
        <h1>🤖 OpenMind<br />Advanced Simulator</h1>
        <span className="status">
          <span className="dot"></span>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </header>

      {/* CONTROL + 3D */}
      <div className="sim-content">

        {/* CONTROL PANEL */}
        <div className="control-panel">

          <button className="btn" onClick={() => sendCommand("forward")}>
            ↑<br />Forward
          </button>

          <div className="mid-row">
            <button className="btn" onClick={() => sendCommand("left")}>
              ←<br />Left
            </button>

            <button className="btn stop-btn" onClick={() => sendCommand("stop")}>
              ⬛<br />Stop
            </button>

            <button className="btn" onClick={() => sendCommand("right")}>
              →<br />Right
            </button>
          </div>

          <button className="btn" onClick={() => sendCommand("backward")}>
            ↓<br />Backward
          </button>

          {/* STATUS BOX */}
          <div className="hud">
            <p><b>Battery:</b> {battery.toFixed(1)}%</p>
            <p><b>Rotation:</b> {(rotation * 57.2958).toFixed(0)}°</p>
            <p><b>Position:</b><br />
              X: {pos.x} &nbsp;•&nbsp; Y: {pos.y}
            </p>
          </div>
        </div>

        {/* 3D ROBOT VIEW */}
        <div className="sim-3d">
          <Canvas camera={{ position: [0, 1.6, 4.3], fov: 42 }}>
            <ambientLight intensity={1.4} />
            <directionalLight position={[4, 8, 5]} intensity={1.2} />
            <RobotModel rotation={rotation} position={pos} />
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>
      </div>

      <style jsx>{`
        .simulator { padding: 40px; }

        .sim-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }

        .status {
          display: flex;
          align-items: center;
          font-size: 20px;
          font-weight: 600;
          color: #00ff90;
        }

        .dot {
          width: 12px;
          height: 12px;
          background: #00ff90;
          border-radius: 50%;
          margin-right: 8px;
        }

        .sim-content {
          display: flex;
          gap: 28px;
        }

        .control-panel {
          width: 25%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn {
          background: #1c1c1c;
          color: white;
          border: none;
          padding: 18px;
          border-radius: 18px;
          font-size: 20px;
          font-weight: 600;
          cursor: pointer;
        }

        .stop-btn {
          background: #ff3b3b !important;
        }

        .mid-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .hud {
          margin-top: 20px;
          padding: 16px;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          font-size: 18px;
        }

        .sim-3d {
          width: 75%;
          height: 520px;
          border-radius: 20px;
          background: rgba(255,255,255,0.55);
          overflow: hidden;
        }

        @media (max-width: 900px) {
          .sim-content { flex-direction: column; }
          .control-panel, .sim-3d { width: 100%; }
          .sim-3d { height: 420px; }
        }
      `}</style>
    </div>
  );
}
