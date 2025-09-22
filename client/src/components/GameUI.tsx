import { useFarm } from "../lib/stores/useFarm";
import { useAudio } from "../lib/stores/useAudio";
import { useEquipment } from "../lib/stores/useEquipment";
import { useIsMobile } from "../hooks/use-is-mobile";
import { useIsTablet } from "../hooks/use-is-tablet";

export default function GameUI() {
  const { playerInventory, getTotalCropsByStage, setSelectedCropType } = useFarm();
  const { isMuted, toggleMute } = useAudio();
  const { equipment } = useEquipment();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const cropCounts = getTotalCropsByStage();
  const criticalEquipment = equipment.filter(item => item.durability < 30).length;

  return (
    <div 
      className={isMobile ? "safe-area-top safe-area-left safe-area-right" : ""}
      style={{
        position: 'absolute',
        top: isTablet ? '140px' : (isMobile ? '140px' : '80px'), // Extra space for iOS safe area and XP bar
        left: isTablet ? '260px' : (isMobile ? '10px' : '20px'), // Move right for tablet to avoid XP bar
        right: isMobile ? '10px' : '20px',
        pointerEvents: 'none',
        zIndex: 1000,
      }}>
      {/* Game Stats */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: isMobile ? '10px' : '15px',
        borderRadius: '10px',
        marginBottom: isMobile ? '10px' : '20px',
        fontFamily: 'Inter, sans-serif',
        fontSize: isMobile ? '12px' : '14px',
        maxWidth: isMobile ? '180px' : (isTablet ? '240px' : '300px'),
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: isMobile ? '13px' : (isTablet ? '16px' : '18px') }}>🎃 Multi-Crop Farm</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <div>
            <strong>🎃 Seeds:</strong> {playerInventory.seeds.pumpkin}
          </div>
          <div>
            <strong>🎃 Harvested:</strong> {playerInventory.harvestedCrops.pumpkin}
          </div>
          {playerInventory.unlockedCrops.corn && (
            <>
              <div>
                <strong>🌽 Seeds:</strong> {playerInventory.seeds.corn}
              </div>
              <div>
                <strong>🌽 Harvested:</strong> {playerInventory.harvestedCrops.corn}
              </div>
            </>
          )}
          {playerInventory.unlockedCrops.wheat && (
            <>
              <div>
                <strong>🌾 Seeds:</strong> {playerInventory.seeds.wheat}
              </div>
              <div>
                <strong>🌾 Harvested:</strong> {playerInventory.harvestedCrops.wheat}
              </div>
            </>
          )}
        </div>
        
        {/* Crop Selection */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ marginBottom: '8px', fontSize: isMobile ? '13px' : '14px', fontWeight: 'bold' }}>
            🌱 Select Seed Type:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCropType('pumpkin')}
              style={{
                background: playerInventory.selectedCropType === 'pumpkin' ? 'rgba(255, 140, 0, 0.8)' : 'rgba(100, 100, 100, 0.6)',
                color: 'white',
                border: playerInventory.selectedCropType === 'pumpkin' ? '2px solid #FFD700' : '2px solid transparent',
                padding: isMobile ? '6px 8px' : '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: isMobile ? '11px' : '12px',
                fontWeight: 'bold',
                pointerEvents: 'auto',
                opacity: playerInventory.seeds.pumpkin > 0 ? 1 : 0.5,
              }}
            >
              🎃 {playerInventory.seeds.pumpkin}
            </button>
            {playerInventory.unlockedCrops.corn && (
              <button
                onClick={() => setSelectedCropType('corn')}
                style={{
                  background: playerInventory.selectedCropType === 'corn' ? 'rgba(255, 215, 0, 0.8)' : 'rgba(100, 100, 100, 0.6)',
                  color: 'white',
                  border: playerInventory.selectedCropType === 'corn' ? '2px solid #FFD700' : '2px solid transparent',
                  padding: isMobile ? '6px 8px' : '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: 'bold',
                  pointerEvents: 'auto',
                  opacity: playerInventory.seeds.corn > 0 ? 1 : 0.5,
                }}
              >
                🌽 {playerInventory.seeds.corn}
              </button>
            )}
            {playerInventory.unlockedCrops.wheat && (
              <button
                onClick={() => setSelectedCropType('wheat')}
                style={{
                  background: playerInventory.selectedCropType === 'wheat' ? 'rgba(244, 164, 96, 0.8)' : 'rgba(100, 100, 100, 0.6)',
                  color: 'white',
                  border: playerInventory.selectedCropType === 'wheat' ? '2px solid #FFD700' : '2px solid transparent',
                  padding: isMobile ? '6px 8px' : '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: 'bold',
                  pointerEvents: 'auto',
                  opacity: playerInventory.seeds.wheat > 0 ? 1 : 0.5,
                }}
              >
                🌾 {playerInventory.seeds.wheat}
              </button>
            )}
          </div>
          <div style={{ 
            marginTop: '6px', 
            fontSize: isMobile ? '10px' : '11px', 
            color: '#ccc',
            fontStyle: 'italic'
          }}>
            Selected: {playerInventory.selectedCropType === 'pumpkin' ? '🎃 Pumpkin' : 
                      playerInventory.selectedCropType === 'corn' ? '🌽 Corn' : 
                      '🌾 Wheat'} seeds will be planted
          </div>
        </div>
        
        {!isMobile && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#ccc' }}>
            <div style={{ marginBottom: '6px', fontWeight: 'bold', color: '#FF8C00' }}>🎃 Pumpkins:</div>
            <div><span style={{ color: '#8B4513' }}>●</span> Seeds: {cropCounts.pumpkin.seed}</div>
            <div><span style={{ color: '#32CD32' }}>●</span> Sprouts: {cropCounts.pumpkin.sprout}</div>
            <div><span style={{ color: '#228B22' }}>●</span> Growing: {cropCounts.pumpkin.growing}</div>
            <div><span style={{ color: '#FF8C00' }}>●</span> Mature: {cropCounts.pumpkin.mature}</div>
            
            {playerInventory.unlockedCrops.corn && (
              <>
                <div style={{ marginTop: '8px', marginBottom: '6px', fontWeight: 'bold', color: '#FFD700' }}>🌽 Corn:</div>
                <div><span style={{ color: '#8B4513' }}>●</span> Seeds: {cropCounts.corn.seed}</div>
                <div><span style={{ color: '#90EE90' }}>●</span> Sprouts: {cropCounts.corn.sprout}</div>
                <div><span style={{ color: '#32CD32' }}>●</span> Growing: {cropCounts.corn.growing}</div>
                <div><span style={{ color: '#FFD700' }}>●</span> Mature: {cropCounts.corn.mature}</div>
              </>
            )}
            
            {playerInventory.unlockedCrops.wheat && (
              <>
                <div style={{ marginTop: '8px', marginBottom: '6px', fontWeight: 'bold', color: '#F4A460' }}>🌾 Wheat:</div>
                <div><span style={{ color: '#8B4513' }}>●</span> Seeds: {cropCounts.wheat.seed}</div>
                <div><span style={{ color: '#9ACD32' }}>●</span> Sprouts: {cropCounts.wheat.sprout}</div>
                <div><span style={{ color: '#DAA520' }}>●</span> Growing: {cropCounts.wheat.growing}</div>
                <div><span style={{ color: '#F4A460' }}>●</span> Mature: {cropCounts.wheat.mature}</div>
              </>
            )}
          </div>
        )}
        
        {/* Equipment Status - Mobile/Desktop */}
        {criticalEquipment > 0 && (
          <div style={{
            marginTop: '10px',
            padding: '8px',
            backgroundColor: 'rgba(244, 67, 54, 0.2)',
            borderRadius: '5px',
            border: '1px solid #F44336',
            fontSize: '12px'
          }}>
            <div style={{ color: '#F44336', fontWeight: 'bold' }}>
              ⚠️ {criticalEquipment} Equipment needs repair!
            </div>
            <div style={{ color: '#ccc', marginTop: '4px' }}>
              Click on equipment to start maintenance
            </div>
          </div>
        )}
      </div>

      {/* Controls - Desktop only */}
      {!isMobile && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          maxWidth: '300px',
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Controls</h4>
          <div style={{ lineHeight: '1.5' }}>
            <div><strong>WASD/Arrow Keys:</strong> Move</div>
            <div><strong>Space/E:</strong> Plant seed</div>
            <div><strong>Click mature pumpkins:</strong> Harvest</div>
          </div>
        </div>
      )}

      {/* Audio Control */}
      <button
        onClick={toggleMute}
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          border: 'none',
          padding: isMobile ? '8px' : '10px',
          borderRadius: '10px',
          cursor: 'pointer',
          pointerEvents: 'auto',
          fontFamily: 'Inter, sans-serif',
          fontSize: isMobile ? '12px' : '14px',
        }}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {/* Instructions - Desktop only or simplified mobile */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '0',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '10px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          maxWidth: '400px',
        }}>
          <div style={{ color: '#90EE90' }}>
            💡 Tip: Move around the farm and press Space/E to plant seeds. 
            Pumpkins will grow automatically. Click mature orange pumpkins to harvest them!
          </div>
        </div>
      )}

      {/* Mobile Instructions */}
      {isMobile && (
        <div style={{
          position: 'absolute',
          bottom: '120px', // Above mobile controls
          left: '0',
          right: '0',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '10px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          textAlign: 'center',
        }}>
          <div style={{ color: '#90EE90' }}>
            Drag anywhere to move farmer, green button to plant, tap orange pumpkins to harvest
          </div>
        </div>
      )}
    </div>
  );
}