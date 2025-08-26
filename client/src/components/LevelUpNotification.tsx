import React, { useState, useEffect } from 'react';

interface LevelUpNotificationProps {
  level: number;
  onComplete: () => void;
}

const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({ level, onComplete }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Start animation shortly after component mounts
    const showTimer = setTimeout(() => setVisible(true), 100);
    
    // Hide after 4 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false);
      // Call onComplete after animation completes
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 500);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []); // Remove onComplete dependency to prevent re-runs

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 500);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto"
      onClick={handleDismiss}
      style={{ cursor: 'pointer' }}
    >
      <div
        className={`
          bg-gradient-to-r from-yellow-500 to-orange-500 
          text-white font-bold text-3xl md:text-4xl
          px-8 py-6 rounded-xl shadow-2xl
          transform transition-all duration-500 ease-out
          ${visible ? 'scale-110 opacity-100' : 'scale-75 opacity-0'}
        `}
        style={{
          boxShadow: visible ? '0 0 50px rgba(255, 193, 7, 0.5)' : 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-5xl md:text-6xl mb-2">🎉</div>
          <div>LEVEL UP!</div>
          <div className="text-xl md:text-2xl mt-2">Level {level}</div>
        </div>
        
        {/* Animated sparkles */}
        {visible && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${10 + Math.random() * 80}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                ⭐
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelUpNotification;