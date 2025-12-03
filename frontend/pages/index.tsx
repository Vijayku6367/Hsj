import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import Link from "next/link";

function HeroRobot() {
  const { scene } = useGLTF("/robot.glb");
  const ref = useRef<any>();
  const t = useRef(0);

  // Smooth floating animation using useFrame (best practice)
  useFrame((_, delta) => {
    t.current += delta;
    if (ref.current) {
      ref.current.position.y = -1.6 + Math.sin(t.current * 1.6) * 0.18;
      ref.current.rotation.y += 0.003;
    }
  });

  return (
    <primitive
      object={scene}
      ref={ref}
      scale={0.75}                    // PERFECT SIZE
      position={[0, -1.6, 0]}         // MOVE ROBOT DOWN
      rotation={[0, Math.PI / 3, 0]}  // NICE ANGLE
    />
  );
}

export default function Home() {

  // Background parallax
  useEffect(() => {
    const handle = (e: any) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      document.documentElement.style.setProperty('--px', `${x}px`);
      document.documentElement.style.setProperty('--py', `${y}px`);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <div className="landing">

      {/* Background Layers */}
      <div className="bg-planets"></div>
      <div className="bg-stars"></div>

      {/* HEADER */}
      <header className="header">
        <div className="logo">🤖 Cretista AI</div>
        <nav className="nav">
          <Link href="/">Home</Link>
          <Link href="/simulator">Simulator</Link>
          <Link href="/builder">Builder</Link>
          <Link href="/about">About</Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="hero fade-in">
        <div className="hero-text">
          <h1>Your brand, built awesome.</h1>
          <p>Dive into mesmerizing 3D wonders where creativity knows no limits.</p>

          <Link href="/simulator">
            <button className="cta">Launch Simulator →</button>
          </Link>
        </div>

        {/* 3D ROBOT BOX */}
        <div className="robot-box floating">
          <Canvas 
            camera={{ position: [0, 1.7, 4.5], fov: 42 }}  // FIXED CAMERA
          >
            <ambientLight intensity={1.4} />
            <directionalLight position={[5, 10, 5]} intensity={1.3} />
            <HeroRobot />
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>
      </section>
    </div>
  );
}
