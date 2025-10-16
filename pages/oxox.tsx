// pages/oxox.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 5;
const WINNING_LENGTH = 4;
const PLAYER_SYMBOL = '❌';
const AI_SYMBOL = '⭕';
const EMPTY_CELL = null;

const BASE_FRAME_URL = 'https://farcaster.xyz/miniapps/9HwP06is7xxa/farcaster-games-hub';

// --- GAME LOGIC ---
const checkWinner = (board: (string | null)[][]): string | null => {
  const size = GRID_SIZE;
  const len = WINNING_LENGTH;

  const checkLine = (r: number, c: number, dr: number, dc: number, symbol: string) => {
    for (let i = 0; i < len; i++) {
      const row = r + i * dr;
      const col = c + i * dc;
      if (row < 0 || row >= size || col < 0 || col >= size || board[row][col] !== symbol) {
        return false;
      }
    }
    return true;
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const symbol = board[r][c];
      if (!symbol) continue;

      if (c <= size - len && checkLine(r, c, 0, 1, symbol)) return symbol;
      if (r <= size - len && checkLine(r, c, 1, 0, symbol)) return symbol;
      if (r <= size - len && c <= size - len && checkLine(r, c, 1, 1, symbol)) return symbol;
      if (r <= size - len && c >= len - 1 && checkLine(r, c, 1, -1, symbol)) return symbol;
    }
  }

  return null;
};

const isBoardFull = (board: (string | null)[][]): boolean =>
  board.flat().every(cell => cell !== EMPTY_CELL);

const findBestMove = (board: (string | null)[][]): { r: number; c: number } | null => {
  const available: { r: number; c: number }[] = [];
  board.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (!cell) available.push({ r, c });
    })
  );

  if (available.length === 0) return null;

  for (const move of available) {
    const temp = board.map(row => [...row]);
    temp[move.r][move.c] = AI_SYMBOL;
    if (checkWinner(temp) === AI_SYMBOL) return move;
  }

  for (const move of available) {
    const temp = board.map(row => [...row]);
    temp[move.r][move.c] = PLAYER_SYMBOL;
    if (checkWinner(temp) === PLAYER_SYMBOL) return move;
  }

  const center = Math.floor(GRID_SIZE / 2);
  available.sort((a, b) => {
    const da = Math.abs(a.r - center) + Math.abs(a.c - center);
    const db = Math.abs(b.r - center) + Math.abs(b.c - center);
    return da - db;
  });

  return available[0];
};

const OXOXPage: NextPage = () => {
  const initialBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(EMPTY_CELL));

  const [board, setBoard] = useState<(string | null)[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<string>(PLAYER_SYMBOL);
  const [winner, setWinner] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isAITurn, setIsAITurn] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>(`Your Turn (${PLAYER_SYMBOL})`);
  const [frameUrl, setFrameUrl] = useState<string>('');

  const resetGame = useCallback(() => {
    setBoard(initialBoard);
    setCurrentPlayer(PLAYER_SYMBOL);
    setWinner(null);
    setIsGameOver(false);
    setIsAITurn(false);
    setStatusMessage(`Your Turn (${PLAYER_SYMBOL})`);
    setFrameUrl('');
  }, [initialBoard]);

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
      setFrameUrl(`${BASE_FRAME_URL}?status=${resultText}`);
    }
  }, []);

  const handleAIMove = useCallback(() => {
    if (isGameOver || winner || currentPlayer !== AI_SYMBOL) return;
    setStatusMessage('AI Thinking... 🤖');

    setTimeout(() => {
      setBoard(prevBoard => {
        const newBoard = prevBoard.map(row => [...row]);
        const move = findBestMove(newBoard);
        if (move) newBoard[move.r][move.c] = AI_SYMBOL;

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
    }, 600);
  }, [currentPlayer, isGameOver, winner, handleGameEnd]);

  useEffect(() => {
    if (currentPlayer === AI_SYMBOL && !isGameOver && !winner) {
      setIsAITurn(true);
      handleAIMove();
    }
  }, [currentPlayer, isGameOver, winner, handleAIMove]);

  const handlePlayerMove = (r: number, c: number) => {
    if (isGameOver || winner || board[r][c] !== EMPTY_CELL || currentPlayer !== PLAYER_SYMBOL || isAITurn) return;

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      newBoard[r][c] = PLAYER_SYMBOL;

      const newWinner = checkWinner(newBoard);
      const isFull = isBoardFull(newBoard);

      if (newWinner || isFull) {
        handleGameEnd(newWinner, isFull);
      } else {
        setCurrentPlayer(AI_SYMBOL);
      }

      return newBoard;
    });
  };

  return (
    <>
      <Head>
        <title>OXOX 5x5 - Farcaster Games</title>
      </Head>

      <div className="oxox-container">
        <h1 className="page-title">❌⭕ OXOX 5x5 vs AI ⭕❌</h1>
        <p className="game-status">{statusMessage}</p>

        <div className="oxox-grid">
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isClickable = !isGameOver && !cell && currentPlayer === PLAYER_SYMBOL && !isAITurn;
              const className = `oxox-cell ${isClickable ? 'oxox-cell-clickable' : ''}`;
              return (
                <div
                  key={`${r}-${c}`}
                  className={className}
                  onClick={() => isClickable && handlePlayerMove(r, c)}
                >
                  {cell}
                </div>
              );
            })
          )}
        </div>

        {/* ✅ Action Buttons dengan Emoji & Rapi */}
        {(isGameOver || winner) && (
          <div className="action-buttons">
            <button className="base-button play-again">🎮 Play Again</button>
            {frameUrl && (
              <a
                href={`https://warpcast.com/~/compose?text=I%20played%20OXOX%205x5!%20Check%20out%20my%20result!&embeds[]=${frameUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="base-button share-frame"
              >
                📸 Share Frame
              </a>
            )}
            <Link href="/" className="base-button back-hub">
              🏠 Back to Hub
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .oxox-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          text-align: center;
          font-family: 'Inter', sans-serif;
          color: white;
          background-color: #0f172a;
        }
        .page-title {
          font-size: 2em;
          font-weight: bold;
          margin-bottom: 10px;
          color: #38bdf8;
        }
        .game-status {
          font-size: 1.2em;
          font-weight: 600;
          margin: 15px 0;
          color: #c084fc;
        }
        .oxox-grid {
          display: grid;
          grid-template-columns: repeat(5, 60px);
          grid-template-rows: repeat(5, 60px);
          gap: 6px;
          justify-content: center;
          background-color: #1e293b;
          padding: 10px;
          border-radius: 10px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
        }
        .oxox-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8em;
          background-color: #334155;
          border-radius: 8px;
          user-select: none;
          transition: background-color 0.2s;
        }
        .oxox-cell-clickable {
          cursor: pointer;
          background-color: #475569;
        }
        .oxox-cell-clickable:hover {
          background-color: #64748b;
        }
        .action-buttons {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .base-button {
          padding: 12px 20px;
          font-size: 1em;
          font-weight: bold;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: background-color 0.3s, transform 0.1s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .base-button:active {
          transform: scale(0.97);
        }
        .play-again {
          background-color: #c084fc;
          color: white;
        }
        .share-frame {
          background-color: #7c4dff;
          color: white;
        }
        .back-hub {
          background-color: #38bdf8;
          color: #0f172a;
        }
      `}</style>
    </>
  );
};

export default OXOXPage;
