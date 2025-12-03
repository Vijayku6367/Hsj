import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function AssistantRobot({ emotion }: any) {
  const { scene } = useGLTF("/robot.glb");
  const ref = useRef<any>();

  useEffect(() => {
    if (!ref.current) return;
    if (emotion === "happy") ref.current.rotation.z = 0.2;
    if (emotion === "sad") ref.current.rotation.z = -0.2;
    if (emotion === "neutral") ref.current.rotation.z = 0;
  }, [emotion]);

  return (
    <primitive object={scene} ref={ref} scale={0.65} position={[0, -1, 0]} />
  );
}

export default function Assistant() {
  const [messages, setMessages] = useState<any>([]);
  const [input, setInput] = useState("");
  const [emotion, setEmotion] = useState("neutral");

  const sendMessage = async () => {
    if (!input) return;

    // Add user message
    setMessages((prev: any) => [...prev, { from: "you", text: input }]);

    const userText = input;
    setInput("");

    // ROBOT THINKING
    setMessages((prev: any) => [...prev, { from: "robot", text: "Typing..." }]);

    // Robot reply simulation (you can connect to OpenAI / custom API)
    setTimeout(() => {
      const reply = "I understand: " + userText;

      // Replace "typing..." with real answer
      setMessages((prev: any) =>
        prev.slice(0, -1).concat({ from: "robot", text: reply })
      );

      // Change robot emotions
      if (userText.includes("hello")) setEmotion("happy");
      else if (userText.includes("sad")) setEmotion("sad");
      else setEmotion("neutral");

      // Make robot speak
      const utt = new SpeechSynthesisUtterance(reply);
      speechSynthesis.speak(utt);
    }, 800);
  };

  return (
    <div className="ai-page">

      {/* HEADER */}
      <header className="ai-header">
        <h2>🤖 AI Assistant</h2>
        <p>Talk with your robot. It listens. It thinks. It reacts.</p>
      </header>

      {/* MAIN CONTENT */}
      <div className="ai-content">

        {/* CHAT WINDOW */}
        <div className="chat-window">
          {messages.map((msg: any, i: number) => (
            <div
              key={i}
              className={msg.from === "you" ? "bubble you" : "bubble robot"}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* CHAT INPUT */}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Say something to the robot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>

        {/* 3D ROBOT */}
        <div className="ai-3d">
          <Canvas camera={{ position: [3, 3, 5] }}>
            <ambientLight intensity={1.3} />
            <directionalLight position={[5, 10, 5]} intensity={1.4} />
            <AssistantRobot emotion={emotion} />
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        .ai-page {
          padding: 40px;
          font-family: 'Inter';
        }

        .ai-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .ai-header h2 {
          font-size: 38px;
          font-weight: 900;
        }

        .ai-header p {
          opacity: 0.6;
          margin-top: 8px;
        }

        .ai-content {
          display: flex;
          justify-content: space-between;
          gap: 40px;
        }

        .chat-window {
          width: 50%;
          height: 480px;
          padding: 18px;
          background: rgba(255,255,255,0.45);
          backdrop-filter: blur(15px);
          border-radius: 18px;
          overflow-y: auto;
          box-shadow: 0 12px 35px rgba(0,0,0,0.15);
        }

        .bubble {
          padding: 14px 18px;
          border-radius: 14px;
          margin: 8px 0;
          font-size: 18px;
          max-width: 80%;
        }

        .bubble.you {
          background: #6b4bff;
          color: white;
          margin-left: auto;
        }

        .bubble.robot {
          background: #eee;
          color: #111;
        }

        .chat-input {
          display: flex;
          gap: 12px;
          margin-top: 14px;
        }

        .chat-input input {
          flex: 1;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          font-size: 18px;
        }

        .chat-input button {
          padding: 14px 24px;
          border-radius: 12px;
          border: none;
          background: #6b4bff;
          color: white;
          font-size: 18px;
        }

        .ai-3d {
          width: 40%;
          height: 480px;
          background: rgba(255,255,255,0.45);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 12px 35px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
