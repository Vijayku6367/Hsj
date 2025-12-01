import { useSwipe } from '../../hooks/useMobileSwipe';

interface TouchControlsProps {
  onCommand: (command: string) => void;
}

export default function TouchControls({ onCommand }: TouchControlsProps) {
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => onCommand('ROTATE_LEFT'),
    onSwipeRight: () => onCommand('ROTATE_RIGHT'),
    onSwipeUp: () => onCommand('MOVE_FORWARD'),
    onSwipeDown: () => onCommand('MOVE_BACKWARD'),
  });

  return (
    <div className="touch-controls">
      {/* Swipe Area */}
      <div className="swipe-area" {...swipeHandlers}>
        <div className="swipe-instructions">
          Swipe to move • Tap buttons for precise control
        </div>
        
        <div className="swipe-directions">
          <div className="direction up" onClick={() => onCommand('MOVE_FORWARD')}>
            ↑
          </div>
          <div className="direction-row">
            <div className="direction left" onClick={() => onCommand('ROTATE_LEFT')}>
              ←
            </div>
            <div className="direction center" onClick={() => onCommand('STOP')}>
              ⏹️
            </div>
            <div className="direction right" onClick={() => onCommand('ROTATE_RIGHT')}>
              →
            </div>
          </div>
          <div className="direction down" onClick={() => onCommand('MOVE_BACKWARD')}>
            ↓
          </div>
        </div>
      </div>

      <style jsx>{`
        .touch-controls {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .swipe-area {
          touch-action: pan-y pinch-zoom;
          user-select: none;
        }
        
        .swipe-instructions {
          text-align: center;
          color: white;
          margin-bottom: 20px;
          font-size: 14px;
          opacity: 0.8;
        }
        
        .swipe-directions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        
        .direction-row {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        
        .direction {
          width: 70px;
          height: 70px;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          user-select: none;
        }
        
        .direction:active {
          background: rgba(255, 255, 255, 0.4);
          transform: scale(0.95);
        }
        
        .direction.center {
          width: 60px;
          height: 60px;
          background: rgba(255, 0, 0, 0.3);
        }
        
        @media (max-width: 768px) {
          .direction {
            width: 60px;
            height: 60px;
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
    }
