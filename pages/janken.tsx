// pages/janken.tsx
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const choices = [
  { name: 'Rock', emoji: '✊' },
  { name: 'Paper', emoji: '✋' },
  { name: 'Scissors', emoji: '✌️' },
];

const BASE_FRAME_URL = 'https://farcaster.xyz/miniapps/9HwP06is7xxa/farcaster-games-hub';

export default function Janken() {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [aiChoice, setAiChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [frameUrl, setFrameUrl] = useState<string>('');

  const play = (choice: string) => {
    const ai = choices[Math.floor(Math.random() * choices.length)].name;
    setPlayerChoice(choice);
    setAiChoice(ai);

    let outcome = '';
    if (choice === ai) outcome = 'Draw';
    else if (
      (choice === 'Rock' && ai === 'Scissors') ||
      (choice === 'Paper' && ai === 'Rock') ||
      (choice === 'Scissors' && ai === 'Paper')
    )
      outcome = 'You Win';
    else outcome = 'You Lose';

    setResult(outcome);

    const status = outcome.replace(' ', '_').toUpperCase();
    setFrameUrl(`${BASE_FRAME_URL}?status=${status}`);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setAiChoice(null);
    setResult(null);
    setFrameUrl('');
  };

  return (
    <>
      <Head>
        <title>Rock Paper Scissors - Farcaster Games</title>
      </Head>

      <main className="flex flex-col items-center min-h-screen bg-[#1a0030] text-white p-6 text-center font-inter">
        <h1 className="text-3xl font-bold mb-4 text-sky-400">🪨 Rock Paper Scissors ✂️</h1>
        <p className="text-lg mb-6 text-purple-200">
          {playerChoice ? 'Result of your duel!' : 'Choose your hand!'}
        </p>

        {!playerChoice ? (
          <div className="flex justify-center space-x-6 mb-8">
            {choices.map((c) => (
              <button
                key={c.name}
                onClick={() => play(c.name)}
                className="text-6xl hover:scale-110 transition-transform duration-200"
              >
                {c.emoji}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-4">
              <p className="text-xl">
                You chose {playerChoice}{' '}
                {choices.find((c) => c.name === playerChoice)?.emoji}
              </p>
              <p className="text-xl">
                AI chose {aiChoice}{' '}
                {choices.find((c) => c.name === aiChoice)?.emoji}
              </p>
              <p className="text-2xl font-bold mt-4 text-purple-300">{result}</p>
            </div>

            {/* ✅ Action Buttons */}
            <div className="action-buttons">
              <button onClick={resetGame} className="base-button play-again">
                🎮 Play Again
              </button>

              {frameUrl && (
                <a
                  href={`https://warpcast.com/~/compose?text=I%20played%20Rock%20Paper%20Scissors!%20Result:%20${result}%20🪨✋✌️&embeds[]=${frameUrl}`}
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
          </>
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
}
