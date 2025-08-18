import React from 'react';
import { Coins } from 'lucide-react';
import { useCoins } from '../lib/stores/useCoins';

export default function CoinCounter() {
  const { coins } = useCoins();

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-4 py-2 rounded-xl shadow-lg border-2 border-yellow-400 flex items-center gap-2 min-w-[120px]">
        <Coins className="w-5 h-5 text-yellow-200" />
        <div className="flex flex-col">
          <span className="text-xs font-medium text-yellow-100">Coins</span>
          <span className="text-lg font-bold leading-none">{coins.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}