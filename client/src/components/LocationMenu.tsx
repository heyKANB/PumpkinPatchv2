import React from 'react';
import { X, MapPin, ChefHat, Sprout, Lock } from 'lucide-react';

interface LocationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
}

export default function LocationMenu({ isOpen, onClose, onSelectLocation }: LocationMenuProps) {
  if (!isOpen) return null;

  const handleLocationClick = (location: string, isLocked: boolean = false) => {
    if (isLocked) return;
    onSelectLocation(location);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-green-800 to-green-900 rounded-2xl p-4 md:p-8 max-w-md md:max-w-lg w-full shadow-2xl border-4 border-yellow-600 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-yellow-200 flex items-center gap-3">
            <MapPin className="w-6 md:w-8 h-6 md:h-8" />
            Travel Menu
          </h2>
          <button
            onClick={onClose}
            className="text-yellow-200 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Location Options */}
        <div className="space-y-4">
          {/* Field Option */}
          <button
            onClick={() => handleLocationClick('field')}
            className="w-full bg-green-700 hover:bg-green-600 text-white p-3 md:p-4 rounded-xl transition-all duration-200 flex items-center gap-3 md:gap-4 border-2 border-green-600 hover:border-green-500 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <div className="bg-green-600 p-3 rounded-xl">
              <Sprout className="w-8 h-8" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold">Field</h3>
              <p className="text-green-200 text-sm">Return to your pumpkin farm</p>
            </div>
          </button>

          {/* Marketplace Option - Locked */}
          <button
            onClick={() => handleLocationClick('marketplace', true)}
            className="w-full bg-gray-700 text-gray-400 p-4 rounded-xl transition-all duration-200 flex items-center gap-4 border-2 border-gray-600 cursor-not-allowed relative overflow-hidden"
          >
            <div className="bg-gray-600 p-3 rounded-xl">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold">Marketplace</h3>
              <p className="text-gray-300 text-sm">Buy and sell your goods</p>
            </div>
            <div className="bg-yellow-600 p-2 rounded-full">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
          </button>

          {/* Kitchen Option - Locked */}
          <button
            onClick={() => handleLocationClick('kitchen', true)}
            className="w-full bg-gray-700 text-gray-400 p-4 rounded-xl transition-all duration-200 flex items-center gap-4 border-2 border-gray-600 cursor-not-allowed relative overflow-hidden"
          >
            <div className="bg-gray-600 p-3 rounded-xl">
              <ChefHat className="w-8 h-8" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold">Kitchen</h3>
              <p className="text-gray-300 text-sm">Cook delicious pumpkin recipes</p>
            </div>
            <div className="bg-yellow-600 p-2 rounded-full">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
          </button>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-6 p-4 bg-yellow-600/20 border border-yellow-600/50 rounded-xl">
          <p className="text-yellow-200 text-sm text-center">
            🔒 Marketplace and Kitchen coming soon in future updates!
          </p>
        </div>
      </div>
    </div>
  );
}