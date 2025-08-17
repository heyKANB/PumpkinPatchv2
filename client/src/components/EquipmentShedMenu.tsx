import { useEquipment } from "../lib/stores/useEquipment";
import { useIsMobile } from "../hooks/use-is-mobile";

interface EquipmentShedMenuProps {
  onClose: () => void;
  onSelectEquipment: (equipment: any) => void;
}

export default function EquipmentShedMenu({ onClose, onSelectEquipment }: EquipmentShedMenuProps) {
  const { equipment } = useEquipment();
  const isMobile = useIsMobile();

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'tractor': return '🚜';
      case 'watering_can': return '🪣';
      case 'hoe': return '⚒️';
      default: return '🔧';
    }
  };

  const getEquipmentName = (type: string) => {
    switch (type) {
      case 'tractor': return 'Tractor';
      case 'watering_can': return 'Watering Can';
      case 'hoe': return 'Garden Hoe';
      default: return 'Equipment';
    }
  };

  const getConditionColor = (durability: number) => {
    if (durability > 70) return '#4CAF50';
    if (durability > 40) return '#FF9800';
    return '#F44336';
  };

  const getConditionText = (durability: number) => {
    if (durability > 70) return 'Good';
    if (durability > 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '20px' : '40px',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'rgba(139, 69, 19, 0.9)',
        padding: isMobile ? '15px' : '20px',
        borderRadius: '15px 15px 0 0',
        width: '100%',
        maxWidth: isMobile ? '350px' : '500px',
        textAlign: 'center',
        border: '3px solid #8B4513'
      }}>
        <h2 style={{
          color: '#FFD700',
          margin: 0,
          fontSize: isMobile ? '20px' : '24px',
          fontFamily: 'Inter, sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          🏗️ Equipment Shed
        </h2>
        <p style={{
          color: '#FFF',
          margin: '8px 0 0 0',
          fontSize: isMobile ? '12px' : '14px',
          opacity: 0.9
        }}>
          Select equipment to maintain
        </p>
      </div>

      {/* Equipment List */}
      <div style={{
        backgroundColor: 'rgba(101, 67, 33, 0.9)',
        padding: isMobile ? '15px' : '20px',
        width: '100%',
        maxWidth: isMobile ? '350px' : '500px',
        minHeight: '300px',
        border: '3px solid #8B4513',
        borderTop: 'none',
        overflowY: 'auto'
      }}>
        {equipment.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectEquipment(item)}
            style={{
              backgroundColor: 'rgba(139, 69, 19, 0.8)',
              border: `2px solid ${getConditionColor(item.durability)}`,
              borderRadius: '10px',
              padding: isMobile ? '12px' : '15px',
              marginBottom: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(139, 69, 19, 1)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(139, 69, 19, 0.8)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {/* Equipment Icon */}
            <div style={{
              fontSize: isMobile ? '32px' : '40px',
              minWidth: isMobile ? '40px' : '50px',
              textAlign: 'center'
            }}>
              {getEquipmentIcon(item.type)}
            </div>
            
            {/* Equipment Info */}
            <div style={{ flex: 1 }}>
              <div style={{
                color: '#FFD700',
                fontWeight: 'bold',
                fontSize: isMobile ? '16px' : '18px',
                marginBottom: '4px'
              }}>
                {getEquipmentName(item.type)}
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: isMobile ? '12px' : '14px'
              }}>
                <span style={{ color: '#FFF' }}>Condition:</span>
                <span style={{ 
                  color: getConditionColor(item.durability),
                  fontWeight: 'bold'
                }}>
                  {getConditionText(item.durability)} ({item.durability}%)
                </span>
              </div>
              
              {/* Durability Bar */}
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '10px',
                height: '8px',
                marginTop: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  backgroundColor: getConditionColor(item.durability),
                  height: '100%',
                  width: `${item.durability}%`,
                  borderRadius: '10px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
            
            {/* Status Indicator */}
            <div style={{
              fontSize: isMobile ? '16px' : '20px',
              color: getConditionColor(item.durability)
            }}>
              {item.durability < 30 ? '🔴' : item.durability < 70 ? '🟡' : '🟢'}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: 'rgba(139, 69, 19, 0.9)',
        padding: isMobile ? '12px' : '15px',
        borderRadius: '0 0 15px 15px',
        width: '100%',
        maxWidth: isMobile ? '350px' : '500px',
        textAlign: 'center',
        border: '3px solid #8B4513',
        borderTop: 'none'
      }}>
        <button
          onClick={onClose}
          style={{
            backgroundColor: '#F44336',
            color: 'white',
            border: 'none',
            padding: isMobile ? '10px 20px' : '12px 24px',
            borderRadius: '8px',
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'Inter, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#D32F2F';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F44336';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          🚪 Exit Shed
        </button>
      </div>
    </div>
  );
}