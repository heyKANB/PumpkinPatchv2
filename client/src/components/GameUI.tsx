import { useFarm } from "../lib/stores/useFarm";
import { useAudio } from "../lib/stores/useAudio";

export default function GameUI() {
  const { playerInventory, getTotalPumpkinsByStage } = useFarm();
  const { isMuted, toggleMute } = useAudio();

  const pumpkinCounts = getTotalPumpkinsByStage();

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      right: '20px',
      pointerEvents: 'none',
      zIndex: 1000,
    }}>
      {/* Game Stats */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        maxWidth: '300px',
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>🎃 Pumpkin Farm</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <strong>Seeds:</strong> {playerInventory.seeds}
          </div>
          <div>
            <strong>Harvested:</strong> {playerInventory.harvestedPumpkins}
          </div>
        </div>
        
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#ccc' }}>
          <div><span style={{ color: '#8B4513' }}>●</span> Seeds: {pumpkinCounts.seed}</div>
          <div><span style={{ color: '#32CD32' }}>●</span> Sprouts: {pumpkinCounts.sprout}</div>
          <div><span style={{ color: '#228B22' }}>●</span> Growing: {pumpkinCounts.growing}</div>
          <div><span style={{ color: '#FF8C00' }}>●</span> Mature: {pumpkinCounts.mature}</div>
        </div>
      </div>

      {/* Controls */}
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
          padding: '10px',
          borderRadius: '10px',
          cursor: 'pointer',
          pointerEvents: 'auto',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
        }}
      >
        {isMuted ? '🔇 Unmute' : '🔊 Mute'}
      </button>

      {/* Instructions */}
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
    </div>
  );
}