import React from 'react';
import { ArrowLeft, Coins, ShoppingCart } from 'lucide-react';
import { useFarm } from '../lib/stores/useFarm';
import { useCoins } from '../lib/stores/useCoins';

interface MarketplaceProps {
  onReturnToField: () => void;
}

const PUMPKIN_PRICE = 25; // Coins per pumpkin

export default function Marketplace({ onReturnToField }: MarketplaceProps) {
  const { playerInventory, sellPumpkin } = useFarm();
  const { coins, addCoins } = useCoins();

  const handleSellPumpkin = () => {
    if (playerInventory.harvestedPumpkins > 0) {
      const success = sellPumpkin();
      if (success) {
        addCoins(PUMPKIN_PRICE);
        console.log(`[Marketplace] Sold 1 pumpkin for ${PUMPKIN_PRICE} coins`);
      }
    }
  };

  const handleSellAll = () => {
    const pumpkinsToSell = playerInventory.harvestedPumpkins;
    if (pumpkinsToSell > 0) {
      for (let i = 0; i < pumpkinsToSell; i++) {
        sellPumpkin();
      }
      addCoins(pumpkinsToSell * PUMPKIN_PRICE);
      console.log(`[Marketplace] Sold ${pumpkinsToSell} pumpkins for ${pumpkinsToSell * PUMPKIN_PRICE} coins`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-orange-900 via-yellow-800 to-orange-900 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-yellow-100 to-orange-100 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl border-4 border-orange-600 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-orange-900 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            Marketplace
          </h1>
          <button
            onClick={onReturnToField}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors duration-200 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Return to Field</span>
          </button>
        </div>

        {/* Current Inventory Display */}
        <div className="bg-white/80 rounded-xl p-4 mb-6 border-2 border-orange-300">
          <h2 className="text-xl font-bold text-orange-900 mb-4 text-center">Your Harvest</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🎃</div>
              <div className="text-lg font-bold text-orange-900">{playerInventory.harvestedPumpkins}</div>
              <div className="text-sm text-orange-700">Pumpkins</div>
            </div>
            <div className="bg-yellow-200 rounded-lg p-4 text-center">
              <Coins className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-yellow-900">{coins}</div>
              <div className="text-sm text-yellow-700">Current Coins</div>
            </div>
          </div>
        </div>

        {/* Selling Interface */}
        <div className="bg-white/80 rounded-xl p-4 mb-6 border-2 border-orange-300">
          <h3 className="text-lg font-bold text-orange-900 mb-4 text-center">Sell Your Pumpkins</h3>
          
          {playerInventory.harvestedPumpkins > 0 ? (
            <div className="space-y-4">
              {/* Price Display */}
              <div className="text-center bg-green-100 rounded-lg p-3 border-2 border-green-300">
                <div className="text-sm text-green-700">Current Price</div>
                <div className="text-xl font-bold text-green-900 flex items-center justify-center gap-2">
                  <Coins className="w-5 h-5" />
                  {PUMPKIN_PRICE} per pumpkin
                </div>
              </div>

              {/* Sell Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={handleSellPumpkin}
                  className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-xl transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="text-lg">Sell 1 Pumpkin</div>
                  <div className="text-sm opacity-90">+{PUMPKIN_PRICE} coins</div>
                </button>

                <button
                  onClick={handleSellAll}
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="text-lg">Sell All</div>
                  <div className="text-sm opacity-90">+{playerInventory.harvestedPumpkins * PUMPKIN_PRICE} coins</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎃</div>
              <div className="text-lg font-medium text-gray-600 mb-2">No pumpkins to sell</div>
              <div className="text-sm text-gray-500">Go back to your field and harvest some pumpkins!</div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-blue-100 rounded-xl p-4 border-2 border-blue-300">
          <h4 className="font-bold text-blue-900 mb-2">💡 Marketplace Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Harvest mature pumpkins from your field</li>
            <li>• Sell them here for {PUMPKIN_PRICE} coins each</li>
            <li>• Use coins for future upgrades and tools</li>
            <li>• Come back anytime to sell your harvest!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}