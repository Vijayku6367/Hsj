import { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="mobile-container">
      <div className="app-content">
        {children}
      </div>
      
      <style jsx>{`
        .mobile-container {
          max-width: 100vw;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow-x: hidden;
        }
        
        .app-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 100vh;
        }
        
        @media (max-width: 768px) {
          .app-content {
            padding: 12px;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
