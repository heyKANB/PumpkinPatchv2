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
    }, 600); // Show for 0.6 seconds then start fading
    
    // Remove component after fade completes
    const removeTimer = setTimeout(() => {
      console.log('[XP Notification] Removing notification for:', gain.activity.name);
      setShouldRemove(true);
      onComplete();
    }, 1100); // Remove after fade completes (0.6s + 0.5s transition)

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
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(4px)',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'all 0.5s ease-out',
        backgroundColor: gain.activity.type === 'plant' ? 'rgba(34, 197, 94, 0.2)' : 
                        gain.activity.type === 'harvest' ? 'rgba(251, 146, 60, 0.2)' : 
                        gain.activity.type === 'repair' ? 'rgba(59, 130, 246, 0.2)' : 
                        'rgba(234, 179, 8, 0.2)',
        color: gain.activity.type === 'plant' ? '#22c55e' : 
               gain.activity.type === 'harvest' ? '#fb923c' : 
               gain.activity.type === 'repair' ? '#3b82f6' : 
               '#eab308',
        borderColor: gain.activity.type === 'plant' ? 'rgba(34, 197, 94, 0.3)' : 
                     gain.activity.type === 'harvest' ? 'rgba(251, 146, 60, 0.3)' : 
                     gain.activity.type === 'repair' ? 'rgba(59, 130, 246, 0.3)' : 
                     'rgba(234, 179, 8, 0.3)'
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '12px' }}>{gain.activity.name}</div>
        <div style={{ fontSize: '11px', opacity: 0.8 }}>+{gain.amount} XP</div>
      </div>
      
      <div style={{ flexShrink: 0, fontWeight: 'bold', fontSize: '12px' }}>
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