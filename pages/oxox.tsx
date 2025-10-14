// pages/oxox.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/OXOXPage.module.css'; // MENGGUNAKAN CSS MODULES

// --- CONSTANTS ---
const GRID_SIZE = 5;
const WINNING_LENGTH = 4; // Win condition: 4 consecutive symbols (X or O)
const PLAYER_SYMBOL = '❌';
const AI_SYMBOL = '⭕';
const EMPTY_CELL = null;

// URL Frame Farcaster
const BASE_FRAME_URL = 'https://farcaster.xyz/miniapps/At9-eGqFG7q4/farcaster-games-hub'; 


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
  const [frameUrl, setFrameUrl] = useState<string>(''); // State baru untuk Frame URL
  
  
  useEffect(() => {
    setStatusMessage(`Your Turn (${PLAYER_SYMBOL})`);
  }, []);


  const resetGame = useCallback(() => {
    setBoard(initialBoard);
    setCurrentPlayer(PLAYER_SYMBOL);
    setWinner(null);
    setIsGameOver(false);
    setIsAITurn(false);
    setStatusMessage(`Your Turn (${PLAYER_SYMBOL})`);
    setFrameUrl(''); // Reset Frame URL
  }, [initialBoard]);


  // Logika penanganan status akhir game dan Frame URL
  const handleGameEnd = useCallback((newWinner: string | null, isFull: boolean) => {
    let resultText = '';
    if (newWinner) {
      setWinner(newWinner);
      setIsGameOver(true);
      resultText = newWinner === PLAYER_SYMBOL ? 'YOU_WON' : 'AI_WON';
      setStatusMessage(`Winner: ${newWinner}!`);
    } else if (isFull) {
      setIsGameOver(true);
      resultText = 'DRAW';
      setStatusMessage('Draw!');
    }

    if (resultText) {
      // Menetapkan Frame URL dengan hasil game baru
      const finalUrl = `${BASE_FRAME_URL}?status=${resultText}`;
      setFrameUrl(finalUrl);
    }
  }, []);

  
  // AI Logic (Simple: choose a random empty cell)
  const handleAIMove = useCallback(() => {
    if (isGameOver || winner || currentPlayer !== AI_SYMBOL) return;

    setStatusMessage('AI Turn (⭕)...');

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
        const isFull = isBoardFull(newBoard);

        if (newWinner || isFull) {
          handleGameEnd(newWinner, isFull);
        } else {
          setCurrentPlayer(PLAYER_SYMBOL);
          setStatusMessage(`Your Turn (${PLAYER_SYMBOL})`);
        }

        setIsAITurn(false);
        return newBoard;
      });
    }, 500); // 500ms delay
  }, [board, currentPlayer, isGameOver, winner, handleGameEnd]);


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
      const isFull = isBoardFull(newBoard);

      if (newWinner || isFull) {
        handleGameEnd(newWinner, isFull);
      } else {
        setCurrentPlayer(AI_SYMBOL);
        // Status message akan diperbarui oleh useEffect AI
      }

      return newBoard;
    });
  };
  
  // Dynamic style untuk grid (tetap inline karena menggunakan variabel GRID_SIZE)
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
  };


  return (
    <>
      <Head>
        <title>OXOX 5x5 - Farcaster Games</title>
      </Head>
      
      <div className={styles['oxox-container']}>
        
        <h1 className={styles['page-title']}>❌⭕ OXOX 5x5 vs AI ⭕❌</h1>
        
        <p className={styles['game-status']}>{statusMessage}</p>

        <div className={styles['oxox-grid']} style={gridStyle}>
          {board.flat().map((cell, index) => {
            const r = Math.floor(index / GRID_SIZE);
            const c = index % GRID_SIZE;
            const isClickable = !isGameOver && cell === EMPTY_CELL && currentPlayer === PLAYER_SYMBOL && !isAITurn;
            
            const cellClassName = `${styles['oxox-cell']} ${isClickable ? styles['oxox-cell-clickable'] : styles['oxox-cell-disabled']}`;

            return (
              <div 
                key={index}
                className={cellClassName}
                onClick={() => isClickable && handlePlayerMove(r, c)}
              >
                {cell}
              </div>
            );
          })}
        </div>

        {(isGameOver || winner) && (
          <div>
            <button 
              className={`${styles['base-button']} ${styles['play-again-button']}`}
              onClick={resetGame}
            >
              Play Again
            </button>

            {frameUrl && ( 
              <a
                href={`https://warpcast.com/~/compose?text=Saya%20bermain%20OXOX%205x5!%20Lihat%20hasil%20saya!&embeds[]=${frameUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles['base-button']} ${styles['share-button']}`}
              >
                Bagikan Frame
              </a>
            )}
          </div>
        )}
        
        <Link href="/" className={`${styles['base-button']} ${styles['home-link-button']}`}>
          Back to Main Menu
        </Link>

      </div>
    </>
  );
};

export default OXOXPage;