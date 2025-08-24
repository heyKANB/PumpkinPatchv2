import React from 'react';
import { ArrowLeft, Coins, ShoppingCart } from 'lucide-react';
import { useFarm, SEED_COSTS, CROP_UNLOCK_COSTS, CROP_UNLOCK_LEVELS, CropType } from '../lib/stores/useFarm';
import { useCoins } from '../lib/stores/useCoins';
import { useXP } from '../lib/stores/useXP';

interface MarketplaceProps {
  onReturnToField: () => void;
}

const PUMPKIN_PRICE = 5; // Coins per pumpkin

export default function Marketplace({ onReturnToField }: MarketplaceProps) {
  const { playerInventory, sellCrop, unlockCrop, purchaseSeeds } = useFarm();
  const { coins, addCoins, spendCoins } = useCoins();
  const { level } = useXP();

  const handleSellCrop = (cropType: CropType) => {
    if (playerInventory.harvestedCrops[cropType] > 0) {
      const success = sellCrop(cropType);
      if (success) {
        addCoins(PUMPKIN_PRICE);
        console.log(`[Marketplace] Sold 1 ${cropType} for ${PUMPKIN_PRICE} coins`);
      }
    }
  };

  const handleSellAll = (cropType: CropType) => {
    const cropsToSell = playerInventory.harvestedCrops[cropType];
    if (cropsToSell > 0) {
      for (let i = 0; i < cropsToSell; i++) {
        sellCrop(cropType);
      }
      addCoins(cropsToSell * PUMPKIN_PRICE);
      console.log(`[Marketplace] Sold ${cropsToSell} ${cropType}s for ${cropsToSell * PUMPKIN_PRICE} coins`);
    }
  };

  const handleUnlockCorn = () => {
    if (level >= CROP_UNLOCK_LEVELS.corn && spendCoins(CROP_UNLOCK_COSTS.corn)) {
      unlockCrop('corn');
      console.log(`[Marketplace] Unlocked corn for ${CROP_UNLOCK_COSTS.corn} coins`);
    }
  };

  const handlePurchaseSeeds = (cropType: CropType, quantity: number) => {
    const cost = SEED_COSTS[cropType] * quantity;
    if (spendCoins(cost)) {
      purchaseSeeds(cropType, quantity);
      console.log(`[Marketplace] Purchased ${quantity} ${cropType} seeds for ${cost} coins`);
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
              <div className="text-lg font-bold text-orange-900">{playerInventory.harvestedCrops.pumpkin}</div>
              <div className="text-sm text-orange-700">Pumpkins</div>
            </div>
            {playerInventory.unlockedCrops.corn && (
              <div className="bg-yellow-200 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🌽</div>
                <div className="text-lg font-bold text-yellow-900">{playerInventory.harvestedCrops.corn}</div>
                <div className="text-sm text-yellow-700">Corn</div>
              </div>
            )}
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
          
          {(playerInventory.harvestedCrops.pumpkin > 0 || playerInventory.harvestedCrops.corn > 0) ? (
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
              <div className="space-y-4">
                {/* Pumpkin Selling */}
                {playerInventory.harvestedCrops.pumpkin > 0 && (
                  <div className="border-2 border-orange-300 rounded-lg p-3">
                    <h4 className="font-bold text-orange-900 mb-2">🎃 Pumpkins ({playerInventory.harvestedCrops.pumpkin})</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSellCrop('pumpkin')}
                        className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg transition-all duration-200 font-bold"
                      >
                        <div className="text-sm">Sell 1</div>
                        <div className="text-xs opacity-90">+{PUMPKIN_PRICE} coins</div>
                      </button>
                      <button
                        onClick={() => handleSellAll('pumpkin')}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-all duration-200 font-bold"
                      >
                        <div className="text-sm">Sell All</div>
                        <div className="text-xs opacity-90">+{playerInventory.harvestedCrops.pumpkin * PUMPKIN_PRICE} coins</div>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Corn Selling */}
                {playerInventory.harvestedCrops.corn > 0 && (
                  <div className="border-2 border-yellow-300 rounded-lg p-3">
                    <h4 className="font-bold text-yellow-900 mb-2">🌽 Corn ({playerInventory.harvestedCrops.corn})</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSellCrop('corn')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-lg transition-all duration-200 font-bold"
                      >
                        <div className="text-sm">Sell 1</div>
                        <div className="text-xs opacity-90">+{PUMPKIN_PRICE} coins</div>
                      </button>
                      <button
                        onClick={() => handleSellAll('corn')}
                        className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg transition-all duration-200 font-bold"
                      >
                        <div className="text-sm">Sell All</div>
                        <div className="text-xs opacity-90">+{playerInventory.harvestedCrops.corn * PUMPKIN_PRICE} coins</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎃</div>
              <div className="text-lg font-medium text-gray-600 mb-2">No pumpkins to sell</div>
              <div className="text-sm text-gray-500">Go back to your field and harvest some crops!</div>
            </div>
          )}
        </div>

        {/* Crop Unlocking Section */}
        {!playerInventory.unlockedCrops.corn && level >= CROP_UNLOCK_LEVELS.corn && (
          <div className="bg-purple-100 rounded-xl p-4 mb-6 border-2 border-purple-300">
            <h3 className="text-lg font-bold text-purple-900 mb-4 text-center">🌽 Unlock Corn Crops!</h3>
            <p className="text-sm text-purple-800 mb-4 text-center">
              You've reached level {level}! Unlock corn crops to grow a new type of crop that takes longer to mature but provides variety.
            </p>
            <button
              onClick={handleUnlockCorn}
              disabled={coins < CROP_UNLOCK_COSTS.corn}
              className={`w-full p-4 rounded-xl font-bold transition-all duration-200 ${
                coins >= CROP_UNLOCK_COSTS.corn
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              <div className="text-lg">Unlock Corn</div>
              <div className="text-sm opacity-90">{CROP_UNLOCK_COSTS.corn} coins</div>
            </button>
          </div>
        )}
        
        {/* Seed Purchasing Section */}
        {playerInventory.unlockedCrops.corn && (
          <div className="bg-green-100 rounded-xl p-4 mb-6 border-2 border-green-300">
            <h3 className="text-lg font-bold text-green-900 mb-4 text-center">🌱 Buy Seeds</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span>🌽</span>
                  <span className="font-medium">Corn Seeds</span>
                  <span className="text-sm text-gray-600">({playerInventory.seeds.corn} owned)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePurchaseSeeds('corn', 1)}
                    disabled={coins < SEED_COSTS.corn}
                    className={`px-3 py-1 rounded text-sm font-bold ${
                      coins >= SEED_COSTS.corn
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    Buy 1 ({SEED_COSTS.corn} coins)
                  </button>
                  <button
                    onClick={() => handlePurchaseSeeds('corn', 5)}
                    disabled={coins < SEED_COSTS.corn * 5}
                    className={`px-3 py-1 rounded text-sm font-bold ${
                      coins >= SEED_COSTS.corn * 5
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    Buy 5 ({SEED_COSTS.corn * 5} coins)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-blue-100 rounded-xl p-4 border-2 border-blue-300">
          <h4 className="font-bold text-blue-900 mb-2">💡 Marketplace Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Harvest mature crops from your field</li>
            <li>• Sell them here for {PUMPKIN_PRICE} coins each</li>
            <li>• Unlock new crops as you level up</li>
            <li>• Purchase seeds for crops that aren't free</li>
            <li>• Come back anytime to sell your harvest!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}