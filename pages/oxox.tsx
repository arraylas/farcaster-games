import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
// import { sdk } from '@farcaster/miniapp-sdk'; // Uncomment this if you want to use Farcaster SDK functions on this page

// --- CONSTANTS ---
const GRID_SIZE = 5;
const WINNING_LENGTH = 4; // Win condition: 4 consecutive symbols (X or O)
const PLAYER_SYMBOL = '❌';
const AI_SYMBOL = '⭕';
const EMPTY_CELL = null;
const BACKGROUND_COLOR = '#300050'; // Dark Purple

// --- STYLE OBJECTS (Inline Styles for consistency) ---

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '20px',
  textAlign: 'center',
  fontFamily: 'Inter, sans-serif',
  color: 'white',
  backgroundColor: BACKGROUND_COLOR,
};

const titleStyle: React.CSSProperties = {
  fontSize: '2em',
  fontWeight: 'bold',
  marginBottom: '10px',
  color: '#90CAF9',
};

const statusStyle: React.CSSProperties = {
  fontSize: '1.2em',
  fontWeight: '600',
  margin: '15px 0',
  color: '#E0B0FF',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
  gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
  gap: '4px',
  width: 'min(95vw, 400px)', // Responsive, max 400px
  height: 'min(95vw, 400px)',
  aspectRatio: '1 / 1',
  backgroundColor: '#1a0030', // Dark border
  padding: '5px',
  borderRadius: '10px',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
  // *** PENAMBAHAN PENTING UNTUK FIX LAYOUT ***
  boxSizing: 'border-box', 
};

const cellStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5em',
  backgroundColor: '#3a065f',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  userSelect: 'none',
  // *** PENAMBAHAN PENTING UNTUK FIX LAYOUT ***
  width: '100%', 
  height: '100%',
};

const disabledCellStyle: React.CSSProperties = {
  ...cellStyle,
  cursor: 'default',
  opacity: 0.8,
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: '1em',
  fontWeight: 'bold',
  color: BACKGROUND_COLOR, // Menggunakan BACKGROUND_COLOR yang sudah didefinisikan
  backgroundColor: '#E0B0FF',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '20px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  transition: 'background-color 0.3s, transform 0.1s',
};

const homeLinkStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#90CAF9',
  color: BACKGROUND_COLOR,
  textDecoration: 'none',
  display: 'block',
  width: 'fit-content',
  margin: '15px auto 0 auto', // Centering the link button
};


// --- GAME LOGIC FUNCTIONS ---

/**
 * Checks for 4 consecutive symbols (horizontal, vertical, diagonal).
 * @param board 2D Array (GRID_SIZE x GRID_SIZE)
 * @returns 'X', 'O', or null
 */
const checkWinner = (board: (string | null)[][]): string | null => {
    if (!board || board.length === 0) return null;

    const size = GRID_SIZE;
    const len = WINNING_LENGTH;

    // Helper function to check lines
    const checkLine = (r: number, c: number, dr: number, dc: number, symbol: string): boolean => {
        for (let i = 0; i < len; i++) {
            const row = r + i * dr;
            const col = c + i * dc;
            if (row < 0 || row >= size || col < 0 || col >= size || board[row][col] !== symbol) {
                return false;
            }
        }
        return true;
    };

    // Iterate through every cell
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const symbol = board[r][c];
            if (symbol === EMPTY_CELL) continue;

            // 1. Horizontal
            if (c <= size - len && checkLine(r, c, 0, 1, symbol)) return symbol;

            // 2. Vertical
            if (r <= size - len && checkLine(r, c, 1, 0, symbol)) return symbol;

            // 3. Diagonal Right-Down
            if (r <= size - len && c <= size - len && checkLine(r, c, 1, 1, symbol)) return symbol;

            // 4. Diagonal Left-Down
            if (r <= size - len && c >= len - 1 && checkLine(r, c, 1, -1, symbol)) return symbol;
        }
    }

    return null;
};

/**
 * Checks if the board is full (draw).
 * @param board 2D Array
 * @returns boolean
 */
const isBoardFull = (board: (string | null)[][]): boolean => {
  return board.flat().every(cell => cell !== EMPTY_CELL);
};


// --- PAGE COMPONENT ---
const OXOXPage: NextPage = () => {
  const initialBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(EMPTY_CELL));
  
  const [board, setBoard] = useState<(string | null)[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<string>(PLAYER_SYMBOL);
  const [winner, setWinner] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isAITurn, setIsAITurn] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Your Turn (❌)');

  
  // MiniApp ready signal (Important for Farcaster)
  useEffect(() => {
    // if (typeof sdk !== 'undefined') {
    //   sdk.actions.ready().then(() => console.log('MiniApp OXOX ready!'));
    // }
    setStatusMessage(`Your Turn (${PLAYER_SYMBOL})`);
  }, []);


  const resetGame = useCallback(() => {
    setBoard(initialBoard);
    setCurrentPlayer(PLAYER_SYMBOL);
    setWinner(null);
    setIsGameOver(false);
    setIsAITurn(false);
    setStatusMessage(`Your Turn (${PLAYER_SYMBOL})`);
  }, [initialBoard]);

  
  // AI Logic (Simple: choose a random empty cell)
  const handleAIMove = useCallback(() => {
    if (isGameOver || winner || currentPlayer !== AI_SYMBOL) return;

    setStatusMessage('AI Turn (⭕)...');

    // Add a small delay to simulate AI 'thinking'
    const availableMoves: { r: number, c: number }[] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (board[r][c] === EMPTY_CELL) {
          availableMoves.push({ r, c });
        }
      }
    }

    if (availableMoves.length === 0) return;

    const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    
    setTimeout(() => {
      setBoard(prevBoard => {
        const newBoard = prevBoard.map(row => [...row]);
        newBoard[move.r][move.c] = AI_SYMBOL;
        
        const newWinner = checkWinner(newBoard);

        if (newWinner) {
          setWinner(newWinner);
          setIsGameOver(true);
          setStatusMessage(`Winner: ${newWinner}!`);
        } else if (isBoardFull(newBoard)) {
          setIsGameOver(true);
          setStatusMessage('Draw!');
        } else {
          setCurrentPlayer(PLAYER_SYMBOL);
          setStatusMessage(`Your Turn (${PLAYER_SYMBOL})`);
        }

        setIsAITurn(false);
        return newBoard;
      });
    }, 500); // 500ms delay
  }, [board, currentPlayer, isGameOver, winner]);


  // Trigger AI move after player's turn
  useEffect(() => {
    if (currentPlayer === AI_SYMBOL && !isGameOver && !winner) {
      setIsAITurn(true);
      handleAIMove();
    }
  }, [currentPlayer, isGameOver, winner, handleAIMove]);


  // Handle player's move
  const handlePlayerMove = (r: number, c: number) => {
    // Do not allow move if game is over, cell is occupied, or it's AI's turn
    if (isGameOver || winner || board[r][c] !== EMPTY_CELL || currentPlayer !== PLAYER_SYMBOL || isAITurn) {
      return; 
    }

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      newBoard[r][c] = PLAYER_SYMBOL;
      
      const newWinner = checkWinner(newBoard);

      if (newWinner) {
        setWinner(newWinner);
        setIsGameOver(true);
        setStatusMessage(`Winner: ${newWinner}!`);
      } else if (isBoardFull(newBoard)) {
        setIsGameOver(true);
        setStatusMessage('Draw!');
      } else {
        setCurrentPlayer(AI_SYMBOL);
        // Status message will be updated by useEffect for AI's turn
      }

      return newBoard;
    });
  };
  

  return (
    <>
      <Head>
        <title>OXOX 5x5 - Farcaster Games</title>
      </Head>
      <div style={containerStyle}>
        
        <h1 style={titleStyle}>❌⭕ OXOX 5x5 vs AI ⭕❌</h1>
        
        <p style={statusStyle}>{statusMessage}</p>

        <div style={gridStyle}>
          {board.flat().map((cell, index) => {
            const r = Math.floor(index / GRID_SIZE);
            const c = index % GRID_SIZE;
            const isClickable = !isGameOver && cell === EMPTY_CELL && currentPlayer === PLAYER_SYMBOL && !isAITurn;

            return (
              <div 
                key={index}
                style={isClickable ? cellStyle : disabledCellStyle}
                onClick={() => isClickable && handlePlayerMove(r, c)}
              >
                {cell}
              </div>
            );
          })}
        </div>

        {(isGameOver || winner) && (
          <button 
            style={buttonStyle} 
            onClick={resetGame}
          >
            Play Again
          </button>
        )}
        
        <Link href="/" style={homeLinkStyle}>
          Back to Main Menu
        </Link>

      </div>
    </>
  );
};

export default OXOXPage;