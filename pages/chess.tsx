// pages/chess.tsx
import { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ChessGame from '../components/ChessGame';

const BASE_FRAME_URL = 'https://farcaster.xyz/miniapps/9HwP06is7xxa/farcaster-games-hub';

const ChessPage = () => {
  const [gameResult, setGameResult] = useState<'You' | 'AI' | 'Draw' | null>(null);
  const [statusMessage, setStatusMessage] = useState('Start the Chess Game');
  const [frameUrl, setFrameUrl] = useState('');

  const handleGameOver = useCallback((result: 'You' | 'AI' | 'Draw') => {
    setGameResult(result);
    if (result === 'You') setStatusMessage('Checkmate! You Win! 🎉');
    else if (result === 'AI') setStatusMessage('Checkmated! You Lose. 😭');
    else setStatusMessage('Draw.');

    // ✅ Generate frame share URL
    const frame = `${BASE_FRAME_URL}?status=${result.toUpperCase()}`;
    setFrameUrl(frame);
  }, []);

  const resetGame = () => {
    setGameResult(null);
    setStatusMessage('Start the Chess Game');
    setFrameUrl('');
  };

  return (
    <>
      <Head>
        <title>Chess - Farcaster Games</title>
      </Head>

      <main className="flex flex-col items-center min-h-screen bg-[#1a0030] text-white p-6 text-center font-inter">
        <h1 className="text-3xl font-bold mb-4 text-sky-400">♟️ Chess vs AI ♚</h1>
        <p className="text-lg mb-6 text-purple-200">{statusMessage}</p>

        {/* ✅ Main Game Component */}
        <ChessGame onGameOver={handleGameOver} />

        {/* ✅ Result + Buttons */}
        {gameResult && (
          <div className="action-buttons">
            <button className="base-button play-again" onClick={resetGame}>
              🔄 Play Again
            </button>

            {frameUrl && (
              <a
                href={`https://warpcast.com/~/compose?text=I%20played%20Chess%20vs%20AI!%20Result:%20${gameResult}%20♟️&embeds[]=${frameUrl}`}
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
      </main>

      <style jsx>{`
        .action-buttons {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .base-button {
          padding: 10px 18px;
          font-size: 1em;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          transition: background-color 0.3s, transform 0.1s;
          text-decoration: none;
          display: inline-block;
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

export default ChessPage;
