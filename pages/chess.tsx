// pages/chess.tsx
import { useState, useCallback } from 'react';
import Head from 'next/head';
import ChessGame from '../components/ChessGame';

const ChessPage = () => {
  const [gameResult, setGameResult] = useState<'You' | 'AI' | 'Draw' | null>(null);
  const [statusMessage, setStatusMessage] = useState('Start the Chess Game');

  const handleGameOver = useCallback((result: 'You' | 'AI' | 'Draw') => {
    setGameResult(result);
    if (result === 'You') setStatusMessage('Checkmate! You Win! 🎉');
    else if (result === 'AI') setStatusMessage('Checkmated! You Lose. 😭');
    else setStatusMessage('Draw.');
  }, []);

  return (
    <>
      <Head>
        <title>Chess - Farcaster Games</title>
      </Head>

      <div className="chess-page-container">
        <h1 className="page-title">♟️ Chess vs AI ♚</h1>
        <p className="game-status">{statusMessage}</p>

        {/* ✅ Main Game Component */}
        <ChessGame onGameOver={handleGameOver} />

        <style jsx>{`
          .chess-page-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
            text-align: center;
            font-family: 'Inter', sans-serif;
            color: white;
            background-color: #1a0030;
          }
          .page-title {
            font-size: 2.2em;
            font-weight: bold;
            margin-bottom: 15px;
            color: #90CAF9;
          }
          .game-status {
            font-size: 1.1em;
            font-weight: 600;
            margin: 10px 0 20px 0;
            color: #E0B0FF;
          }
        `}</style>
      </div>
    </>
  );
};

export default ChessPage;
