import { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '../hooks/use-is-mobile';
import { useIsTablet } from '../hooks/use-is-tablet';
import MatchingGame from './MatchingGame';

interface MaintenanceMiniGameProps {
  equipment: {
    id: string;
    type: 'tractor' | 'watering_can' | 'hoe';
    durability: number;
    position: [number, number, number];
    lastMaintained: number;
    repairCost: number;
  };
  onComplete: (newDurability: number) => void;
  onClose: () => void;
}

interface RepairTask {
  id: string;
  type: 'tap' | 'hold' | 'sequence' | 'timing' | 'matching';
  progress: number;
  completed: boolean;
  description: string;
}

export default function MaintenanceMiniGame({ 
  equipment, 
  onComplete, 
  onClose 
}: MaintenanceMiniGameProps) {
  const equipmentType = equipment?.type || 'equipment';
  const currentDurability = equipment?.durability || 0;
  const displayName = equipmentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  const [tasks, setTasks] = useState<RepairTask[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [gameProgress, setGameProgress] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [tapCount, setTapCount] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [sequenceInput, setSequenceInput] = useState<string[]>([]);
  const [targetSequence] = useState(['1', '2', '3', '1']);
  const [timingAccuracy, setTimingAccuracy] = useState(0);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Initialize repair tasks based on equipment type
  useEffect(() => {
    const getTasksForEquipment = (type: string): RepairTask[] => {
      const baseTasks: RepairTask[] = [
        {
          id: 'clean',
          type: 'tap',
          progress: 0,
          completed: false,
          description: 'Clean the equipment (tap rapidly)'
        },
        {
          id: 'oil',
          type: 'hold',
          progress: 0,
          completed: false,
          description: 'Apply oil (hold to fill)'
        }
      ];

      switch (type) {
        case 'tractor':
          return [
            ...baseTasks,
            {
              id: 'matching',
              type: 'matching',
              progress: 0,
              completed: false,
              description: 'Match engine parts (match-3 game)'
            }
          ];
        case 'watering_can':
          return [
            ...baseTasks,
            {
              id: 'seal',
              type: 'timing',
              progress: 0,
              completed: false,
              description: 'Fix the seal (tap when green)'
            }
          ];
        case 'hoe':
          return [
            ...baseTasks,
            {
              id: 'matching',
              type: 'matching',
              progress: 0,
              completed: false,
              description: 'Sort tool components (match-3 game)'
            }
          ];
        default:
          return baseTasks;
      }
    };

    setTasks(getTasksForEquipment(equipmentType));
  }, [equipmentType]);

  // Handle task completion
  const completeCurrentTask = useCallback(() => {
    setTasks(prev => prev.map((task, index) => 
      index === currentTaskIndex 
        ? { ...task, completed: true, progress: 100 }
        : task
    ));

    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
    } else {
      // All tasks completed
      const repairAmount = Math.min(40, 100 - currentDurability);
      const newDurability = Math.min(100, currentDurability + repairAmount);
      console.log(`Equipment repair completed! ${equipmentType} - Old: ${currentDurability}%, New: ${newDurability}%`);
      setGameProgress(100);
      setTimeout(() => onComplete(newDurability), 1000);
    }
  }, [currentTaskIndex, tasks.length, currentDurability, onComplete, equipmentType]);

  // Handle different task types
  const handleTap = () => {
    const currentTask = tasks[currentTaskIndex];
    if (!currentTask || !isActive) return;

    switch (currentTask.type) {
      case 'tap':
        setTapCount(prev => {
          const newCount = prev + 1;
          const progress = Math.min(100, (newCount / 20) * 100);
          setTasks(prev => prev.map((task, index) =>
            index === currentTaskIndex ? { ...task, progress } : task
          ));
          if (progress >= 100) {
            completeCurrentTask();
          }
          return newCount;
        });
        break;
      case 'sequence':
        // Handle sequence input
        break;
      case 'timing':
        // Handle timing tap
        if (timingAccuracy > 80) {
          completeCurrentTask();
        }
        break;
    }
  };

  const handleHoldStart = () => {
    const currentTask = tasks[currentTaskIndex];
    if (!currentTask || currentTask.type !== 'hold' || !isActive) return;

    const interval = setInterval(() => {
      setHoldProgress(prev => {
        const newProgress = Math.min(100, prev + 2);
        setTasks(prev => prev.map((task, index) =>
          index === currentTaskIndex ? { ...task, progress: newProgress } : task
        ));
        if (newProgress >= 100) {
          clearInterval(interval);
          completeCurrentTask();
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  };

  const handleSequenceInput = (input: string) => {
    setSequenceInput(prev => {
      const newSequence = [...prev, input];
      if (newSequence.length > targetSequence.length) {
        return [input];
      }
      
      const isCorrect = newSequence.every((item, index) => 
        item === targetSequence[index]
      );

      if (isCorrect && newSequence.length === targetSequence.length) {
        completeCurrentTask();
        return [];
      } else if (!isCorrect) {
        return [];
      }
      
      return newSequence;
    });
  };

  // Timing task effect
  useEffect(() => {
    const currentTask = tasks[currentTaskIndex];
    if (currentTask?.type === 'timing' && isActive) {
      const interval = setInterval(() => {
        setTimingAccuracy(prev => {
          const newAccuracy = 50 + Math.sin(Date.now() * 0.005) * 50;
          return Math.max(0, Math.min(100, newAccuracy));
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentTaskIndex, tasks, isActive]);

  if (tasks.length === 0) return null;

  const currentTask = tasks[currentTaskIndex];
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalProgress = (completedTasks / tasks.length) * 100;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: isMobile ? '20px' : '30px',
        maxWidth: currentTask?.type === 'matching' ? (isMobile ? '95vw' : (isTablet ? '80vw' : '600px')) : (isMobile ? '90vw' : (isTablet ? '70vw' : '500px')),
        width: '100%',
        textAlign: 'center',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
          🔧 Repair {equipmentType.replace('_', ' ').toUpperCase()}
        </h2>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '10px',
          backgroundColor: '#eee',
          borderRadius: '5px',
          marginBottom: '20px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${totalProgress}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Current Task */}
        {currentTask && !currentTask.completed && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#555', margin: '0 0 10px 0' }}>
              {currentTask.description}
            </h3>

            {/* Task-specific UI */}
            {currentTask.type === 'tap' && (
              <div>
                <button
                  onTouchStart={handleTap}
                  onClick={handleTap}
                  style={{
                    width: isMobile ? '80px' : '100px',
                    height: isMobile ? '80px' : '100px',
                    borderRadius: '50%',
                    backgroundColor: '#2196F3',
                    border: 'none',
                    color: 'white',
                    fontSize: isMobile ? '16px' : '18px',
                    cursor: 'pointer',
                    marginBottom: '10px'
                  }}
                >
                  TAP!
                </button>
                <div>Progress: {Math.round(currentTask.progress)}%</div>
              </div>
            )}

            {currentTask.type === 'hold' && (
              <div>
                <button
                  onTouchStart={handleHoldStart}
                  onMouseDown={handleHoldStart}
                  style={{
                    width: isMobile ? '120px' : '150px',
                    height: isMobile ? '50px' : '60px',
                    backgroundColor: '#FF9800',
                    border: 'none',
                    color: 'white',
                    fontSize: isMobile ? '14px' : '16px',
                    cursor: 'pointer',
                    borderRadius: '10px'
                  }}
                >
                  HOLD TO FILL
                </button>
                <div style={{ marginTop: '10px' }}>
                  Progress: {Math.round(currentTask.progress)}%
                </div>
              </div>
            )}

            {currentTask.type === 'sequence' && (
              <div>
                <div style={{ marginBottom: '15px' }}>
                  Target: {targetSequence.join('-')}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  Input: {sequenceInput.join('-') || 'Start typing...'}
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  {[1, 2, 3].map(num => (
                    <button
                      key={num}
                      onClick={() => handleSequenceInput(num.toString())}
                      style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: '#9C27B0',
                        border: 'none',
                        color: 'white',
                        fontSize: '18px',
                        cursor: 'pointer',
                        borderRadius: '5px'
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentTask.type === 'timing' && (
              <div>
                <div style={{
                  width: '200px',
                  height: '20px',
                  backgroundColor: timingAccuracy > 80 ? '#4CAF50' : '#F44336',
                  margin: '10px auto',
                  borderRadius: '10px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: `${timingAccuracy}%`,
                    top: '-5px',
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#333',
                    borderRadius: '50%',
                    transform: 'translateX(-50%)'
                  }} />
                </div>
                <button
                  onClick={handleTap}
                  style={{
                    width: '100px',
                    height: '50px',
                    backgroundColor: timingAccuracy > 80 ? '#4CAF50' : '#F44336',
                    border: 'none',
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    marginTop: '10px'
                  }}
                >
                  TAP NOW!
                </button>
              </div>
            )}

            {currentTask.type === 'matching' && (
              <MatchingGame
                equipmentType={equipmentType}
                onProgress={(progress) => {
                  console.log(`[MaintenanceMiniGame] Matching game progress: ${progress}%`);
                  setTasks(prev => prev.map((task, index) => 
                    index === currentTaskIndex 
                      ? { ...task, progress }
                      : task
                  ));
                }}
                onComplete={() => {
                  console.log(`[MaintenanceMiniGame] Matching game completed! Completing current task...`);
                  completeCurrentTask();
                }}
              />
            )}
          </div>
        )}

        {/* Task List */}
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          {tasks.map((task, index) => (
            <div key={task.id} style={{
              padding: '8px',
              marginBottom: '5px',
              backgroundColor: task.completed ? '#E8F5E8' : index === currentTaskIndex ? '#FFF3E0' : '#f5f5f5',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: task.completed ? '#4CAF50' : '#333' }}>
                {task.completed ? '✅' : index === currentTaskIndex ? '🔄' : '⏳'} {task.description}
              </span>
              <span>{Math.round(task.progress)}%</span>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            backgroundColor: '#757575',
            border: 'none',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}