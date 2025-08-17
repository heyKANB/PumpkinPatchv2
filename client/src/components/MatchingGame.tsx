import { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '../hooks/use-is-mobile';

interface Tile {
  id: string;
  type: 'seed' | 'sprout' | 'pumpkin' | 'tractor' | 'watering_can' | 'hoe' | 'fertilizer' | 'shovel';
  icon: string;
  row: number;
  col: number;
  isSelected: boolean;
  isMatched: boolean;
  isAnimating: boolean;
}

interface MatchingGameProps {
  onProgress: (progress: number) => void;
  onComplete: () => void;
  equipmentType: string;
}

const TILE_TYPES = [
  { type: 'seed', icon: '🌱' },
  { type: 'sprout', icon: '🌿' },
  { type: 'pumpkin', icon: '🎃' },
  { type: 'tractor', icon: '🚜' },
  { type: 'watering_can', icon: '🪣' },
  { type: 'hoe', icon: '⚒️' },
  { type: 'fertilizer', icon: '🧪' },
  { type: 'shovel', icon: '🪓' }
] as const;

export default function MatchingGame({ onProgress, onComplete, equipmentType }: MatchingGameProps) {
  const [board, setBoard] = useState<Tile[][]>([]);
  const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [targetScore] = useState(500);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const isMobile = useIsMobile();

  const BOARD_SIZE = isMobile ? 6 : 8;

  // Initialize the game board
  const initializeBoard = useCallback(() => {
    const newBoard: Tile[][] = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      const boardRow: Tile[] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        const randomType = TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)];
        const tile: Tile = {
          id: `${row}-${col}`,
          type: randomType.type,
          icon: randomType.icon,
          row,
          col,
          isSelected: false,
          isMatched: false,
          isAnimating: false
        };
        boardRow.push(tile);
      }
      newBoard.push(boardRow);
    }
    
    setBoard(newBoard);
  }, [BOARD_SIZE]);

  // Check for matches (3 or more in a row/column)
  const findMatches = useCallback((currentBoard: Tile[][]) => {
    const matches: Tile[] = [];
    
    // Check horizontal matches
    for (let row = 0; row < BOARD_SIZE; row++) {
      let count = 1;
      let currentType = currentBoard[row][0].type;
      
      for (let col = 1; col < BOARD_SIZE; col++) {
        if (currentBoard[row][col].type === currentType && !currentBoard[row][col].isMatched) {
          count++;
        } else {
          if (count >= 3) {
            for (let i = col - count; i < col; i++) {
              if (!currentBoard[row][i].isMatched) {
                matches.push(currentBoard[row][i]);
              }
            }
          }
          count = 1;
          currentType = currentBoard[row][col].type;
        }
      }
      
      if (count >= 3) {
        for (let i = BOARD_SIZE - count; i < BOARD_SIZE; i++) {
          if (!currentBoard[row][i].isMatched) {
            matches.push(currentBoard[row][i]);
          }
        }
      }
    }
    
    // Check vertical matches
    for (let col = 0; col < BOARD_SIZE; col++) {
      let count = 1;
      let currentType = currentBoard[0][col].type;
      
      for (let row = 1; row < BOARD_SIZE; row++) {
        if (currentBoard[row][col].type === currentType && !currentBoard[row][col].isMatched) {
          count++;
        } else {
          if (count >= 3) {
            for (let i = row - count; i < row; i++) {
              if (!currentBoard[i][col].isMatched) {
                matches.push(currentBoard[i][col]);
              }
            }
          }
          count = 1;
          currentType = currentBoard[row][col].type;
        }
      }
      
      if (count >= 3) {
        for (let i = BOARD_SIZE - count; i < BOARD_SIZE; i++) {
          if (!currentBoard[i][col].isMatched) {
            matches.push(currentBoard[i][col]);
          }
        }
      }
    }
    
    return matches;
  }, [BOARD_SIZE]);

  // Handle tile selection and swapping
  const handleTileClick = useCallback((clickedTile: Tile) => {
    if (isProcessing || clickedTile.isMatched) return;

    if (selectedTiles.length === 0) {
      // First tile selection
      setSelectedTiles([clickedTile]);
      setBoard(prev => prev.map(row => 
        row.map(tile => 
          tile.id === clickedTile.id 
            ? { ...tile, isSelected: true }
            : { ...tile, isSelected: false }
        )
      ));
    } else if (selectedTiles.length === 1) {
      const firstTile = selectedTiles[0];
      
      // Check if tiles are adjacent
      const isAdjacent = (
        (Math.abs(firstTile.row - clickedTile.row) === 1 && firstTile.col === clickedTile.col) ||
        (Math.abs(firstTile.col - clickedTile.col) === 1 && firstTile.row === clickedTile.row)
      );
      
      if (isAdjacent && firstTile.id !== clickedTile.id) {
        // Swap tiles
        setIsProcessing(true);
        
        setBoard(prev => {
          const newBoard = prev.map(row => [...row]);
          const temp = { ...newBoard[firstTile.row][firstTile.col] };
          
          newBoard[firstTile.row][firstTile.col] = {
            ...newBoard[clickedTile.row][clickedTile.col],
            row: firstTile.row,
            col: firstTile.col,
            isSelected: false
          };
          
          newBoard[clickedTile.row][clickedTile.col] = {
            ...temp,
            row: clickedTile.row,
            col: clickedTile.col,
            isSelected: false
          };
          
          return newBoard;
        });
        
        setSelectedTiles([]);
        
        // Check for matches after a short delay
        setTimeout(() => {
          checkForMatches();
        }, 300);
      } else {
        // Select new tile
        setSelectedTiles([clickedTile]);
        setBoard(prev => prev.map(row => 
          row.map(tile => 
            tile.id === clickedTile.id 
              ? { ...tile, isSelected: true }
              : { ...tile, isSelected: false }
          )
        ));
      }
    }
  }, [selectedTiles, isProcessing]);

  // Check for matches and update board
  const checkForMatches = useCallback(() => {
    setBoard(currentBoard => {
      const matches = findMatches(currentBoard);
      
      if (matches.length > 0) {
        // Mark matches
        const newBoard = currentBoard.map(row =>
          row.map(tile => {
            const isMatch = matches.some(match => match.id === tile.id);
            return isMatch ? { ...tile, isMatched: true, isAnimating: true } : tile;
          })
        );
        
        // Update score
        const matchScore = matches.length * 10;
        setScore(prev => prev + matchScore);
        setMatchedCount(prev => prev + matches.length);
        
        // Remove matched tiles and drop remaining tiles
        setTimeout(() => {
          setBoard(prevBoard => {
            const clearedBoard = prevBoard.map(row =>
              row.map(tile => tile.isMatched ? null : tile)
            );
            
            // Drop tiles down
            const droppedBoard: Tile[][] = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
            
            for (let col = 0; col < BOARD_SIZE; col++) {
              const columnTiles = clearedBoard.map(row => row[col]).filter(tile => tile !== null) as Tile[];
              
              // Fill from bottom
              for (let i = 0; i < columnTiles.length; i++) {
                const newRow = BOARD_SIZE - 1 - i;
                droppedBoard[newRow][col] = {
                  ...columnTiles[columnTiles.length - 1 - i],
                  row: newRow,
                  isAnimating: false,
                  isMatched: false
                };
              }
              
              // Fill empty spaces with new tiles
              for (let row = 0; row < BOARD_SIZE - columnTiles.length; row++) {
                const randomType = TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)];
                droppedBoard[row][col] = {
                  id: `${row}-${col}-${Date.now()}`,
                  type: randomType.type,
                  icon: randomType.icon,
                  row,
                  col,
                  isSelected: false,
                  isMatched: false,
                  isAnimating: false
                };
              }
            }
            
            return droppedBoard;
          });
          
          // Check for new matches
          setTimeout(() => {
            checkForMatches();
          }, 300);
        }, 500);
        
        return newBoard;
      } else {
        setIsProcessing(false);
        return currentBoard;
      }
    });
  }, [findMatches, BOARD_SIZE]);

  // Update progress
  useEffect(() => {
    const progress = Math.min((score / targetScore) * 100, 100);
    onProgress(progress);
    
    if (score >= targetScore) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [score, targetScore, onProgress, onComplete]);

  // Initialize board on mount
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      padding: '20px',
      backgroundColor: 'rgba(139, 69, 19, 0.9)',
      borderRadius: '15px',
      border: '3px solid #8B4513',
      maxWidth: isMobile ? '350px' : '500px',
      width: '100%'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h3 style={{
          color: '#FFD700',
          margin: '0 0 10px 0',
          fontSize: isMobile ? '18px' : '20px'
        }}>
          🎮 Match Tools & Crops
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '20px',
          fontSize: isMobile ? '12px' : '14px',
          color: '#FFF'
        }}>
          <span>Score: {score}/{targetScore}</span>
          <span>Matches: {matchedCount}</span>
        </div>
      </div>

      {/* Game Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        gap: '2px',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '10px'
      }}>
        {board.flat().map((tile) => (
          <div
            key={tile.id}
            onClick={() => handleTileClick(tile)}
            style={{
              width: isMobile ? '35px' : '45px',
              height: isMobile ? '35px' : '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: tile.isSelected ? '#FFD700' : tile.isMatched ? '#FF6B6B' : '#8FBC8F',
              border: tile.isSelected ? '2px solid #FF4500' : '1px solid #654321',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: isMobile ? '20px' : '24px',
              transition: 'all 0.3s ease',
              transform: tile.isAnimating ? 'scale(1.1)' : 'scale(1)',
              opacity: tile.isMatched ? 0.5 : 1,
              userSelect: 'none'
            }}
          >
            {tile.icon}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div style={{
        fontSize: isMobile ? '11px' : '12px',
        color: '#FFF',
        textAlign: 'center',
        opacity: 0.8,
        lineHeight: '1.4'
      }}>
        Tap adjacent tiles to swap them. Match 3+ tools or crops in a row to score points!
      </div>
    </div>
  );
}