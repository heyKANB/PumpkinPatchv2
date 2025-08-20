import React from 'react';
import { Coins } from 'lucide-react';
import { useCoins } from '../lib/stores/useCoins';

export default function CoinCounter() {
  const { coins } = useCoins();

  return (
    <div className="fixed right-4 z-40" style={{ top: window.navigator.userAgent.includes('iPhone') ? '60px' : '16px' }}>
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-3 md:px-4 py-2 rounded-xl shadow-lg border-2 border-yellow-400 flex items-center gap-2 min-w-[100px] md:min-w-[120px]">
        <Coins className="w-4 md:w-5 h-4 md:h-5 text-yellow-200" />
        <div className="flex flex-col">
          <span className="text-xs font-medium text-yellow-100">Coins</span>
          <span className="text-sm md:text-lg font-bold leading-none">{coins.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}