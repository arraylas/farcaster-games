// pages/janken.tsx
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const choices = [
  { name: 'Rock', emoji: '✊' },
  { name: 'Paper', emoji: '✋' },
  { name: 'Scissors', emoji: '✌️' },
];

export default function Janken() {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [aiChoice, setAiChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const play = (choice: string) => {
    const ai = choices[Math.floor(Math.random() * choices.length)].name;
    setPlayerChoice(choice);
    setAiChoice(ai);

    if (choice === ai) setResult("It's a Draw 🤝");
    else if (
      (choice === 'Rock' && ai === 'Scissors') ||
      (choice === 'Paper' && ai === 'Rock') ||
      (choice === 'Scissors' && ai === 'Paper')
    )
      setResult('You Win 🎉');
    else setResult('You Lose 😭');
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setAiChoice(null);
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Rock Paper Scissors - Farcaster Games</title>
      </Head>

      <main className="flex flex-col items-center min-h-screen bg-[#1a0030] text-white p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">🪨 Rock Paper Scissors ✂️</h1>
        <p className="text-lg mb-6 text-purple-200">Choose your hand!</p>

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
          <div className="mt-6 space-y-4">
            <p className="text-xl">You chose {playerChoice} {choices.find(c => c.name === playerChoice)?.emoji}</p>
            <p className="text-xl">AI chose {aiChoice} {choices.find(c => c.name === aiChoice)?.emoji}</p>
            <p className="text-2xl font-bold mt-4 text-purple-300">{result}</p>

            <div className="mt-6">
              <p className="text-lg text-purple-200 mb-3">If you like this game, just share it!</p>

              <button
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200 mr-3"
              >
                Share Frame
              </button>

              <button
                onClick={resetGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200 ml-3"
              >
                Play Again
              </button>
            </div>

            {/* 🏠 Back to Main Menu */}
            <Link
              href="/"
              className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200"
            >
              Back to Main Menu
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
