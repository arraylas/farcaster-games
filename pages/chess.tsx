// pages/chess.tsx
import { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ChessGame from '../components/ChessGame'; 
import styles from '../styles/ChessPage.module.css'; // MENGGUNAKAN CSS MODULES

// Definisi Tipe Hasil Game
type GameResult = 'You' | 'AI' | 'Draw' | null;

const ChessPage = () => {
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Mulai Game Catur');
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true); // Untuk kontrol tema jika diperlukan

  const handleGameOver = useCallback((result: 'You' | 'AI' | 'Draw') => {
    setGameResult(result);
    if (result === 'You') {
      setStatusMessage('Checkmate! Anda menang! 🎉');
    } else if (result === 'AI') {
      setStatusMessage('Checkmated! Anda kalah. 😭');
    } else {
      setStatusMessage('Draw (Seri).');
    }
  }, []);

  const resetGame = useCallback(() => {
    setGameResult(null);
    setStatusMessage('Mulai Game Catur');
  }, []);

  return (
    <>
      <Head>
        <title>Chess - Farcaster Games</title>
      </Head>
      
      <div className={styles['chess-page-container']}> 
        
        <h1 className={styles['page-title']}>♟️ Chess vs AI ♚</h1>
        
        <p className={styles['game-status']}>{statusMessage}</p>

        <ChessGame 
          onGameOver={handleGameOver} 
          isDarkTheme={isDarkTheme}
        />

        {(gameResult !== null) && (
          <button 
            className={`${styles['base-button']} ${styles['new-game-button']}`}
            onClick={resetGame}
          >
            Start New Game
          </button>
        )}
        
        <Link href="/" className={`${styles['base-button']} ${styles['home-link-button']}`}>
          Back to Main Menu
        </Link>

      </div>
    </>
  );
};

export default ChessPage;