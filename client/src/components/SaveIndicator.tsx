import React, { useState, useEffect } from 'react';
import { SaveSystem } from '../lib/saveSystem';

const SaveIndicator: React.FC = () => {
  const [showSaving, setShowSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  useEffect(() => {
    // Override the SaveSystem.save method to show the indicator
    const originalSave = SaveSystem.save;
    SaveSystem.save = function() {
      setShowSaving(true);
      originalSave.call(this);
      setLastSaveTime(new Date());
      setTimeout(() => setShowSaving(false), 2000);
    };

    return () => {
      SaveSystem.save = originalSave;
    };
  }, []);

  const formatLastSave = (time: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes === 1) return '1 minute ago';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    return time.toLocaleTimeString();
  };

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      {showSaving && (
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Saving...</span>
        </div>
      )}
      
      {!showSaving && lastSaveTime && (
        <div className="bg-black/40 text-white px-3 py-1 rounded text-xs backdrop-blur-sm">
          Last saved: {formatLastSave(lastSaveTime)}
        </div>
      )}
    </div>
  );
};

export default SaveIndicator;