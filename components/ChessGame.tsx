// components/ChessGame.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Chess, Move, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';

interface Props {
  onGameOver: (result: 'You' | 'AI' | 'Draw') => void;
}

const DARK_SQUARE = '#5e35b1';
const LIGHT_SQUARE = '#90CAF9';

// 🧠 Simple random AI (avoids illegal moves)
const getAIMove = (game: Chess): Move | null => {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  const captures = moves.filter((m) => m.flags.includes('c'));
  const moveList = captures.length > 0 ? captures : moves;

  return moveList[Math.floor(Math.random() * moveList.length)];
};

export default function ChessGame({ onGameOver }: Props) {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState<'playing' | 'win' | 'lose' | 'draw'>('playing');
  const [isThinking, setIsThinking] = useState(false);
  const [frameUrl, setFrameUrl] = useState('');

  const safeMutate = (fn: (g: Chess) => void) => {
    setGame((prev) => {
      const copy = new Chess(prev.fen());
      fn(copy);
      return copy;
    });
  };

  const checkEnd = useCallback(
    (fen: string) => {
      const temp = new Chess(fen);
      if (!temp.isGameOver()) return false;

      let result: 'You' | 'AI' | 'Draw' = 'Draw';
      if (temp.isCheckmate()) result = temp.turn() === 'w' ? 'AI' : 'You';
      else if (
        temp.isStalemate() ||
        temp.isThreefoldRepetition() ||
        temp.isInsufficientMaterial()
      )
        result = 'Draw';

      setStatus(result === 'You' ? 'win' : result === 'AI' ? 'lose' : 'draw');
      onGameOver(result);

      const baseUrl = 'https://farcaster.xyz/miniapps/At9-eGqFG7q4/farcaster-games-hub';
      const finalUrl = `${baseUrl}?status=${result.toUpperCase()}`;
      setFrameUrl(finalUrl);
      return true;
    },
    [onGameOver]
  );

  const handleAIMove = useCallback(() => {
    if (game.isGameOver()) return;

    setIsThinking(true);
    setTimeout(() => {
      const tempGame = new Chess(game.fen()); // clone for AI calculation
      const aiMove = getAIMove(tempGame);

      if (aiMove) {
        const moveResult = tempGame.move(aiMove);
        if (moveResult) {
          setGame(new Chess(tempGame.fen())); // apply only if valid
          checkEnd(tempGame.fen());
        } else {
          console.warn('Skipped invalid AI move:', aiMove);
        }
      }
      setIsThinking(false);
    }, 600);
  }, [game, checkEnd]);

  function onDrop(source: Square, target: Square) {
    if (status !== 'playing' || isThinking) return false;

    const move = game.move({ from: source, to: target, promotion: 'q' });
    if (!move) return false;

    setGame(new Chess(game.fen()));

    if (!checkEnd(game.fen())) handleAIMove();
    return true;
  }

  useEffect(() => {
    if (game.turn() === 'b' && status === 'playing' && !isThinking) handleAIMove();
  }, [game, status, handleAIMove, isThinking]);

  const resetGame = () => {
    setGame(new Chess());
    setStatus('playing');
    setFrameUrl('');
  };

  return (
    <div className="chess-game-container">
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        arePiecesDraggable={!isThinking && status === 'playing' && game.turn() === 'w'}
        boardOrientation="white"
        customBoardStyle={{
          borderRadius: '8px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
          width: 'min(95vw, 450px)',
        }}
        customLightSquareStyle={{ backgroundColor: LIGHT_SQUARE }}
        customDarkSquareStyle={{ backgroundColor: DARK_SQUARE }}
      />

      <p className="status-msg" style={{ color: isThinking ? '#FFD700' : 'white' }}>
        {status === 'playing'
          ? isThinking
            ? 'AI is thinking...'
            : 'Your move (White)'
          : ''}
      </p>

      {status !== 'playing' && (
        <div className="share-frame">
          <h3>If you like this game, just share it!</h3>

          <a
            href={`https://warpcast.com/~/compose?text=I%20${status.toUpperCase()}%20against%20AI!%20Check%20it%20out!&embeds[]=${frameUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-button"
          >
            Share Frame
          </a>

          <div className="button-group">
            <button className="base-button new-game" onClick={resetGame}>
              Start New Game
            </button>
            <a href="/" className="base-button home-link">
              Back to Main Menu
            </a>
          </div>
        </div>
      )}

      <style jsx>{`
        .chess-game-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .status-msg {
          margin-top: 10px;
          font-size: 1.1em;
          font-weight: 500;
        }
        .share-frame {
          margin-top: 30px;
          text-align: center;
        }
        .share-frame h3 {
          margin-bottom: 16px;
          color: #b388ff;
        }
        .share-button {
          background-color: #7c4dff;
          color: white;
          padding: 10px 18px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          display: inline-block;
          margin-bottom: 20px; /* ✅ space below share button */
        }
        .button-group {
          display: flex;
          flex-direction: column;
          gap: 12px; /* ✅ adds space between the two buttons */
          align-items: center;
        }
        .base-button {
          padding: 10px 18px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          width: fit-content;
        }
        .new-game {
          background-color: #e0b0ff;
          color: #1a0030;
        }
        .home-link {
          background-color: #90caf9;
          color: #1a0030;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
