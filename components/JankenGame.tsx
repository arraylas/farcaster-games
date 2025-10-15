'use client';

import React, { useState } from 'react';

type Choice = 'Rock' | 'Paper' | 'Scissors';
type Result = 'You' | 'AI' | 'Draw';

export default function JankenGame() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [aiChoice, setAiChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const choices: { name: Choice; icon: string }[] = [
    { name: 'Rock', icon: '✊' },
    { name: 'Paper', icon: '✋' },
    { name: 'Scissors', icon: '✌️' },
  ];

  const getAIChoice = (): Choice => {
    const random = Math.floor(Math.random() * 3);
    return choices[random].name;
  };

  const determineWinner = (player: Choice, ai: Choice): Result => {
    if (player === ai) return 'Draw';
    if (
      (player === 'Rock' && ai === 'Scissors') ||
      (player === 'Paper' && ai === 'Rock') ||
      (player === 'Scissors' && ai === 'Paper')
    )
      return 'You';
    return 'AI';
  };

  const handleChoice = (choice: Choice) => {
    if (isPlaying) return;
    setIsPlaying(true);
    setPlayerChoice(choice);

    setTimeout(() => {
      const aiPick = getAIChoice();
      setAiChoice(aiPick);
      const gameResult = determineWinner(choice, aiPick);
      setResult(gameResult);
      setIsPlaying(false);
    }, 800);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setAiChoice(null);
    setResult(null);
  };

  return (
    <div className="janken-container">
      <h1 className="title">🪨 Rock Paper Scissors ✂️</h1>
      <p className="subtitle">Choose your hand!</p>

      <div className="choices">
        {choices.map((choice) => (
          <button
            key={choice.name}
            className={`choice-button ${
              playerChoice === choice.name ? 'selected' : ''
            }`}
            onClick={() => handleChoice(choice.name)}
            disabled={isPlaying}
          >
            <span className="icon">{choice.icon}</span>
          </button>
        ))}
      </div>

      {result && (
        <div className="result-section">
          <p className="result-text">
            You chose <strong>{playerChoice}</strong> {choices.find(c => c.name === playerChoice)?.icon} <br />
            AI chose <strong>{aiChoice}</strong> {choices.find(c => c.name === aiChoice)?.icon}
          </p>
          <h2 className="outcome">
            {result === 'Draw'
              ? 'It’s a Draw 🤝'
              : result === 'You'
              ? 'You Win 🎉'
              : 'You Lose 💀'}
          </h2>

          <p className="share-text">If you like this game, just share it!</p>

          <a
            href={`https://warpcast.com/~/compose?text=I%20played%20Rock%20Paper%20Scissors%20on%20Farcaster!%20I%20${result === 'Draw' ? 'tied' : result === 'You' ? 'won' : 'lost'}!%20Try%20it%20too!`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-button"
          >
            Share Frame
          </a>

          <button onClick={resetGame} className="new-game-button">
            Play Again
          </button>
        </div>
      )}

      <style jsx>{`
        .janken-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #1a0030;
          color: white;
          text-align: center;
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }

        .title {
          font-size: 2em;
          font-weight: bold;
          margin-bottom: 10px;
          color: #90caf9;
        }

        .subtitle {
          font-size: 1.1em;
          margin-bottom: 20px;
          color: #e0b0ff;
        }

        .choices {
          display: flex;
          justify-content: center;
          gap: 25px;
          margin-bottom: 25px;
        }

        .choice-button {
          font-size: 3em;
          background: none;
          border: 3px solid #90caf9;
          border-radius: 16px;
          padding: 15px 25px;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .choice-button:hover {
          transform: scale(1.1);
          background-color: rgba(144, 202, 249, 0.15);
        }

        .choice-button.selected {
          background-color: rgba(144, 202, 249, 0.25);
          transform: scale(1.1);
        }

        .result-section {
          margin-top: 20px;
        }

        .result-text {
          font-size: 1.2em;
          margin-bottom: 10px;
          color: #e0b0ff;
        }

        .outcome {
          font-size: 1.8em;
          margin: 10px 0 20px;
        }

        .share-text {
          font-size: 1em;
          color: #ffffffb3;
          margin-bottom: 10px;
        }

        .share-button {
          display: inline-block;
          background-color: #7c4dff;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          transition: all 0.2s;
        }

        .share-button:hover {
          opacity: 0.9;
        }

        .new-game-button {
          margin-top: 15px;
          background-color: #e0b0ff;
          color: #1a0030;
          font-weight: bold;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          transition: all 0.2s;
        }

        .new-game-button:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
