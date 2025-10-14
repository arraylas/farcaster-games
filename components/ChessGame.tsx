// components/ChessGame.tsx
'use client'; 

import React, { useState, useCallback, useEffect, CSSProperties } from 'react';
import { Chess, Square } from 'chess.js'; 
import { Chessboard } from 'react-chessboard';
import './ChessGame.css'; // Pastikan file ini ada

// --- WARNA UNTUK KOTAK CATUR ---
const LIGHT_SQUARE_COLOR = '#90CAF9'; // Light Blue/Cyan
const DARK_SQUARE_COLOR = '#5e35b1'; // Darker Purple

// Definisi Props
interface ChessGameProps {
  onGameOver: (result: 'You' | 'AI' | 'Draw') => void;
  isDarkTheme: boolean; 
}

type GameStatus = 'playing' | 'win' | 'lose' | 'draw';

// AI Acak (Beginner Level)
const makeRandomMove = (gameInstance: Chess): string | null => {
    const possibleMoves = gameInstance.moves();
    if (possibleMoves.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    return possibleMoves[randomIndex];
};


export default function ChessGame({ onGameOver, isDarkTheme }: ChessGameProps) {
  const [game, setGame] = useState(new Chess());
  const [boardOrientation] = useState('white');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isLoading, setIsLoading] = useState(false);
  const [frameUrl, setFrameUrl] = useState('');

  // Memastikan perubahan state game dilakukan dengan aman dan imutabel
  function safeGameMutate(modify: (game: Chess) => void) {
    setGame((g) => {
      const newGame = new Chess(g.fen()); 
      modify(newGame);
      return newGame;
    });
  }
  
  // Fungsi pengecekan status akhir game
  const checkGameStatus = useCallback((fen: string) => {
    const tempGame = new Chess(fen);
    
    if (tempGame.isGameOver()) { 
      let result: 'You' | 'AI' | 'Draw';

      if (tempGame.isCheckmate()) { 
        result = tempGame.turn() === 'w' ? 'AI' : 'You';
        setGameStatus(result === 'You' ? 'win' : 'lose');
      } else if (tempGame.isStalemate() || tempGame.isThreefoldRepetition() || tempGame.isInsufficientMaterial()) {
        result = 'Draw';
        setGameStatus('draw');
      } else {
        result = 'Draw';
        setGameStatus('draw');
      }

      onGameOver(result); 
      return true;
    } 
    setGameStatus('playing');
    return false;
  }, [onGameOver]); 

  // Fungsi untuk memicu AI
  const handleAIMove = useCallback(() => {
    setIsLoading(true);
    
    // Delay untuk simulasi berpikir
    setTimeout(() => {
        let aiMove = makeRandomMove(game);
        
        if (aiMove) {
            safeGameMutate((game) => {
                game.move(aiMove!);
            });
            checkGameStatus(game.fen());
        }
        setIsLoading(false);
    }, 500); 
  }, [game, checkGameStatus]);

  // Handler saat pemain melakukan gerakan
  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (gameStatus !== 'playing' || isLoading) return false;
    
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });
    });

    if (move === null) return false;
    
    checkGameStatus(game.fen());
    
    return true;
  }

  // Effect untuk memicu gerakan AI dan mengatur Frame URL
  useEffect(() => {
    if (game.turn() === 'b' && gameStatus === 'playing' && !game.isGameOver() && !isLoading) { 
      handleAIMove();
    }
    
    if (gameStatus !== 'playing') {
      let resultText = '';
      if (gameStatus === 'win') resultText = 'WIN';
      else if (gameStatus === 'lose') resultText = 'LOSE';
      else if (gameStatus === 'draw') resultText = 'DRAW';

      // --- PERUBAHAN DI SINI ---
      const baseFrameUrl = 'https://farcaster.xyz/miniapps/At9-eGqFG7q4/farcaster-games-hub'; 
      
      const finalUrl = `${baseFrameUrl}?status=${resultText}`; 
      setFrameUrl(finalUrl);
    }
    
  }, [game.turn, gameStatus, game.fen, handleAIMove, isLoading]); 

  // --- STYLE KUSTOM UNTUK KOMPONEN CHESSBOARD (HARUS INLINE DENGAN 'as any') ---
  const customBoardStyle = {
    borderRadius: '8px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
    width: 'min(95vw, 450px)', 
  } as any; 
  
  const customDarkSquareStyle = { backgroundColor: DARK_SQUARE_COLOR } as any; 
  const customLightSquareStyle = { backgroundColor: LIGHT_SQUARE_COLOR } as any; 


  return (
    <div className="chess-game-container">
      <div style={{ pointerEvents: isLoading || gameStatus !== 'playing' ? 'none' : 'auto' }}>
        <Chessboard 
          position={game.fen()}
          onPieceDrop={onDrop}
          boardOrientation={boardOrientation as 'white' | 'black'}
          arePiecesDraggable={gameStatus === 'playing' && game.turn() === 'w' && !isLoading} 
          
          // Menerapkan style kustom dengan perbaikan tipe
          customBoardStyle={customBoardStyle} 
          customDarkSquareStyle={customDarkSquareStyle}
          customLightSquareStyle={customLightSquareStyle}
        />
      </div>

      {/* Pesan Status. Warna dinamis tetap inline. */}
      <p className="status-message" style={{ color: isLoading ? '#FFD700' : 'white' }}>
        {gameStatus === 'playing' ? (isLoading ? 'AI sedang berpikir...' : 'Giliran Anda (Putih)') : ''}
      </p>
      
      {/* Tampilkan tombol Share jika Game Over */}
      {gameStatus !== 'playing' && (
        <div className="share-frame-container">
          <h3>Pencapaian Farcaster!</h3>
          <a
            href={`https://warpcast.com/~/compose?text=Saya%20${gameStatus.toUpperCase()}%20melawan%20AI%20Catur%20Acak!%20Lihat%20pencapaian%20saya!&embeds[]=${frameUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-button"
          >
            Bagikan Frame
          </a>
        </div>
      )}

    </div>
  );
}