import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";

function AboutRobot() {
  const { scene } = useGLTF("/robot.glb");
  const ref = useRef<any>();

  useEffect(() => {
    let t = 0;
    const animate = () => {
      t += 0.01;
      if (ref.current) {
        ref.current.rotation.y += 0.004;
        ref.current.position.y = Math.sin(t) * 0.12 - 1;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return <primitive object={scene} ref={ref} scale={0.7} position={[0, -1, 0]} />;
}

export default function About() {
  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero fadeIn">
        <h1 className="title">About OpenMind Robotics</h1>
        <p className="subtitle">
          Crafting next-generation AI robots that think, adapt, and collaborate.
        </p>
      </section>

      {/* 3D ROBOT SHOWCASE */}
      <div className="about-3d fadeIn">
        <Canvas camera={{ position: [3, 2, 5] }}>
          <ambientLight intensity={1.4} />
          <directionalLight position={[5, 10, 5]} />
          <AboutRobot />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* TIMELINE */}
      <section className="timeline fadeIn">
        <h2 className="section-title">Our Journey</h2>

        <div className="timeline-item">
          <div className="dot"></div>
          <div>
            <h3>2023 — Concept Born</h3>
            <p>We began crafting the first reusable AI robot brain.</p>
          </div>
        </div>

        <div className="timeline-item">
          <div className="dot"></div>
          <div>
            <h3>2024 — OpenMind Beta Launched</h3>
            <p>Robots started learning and talking to each other.</p>
          </div>
        </div>

        <div className="timeline-item">
          <div className="dot"></div>
          <div>
            <h3>2025 — Full Automation</h3>
            <p>We built a unified multi-robot coordination system.</p>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="mission fadeIn">
        <h2 className="section-title">Our Mission</h2>
        <p>
          Our goal is simple: create AI-driven robots that fully understand the
          world — and each other.
        </p>
      </section>

      {/* LOCAL CSS */}
      <style jsx>{`
        .about-page {
          padding: 40px;
          font-family: 'Inter';
        }

        .about-hero {
          text-align: center;
          margin-bottom: 40px;
        }

        .title {
          font-size: 52px;
          font-weight: 900;
        }

        .subtitle {
          font-size: 22px;
          opacity: 0.7;
        }

        .about-3d {
          width: 60%;
          height: 450px;
          margin: 40px auto;
          background: rgba(255,255,255,0.45);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }

        .section-title {
          font-size: 34px;
          margin-bottom: 20px;
          font-weight: 800;
        }

        .timeline {
          width: 70%;
          margin: auto;
          padding: 20px;
        }

        .timeline-item {
          display: flex;
          align-items: center;
          gap: 18px;
          margin: 20px 0;
        }

        .dot {
          width: 18px;
          height: 18px;
          background: #6d38ff;
          border-radius: 50%;
        }

        .mission {
          text-align: center;
          padding: 40px;
        }

        .fadeIn {
          animation: fadeIn 1.3s ease forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
