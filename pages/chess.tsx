// pages/chess.tsx
import { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ChessGame from '../components/ChessGame';

const ChessPage = () => {
  const [gameResult, setGameResult] = useState<'You' | 'AI' | 'Draw' | null>(null);
  const [statusMessage, setStatusMessage] = useState('Start the Chess Game');

  const handleGameOver = useCallback((result: 'You' | 'AI' | 'Draw') => {
    setGameResult(result);
    if (result === 'You') setStatusMessage('Checkmate! You won! 🎉');
    else if (result === 'AI') setStatusMessage('Checkmated! You lost. 😭');
    else setStatusMessage('Draw.');
  }, []);

  const resetGame = useCallback(() => {
    setGameResult(null);
    setStatusMessage('Start the Chess Game');
  }, []);

  return (
    <>
      <Head>
        <title>Chess - Farcaster Games</title>
      </Head>

      <div className="chess-page-container">
        <h1 className="page-title">♟️ Chess vs AI ♚</h1>
        <p className="game-status">{statusMessage}</p>

        <ChessGame onGameOver={handleGameOver} />

        {gameResult && (
          <button className="base-button new-game-button" onClick={resetGame}>
            Start New Game
          </button>
        )}

        <Link href="/" className="base-button home-link-button">
          Back to Main Menu
        </Link>

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
          .base-button {
            padding: 10px 20px;
            font-size: 1em;
            font-weight: bold;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 15px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            transition: background-color 0.3s, transform 0.1s;
          }
          .base-button:hover {
            transform: translateY(-1px);
          }
          .new-game-button {
            background-color: #E0B0FF;
            color: #1a0030;
          }
          .home-link-button {
            background-color: #90CAF9;
            color: #1a0030;
            text-decoration: none;
            display: block;
            width: fit-content;
            margin: 15px auto 0 auto;
          }
        `}</style>
      </div>
    </>
  );
};

export default ChessPage;
