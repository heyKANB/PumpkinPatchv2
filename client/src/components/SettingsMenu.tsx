import { useState } from 'react';
import { X, RefreshCw, User, Trash2, AlertTriangle, ShoppingBag, Palette } from 'lucide-react';
import { usePlayerAppearance, AVATAR_COLORS } from '../lib/stores/usePlayerAppearance';
import { useCoins } from '../lib/stores/useCoins';
import { SaveSystem } from '../lib/saveSystem';
import { useIsMobile } from '../hooks/use-is-mobile';
import { AVATAR_CATALOG, getItemsBySlot } from '../lib/avatar/catalog';
import { getRarityColor, getRarityName, AvatarSlot } from '../lib/avatar/types';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const { 
    avatar, 
    name, 
    setColors, 
    setName, 
    purchaseItem, 
    equipItem, 
    unequipSlot, 
    isItemOwned, 
    isItemEquipped,
    getEquippedInSlot,
    // Legacy compatibility
    appearance, 
    setAppearance, 
    resetToDefault 
  } = usePlayerAppearance();
  
  const { coins } = useCoins();
  const [activeTab, setActiveTab] = useState<'appearance' | 'shop' | 'game'>('appearance');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [playerName, setPlayerName] = useState(name);
  const [selectedShopSlot, setSelectedShopSlot] = useState<AvatarSlot>('hair');
  const [tryOnItem, setTryOnItem] = useState<string | null>(null);
  const isMobile = useIsMobile();

  if (!isOpen) return null;

  const handleColorSelect = (colorOption: typeof AVATAR_COLORS[0]) => {
    setColors(colorOption.colors);
  };

  const handleNameChange = (newName: string) => {
    setPlayerName(newName);
    setName(newName.trim() || 'Farmer');
  };

  const handlePurchaseItem = (itemId: string) => {
    const result = purchaseItem(itemId);
    if (result.success) {
      // Auto-equip after purchase
      equipItem(itemId);
    }
    console.log(`[Shop] ${result.message}`);
  };

  const handleEquipItem = (itemId: string) => {
    const result = equipItem(itemId);
    console.log(`[Shop] ${result.message}`);
  };

  const handleUnequipSlot = (slot: AvatarSlot) => {
    unequipSlot(slot);
  };

  const handleResetFarm = () => {
    setShowResetDialog(true);
  };

  const confirmResetFarm = () => {
    // Reset all game data
    SaveSystem.resetAllGameData();
    
    // Reset player appearance to default
    resetToDefault();
    
    // Clear player appearance from localStorage too
    localStorage.removeItem('pumpkin-farm-player-appearance');
    
    // Reload the page to start fresh
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className={`relative bg-white rounded-2xl shadow-2xl border-4 border-green-300 ${
        isMobile ? 'w-[95vw] h-[85vh] mx-2' : 'w-[600px] h-[70vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-green-200 bg-green-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-200 rounded-full">
              <User className="w-5 h-5 text-green-700" />
            </div>
            <h2 className="text-xl font-bold text-green-900">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b-2 border-gray-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('[Settings] Appearance tab clicked');
              setActiveTab('appearance');
            }}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'appearance'
                ? 'bg-green-100 text-green-700 border-b-2 border-green-500'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Palette className="w-4 h-4 inline-block mr-2" />
            Appearance
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('[Settings] Shop tab clicked');
              setActiveTab('shop');
            }}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'shop'
                ? 'bg-green-100 text-green-700 border-b-2 border-green-500'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline-block mr-2" />
            Shop ({coins}🪙)
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('[Settings] Game tab clicked');
              setActiveTab('game');
            }}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'game'
                ? 'bg-green-100 text-green-700 border-b-2 border-green-500'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            🎮 Game
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Player Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farmer Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter your farmer name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  maxLength={20}
                />
              </div>

              {/* Avatar Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Avatar Color
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {AVATAR_COLORS.map((colorOption) => (
                    <button
                      key={colorOption.name}
                      onClick={() => handleColorSelect(colorOption)}
                      className={`relative p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                        avatar.colors.primary === colorOption.colors.primary
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      title={colorOption.name}
                    >
                      <div 
                        className="w-8 h-12 rounded-full mx-auto"
                        style={{ backgroundColor: colorOption.colors.primary }}
                      />
                      {avatar.colors.primary === colorOption.colors.primary && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                          ✓
                        </div>
                      )}
                      <div className="text-xs text-center mt-1 font-medium">
                        {colorOption.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Avatar */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={resetToDefault}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset to Default Avatar
                </button>
              </div>
            </div>
          )}

          {activeTab === 'shop' && (
            <div className="space-y-6">
              {/* Coin Balance */}
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-xl border-2 border-yellow-300">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">🪙</span>
                  <span className="text-xl font-bold text-yellow-800">{coins} Coins</span>
                </div>
              </div>

              {/* Shop Categories */}
              <div className="flex flex-wrap gap-2 justify-center">
                {(['hair', 'hat', 'bandana', 'torso', 'faceAccessory', 'handheld'] as AvatarSlot[]).map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedShopSlot(slot)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                      selectedShopSlot === slot
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {slot === 'faceAccessory' ? 'Face' : slot}
                  </button>
                ))}
              </div>

              {/* Shop Items */}
              <div className="grid grid-cols-1 gap-4">
                {getItemsBySlot(selectedShopSlot).map(item => {
                  const owned = isItemOwned(item.id);
                  const equipped = isItemEquipped(item.id);
                  const canAfford = coins >= item.priceCoins;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        equipped
                          ? 'border-green-500 bg-green-50'
                          : owned
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                            <span
                              className="px-2 py-1 text-xs font-medium rounded-full"
                              style={{
                                backgroundColor: getRarityColor(item.rarity),
                                color: 'white'
                              }}
                            >
                              {getRarityName(item.rarity)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          
                          <div className="flex items-center gap-4 mt-3">
                            {item.priceCoins > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-lg">🪙</span>
                                <span className={`font-bold ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                                  {item.priceCoins}
                                </span>
                              </div>
                            )}
                            {item.priceCoins === 0 && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                FREE
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          {equipped && (
                            <>
                              <div className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full text-center">
                                ✓ Equipped
                              </div>
                              <button
                                onClick={() => handleUnequipSlot(item.slot)}
                                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-300 transition-colors"
                              >
                                Remove
                              </button>
                            </>
                          )}
                          
                          {owned && !equipped && (
                            <button
                              onClick={() => handleEquipItem(item.id)}
                              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Equip
                            </button>
                          )}
                          
                          {!owned && (
                            <button
                              onClick={() => handlePurchaseItem(item.id)}
                              disabled={!canAfford && item.priceCoins > 0}
                              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                                canAfford || item.priceCoins === 0
                                  ? 'bg-green-500 text-white hover:bg-green-600'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {item.priceCoins === 0 ? 'Get Free' : 'Buy & Equip'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {getItemsBySlot(selectedShopSlot).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🏪</div>
                  <p>No items available in this category yet.</p>
                  <p className="text-sm">Check back later for new items!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'game' && (
            <div className="space-y-6">
              {/* Reset Farm Section */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-red-900 mb-2">Reset Farm</h3>
                    <p className="text-sm text-red-700 mb-4">
                      This will permanently delete all your progress including crops, coins, XP, 
                      equipment, and unlocked features. You'll start completely fresh with a new farm.
                    </p>
                    <button
                      onClick={handleResetFarm}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-all"
                    >
                      Reset Farm
                    </button>
                  </div>
                </div>
              </div>

              {/* Game Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-bold text-blue-900 mb-2">Game Information</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Auto-save enabled (saves every 10 seconds)</p>
                  <p>• Progress is saved locally in your browser</p>
                  <p>• Clearing browser data will reset your farm</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-200 p-4 bg-gray-50 rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
          <div className={`relative bg-white rounded-2xl shadow-2xl border-4 border-red-300 ${
            isMobile ? 'w-[90vw] max-w-md mx-4' : 'w-[450px]'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-center p-6 border-b-2 border-red-200 bg-red-50 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-200 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-700" />
                </div>
                <h2 className="text-xl font-bold text-red-900">Are you sure?</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <p className="text-lg font-medium text-gray-800 mb-4">
                This will permanently delete ALL your progress:
              </p>
              <ul className="text-left text-gray-700 space-y-2 mb-6 bg-gray-50 p-4 rounded-lg">
                <li>• All crops and harvested items</li>
                <li>• All coins and XP progress</li>
                <li>• All equipment and upgrades</li>
                <li>• All unlocked features</li>
                <li>• Your avatar customization</li>
              </ul>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-bold text-lg">
                  ⚠️ This cannot be undone!
                </p>
                <p className="text-red-700 text-sm mt-1">
                  You'll start completely fresh as if you've never played before.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t-2 border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setShowResetDialog(false)}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmResetFarm}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}