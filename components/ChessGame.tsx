'use client'; 

import React, { useState, useCallback, useEffect } from 'react';
// Pastikan import Square dari 'chess.js' sudah benar
import { Chess, Square } from 'chess.js'; 
import { Chessboard } from 'react-chessboard';

// Definisi Props untuk komunikasi dengan halaman induk
interface ChessGameProps {
  onGameOver: (result: 'You' | 'AI' | 'Draw') => void;
  isDarkTheme: boolean; // Diterima dari props
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

  // Memastikan perubahan state game dilakukan dengan aman
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
    // [PERBAIKAN 2] Menggunakan game_over()
    if (tempGame.isGameOver()) { 
      let result: 'You' | 'AI' | 'Draw';
      // [PERBAIKAN 2] Menggunakan in_checkmate()
      if (tempGame.isCheckmate()) { 
        // Jika giliran putih (w) yang checkmated, berarti hitam (AI) menang
        result = tempGame.turn() === 'w' ? 'AI' : 'You';
        setGameStatus(result === 'You' ? 'win' : 'lose');
      } else {
        result = 'Draw';
        setGameStatus('draw');
      }
      // Panggil handler dari halaman induk
      onGameOver(result); 
      return true;
    } 
    setGameStatus('playing');
    return false;
  }, [onGameOver]); 

  // Fungsi untuk memicu AI
  const handleAIMove = useCallback(() => {
    setIsLoading(true);
    
    // Simulasi berpikir
    setTimeout(() => {
        let aiMove = makeRandomMove(game);
        
        if (aiMove) {
            safeGameMutate((game) => {
                game.move(aiMove!);
            });
            // Cek status game setelah gerakan AI
            checkGameStatus(game.fen());
        }
        setIsLoading(false);
    }, 500); 
  }, [game, checkGameStatus]);

  // Handler saat pemain melakukan gerakan
  function onDrop(sourceSquare: Square, targetSquare: Square) {
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', 
      });
    });

    if (move === null) return false; // Gerakan tidak valid
    return true; // Gerakan valid (AI akan dipicu di useEffect)
  }

  // Effect untuk memicu gerakan AI dan mengatur Frame URL
  useEffect(() => {
    // 1. Pemicu Gerakan AI
    // Jika giliran AI (Hitam) dan game masih berjalan
    // [PERBAIKAN 2] Menggunakan game_over()
    if (game.turn() === 'b' && gameStatus === 'playing' && !game.isGameOver()) { 
      handleAIMove();
    }
    
    // 2. Mengatur URL Frame
    if (gameStatus !== 'playing') {
      let resultText = '';
      if (gameStatus === 'win') resultText = 'WIN';
      else if (gameStatus === 'lose') resultText = 'LOSE';
      else if (gameStatus === 'draw') resultText = 'DRAW';

      const baseFrameUrl = 'https://farcaster.xyz/miniapps/9HwP06is7xxa/farcaster-achievement';
      
      const finalUrl = `${baseFrameUrl}?status=${resultText}`; 
      setFrameUrl(finalUrl);
    }
    
  }, [game.turn, gameStatus, game.fen, handleAIMove]); 

  return (
    <div className="flex flex-col items-center">
      <div style={{ pointerEvents: isLoading || gameStatus !== 'playing' ? 'none' : 'auto' }}>
        <Chessboard 
          // [PERBAIKAN 1] Properti 'id' telah dihapus
          position={game.fen()}
          onPieceDrop={onDrop}
          boardOrientation={boardOrientation as 'white' | 'black'}
          arePiecesDraggable={gameStatus === 'playing' && game.turn() === 'w' && !isLoading} 
        />
      </div>

      <p style={{ marginTop: '10px', color: isLoading ? '#FFD700' : 'white' }}>
        {gameStatus === 'playing' ? (isLoading ? 'AI sedang berpikir...' : 'Giliran Anda (Putih)') : ''}
      </p>
      
      {/* Tampilkan tombol Share jika Game Over */}
      {gameStatus !== 'playing' && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#4A148C', borderRadius: '10px' }}>
          <h3 style={{ color: '#FFD700', marginBottom: '10px' }}>Pencapaian Farcaster!</h3>
          <a
            href={`https://warpcast.com/~/compose?text=Saya%20${gameStatus.toUpperCase()}%20melawan%20AI%20Catur%20Acak!%20Lihat%20pencapaian%20saya!&embeds[]=${frameUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                padding: '10px 20px',
                backgroundColor: '#7C4DFF', // Warna Warpcast
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '999px',
                textDecoration: 'none',
                display: 'inline-block'
            }}
          >
            Bagikan Frame
          </a>
        </div>
      )}

    </div>
  );
}