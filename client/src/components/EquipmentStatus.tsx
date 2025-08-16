import { useEquipment } from "../lib/stores/useEquipment";
import { useIsMobile } from "../hooks/use-is-mobile";

export default function EquipmentStatus() {
  const { equipment } = useEquipment();
  const isMobile = useIsMobile();

  if (equipment.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      top: isMobile ? '120px' : '200px',
      right: isMobile ? '10px' : '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: isMobile ? '10px' : '15px',
      borderRadius: '10px',
      fontFamily: 'Inter, sans-serif',
      fontSize: isMobile ? '11px' : '12px',
      maxWidth: isMobile ? '150px' : '200px',
      zIndex: 1000,
      pointerEvents: 'none'
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: isMobile ? '12px' : '14px' }}>
        🔧 Equipment Status
      </h4>
      
      {equipment.map((item) => {
        const getStatusColor = (durability: number) => {
          if (durability > 70) return '#4CAF50';
          if (durability > 40) return '#FF9800';
          return '#F44336';
        };

        const getStatusEmoji = (durability: number) => {
          if (durability > 70) return '✅';
          if (durability > 40) return '⚠️';
          return '🔴';
        };

        const getTypeEmoji = (type: string) => {
          switch (type) {
            case 'tractor': return '🚜';
            case 'watering_can': return '🪣';
            case 'hoe': return '⚒️';
            default: return '🔧';
          }
        };

        return (
          <div key={item.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '5px',
            padding: '3px 0',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {getTypeEmoji(item.type)} {item.type.replace('_', ' ')}
            </span>
            <span style={{ 
              color: getStatusColor(item.durability),
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              {getStatusEmoji(item.durability)} {item.durability}%
            </span>
          </div>
        );
      })}
      
      <div style={{ 
        marginTop: '10px', 
        fontSize: isMobile ? '10px' : '11px', 
        color: '#ccc',
        borderTop: '1px solid #555',
        paddingTop: '8px'
      }}>
        Click equipment to repair
      </div>
    </div>
  );
}