import React from 'react';
import { useXP } from '../lib/stores/useXP';

const XPBar: React.FC = () => {
  const { level, getLevelProgress, getXPForNextLevel } = useXP();
  const progress = getLevelProgress();

  return (
    <div className="fixed top-4 left-4 z-50 bg-black/70 backdrop-blur-sm rounded-lg p-2 md:p-3 text-white w-48 md:w-52">
      <div className="flex items-center justify-between mb-1 md:mb-2">
        <span className="text-xs md:text-sm font-bold text-yellow-400">Level {level}</span>
        <span className="text-xs text-gray-300">
          {progress.current}/{progress.needed} XP
        </span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2 md:h-2.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 md:h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress.percentage}%` }}
        ></div>
      </div>
      
      <div className="text-xs text-gray-400 mt-1">
        {Math.round(progress.percentage)}% to next level
      </div>
    </div>
  );
};

export default XPBar;