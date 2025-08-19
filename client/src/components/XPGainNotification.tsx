import React, { useState, useEffect } from 'react';
import { useXP, XPGain } from '../lib/stores/useXP';

interface XPNotificationProps {
  gain: XPGain;
  onComplete: () => void;
}

const XPNotification: React.FC<XPNotificationProps> = ({ gain, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRemove, setShouldRemove] = useState(false);

  useEffect(() => {
    console.log('[XP Notification] Showing notification for:', gain.activity.name, 'XP:', gain.amount);
    
    // Start fade out after showing for a short time
    const fadeTimer = setTimeout(() => {
      console.log('[XP Notification] Starting fade out for:', gain.activity.name);
      setIsVisible(false);
    }, 800);
    
    // Remove component after fade completes
    const removeTimer = setTimeout(() => {
      console.log('[XP Notification] Removing notification for:', gain.activity.name);
      setShouldRemove(true);
      onComplete();
    }, 1300); // Extra time for fade animation

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete, gain.activity.name, gain.amount]);

  // Don't render if marked for removal
  if (shouldRemove) {
    return null;
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'plant': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'harvest': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'repair': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'achievement': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div
      className={`
        flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg border backdrop-blur-sm
        transition-all duration-500 ease-out text-sm md:text-base
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
        ${getActivityColor(gain.activity.type)}
      `}
    >
      <div className="flex-shrink-0">
        <svg className="w-4 md:w-5 h-4 md:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="font-medium text-xs md:text-sm">{gain.activity.name}</div>
        <div className="text-xs opacity-75">+{gain.amount} XP</div>
      </div>
      
      <div className="flex-shrink-0 font-bold text-xs md:text-sm">
        +{gain.amount}
      </div>
    </div>
  );
};

const XPGainNotifications: React.FC = () => {
  const { recentGains, clearRecentGains } = useXP();
  const [displayedGains, setDisplayedGains] = useState<XPGain[]>([]);

  useEffect(() => {
    // Add new gains that aren't already displayed
    const newGains = recentGains.filter(gain => 
      !displayedGains.find(displayed => 
        displayed.timestamp === gain.timestamp && 
        displayed.activity.name === gain.activity.name
      )
    );

    if (newGains.length > 0) {
      setDisplayedGains(prev => [...prev, ...newGains]);
    }
  }, [recentGains, displayedGains]);

  const handleNotificationComplete = (completedGain: XPGain) => {
    setDisplayedGains(prev => 
      prev.filter(gain => 
        !(gain.timestamp === completedGain.timestamp && 
          gain.activity.name === completedGain.activity.name)
      )
    );
  };

  return (
    <div className="fixed top-20 md:top-24 right-4 z-50 space-y-2 max-w-xs" style={{ pointerEvents: 'none' }}>
      {displayedGains.map((gain, index) => (
        <XPNotification
          key={`${gain.timestamp}-${gain.activity.name}-${index}`}
          gain={gain}
          onComplete={() => handleNotificationComplete(gain)}
        />
      ))}
    </div>
  );
};

export default XPGainNotifications;