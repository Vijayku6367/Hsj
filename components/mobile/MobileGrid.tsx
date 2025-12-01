import { motion } from 'framer-motion';

interface RobotState {
  x: number;
  y: number;
  rotation: number;
}

interface MobileGridProps {
  robotState: RobotState;
  onCommand: (command: string) => void;
}

export default function MobileGrid({ robotState, onCommand }: MobileGridProps) {
  const gridSize = 10;
  const cellSize = 30;

  return (
    <div className="grid-container">
      <div className="grid-header">
        <h3>Robot Map</h3>
        <div className="coordinates">
          X: {robotState.x} • Y: {robotState.y} • Rotation: {robotState.rotation}°
        </div>
      </div>
      
      <div 
        className="grid"
        style={{
          width: gridSize * cellSize,
          height: gridSize * cellSize,
        }}
      >
        {/* Grid cells */}
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);
          return (
            <div
              key={index}
              className="grid-cell"
              style={{
                width: cellSize,
                height: cellSize,
              }}
              onClick={() => onCommand(`MOVE_TO:${x},${y}`)}
            />
          );
        })}
        
        {/* Robot */}
        <motion.div
          className="robot"
          style={{
            width: cellSize - 10,
            height: cellSize - 10,
          }}
          animate={{
            x: robotState.x * cellSize,
            y: robotState.y * cellSize,
            rotate: robotState.rotation,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          🤖
        </motion.div>
        
        {/* Team cursors would go here */}
      </div>

      <style jsx>{`
        .grid-container {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          padding: 15px;
          backdrop-filter: blur(10px);
        }
        
        .grid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          color: white;
        }
        
        .grid-header h3 {
          margin: 0;
          font-size: 18px;
        }
        
        .coordinates {
          font-size: 12px;
          opacity: 0.8;
        }
        
        .grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(${gridSize}, 1fr);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          overflow: hidden;
          margin: 0 auto;
        }
        
        .grid-cell {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          transition: background 0.2s;
        }
        
        .grid-cell:active {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .robot {
          position: absolute;
          background: #4CAF50;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          border: 2px solid white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          z-index: 10;
        }
        
        @media (max-width: 768px) {
          .grid-header {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
          
          .grid {
            transform: scale(0.9);
            transform-origin: center;
          }
        }
      `}</style>
    </div>
  );
}
