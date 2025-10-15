'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';

interface Props {
  onGameOver: (result: 'You' | 'AI' | 'Draw') => void;
}

const DARK_SQUARE = '#5e35b1';
const LIGHT_SQUARE = '#90CAF9';

// Slightly smarter AI — prioritizes capturing moves
const getAIMove = (game: Chess): string | null => {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  const captureMoves = moves.filter((m) => m.flags.includes('c'));
  const moveList = captureMoves.length > 0 ? captureMoves : moves;
  const randomMove = moveList[Math.floor(Math.random() * moveList.length)];
  return randomMove.san;
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
      const test = new Chess(fen);
      if (!test.isGameOver()) return false;

      let result: 'You' | 'AI' | 'Draw' = 'Draw';
      if (test.isCheckmate()) result = test.turn() === 'w' ? 'AI' : 'You';
      else if (
        test.isStalemate() ||
        test.isThreefoldRepetition() ||
        test.isInsufficientMaterial()
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
      const aiMove = getAIMove(game);
      if (aiMove) {
        safeMutate((g) => g.move(aiMove));
        checkEnd(game.fen());
      }
      setIsThinking(false);
    }, 600);
  }, [game, checkEnd]);

  function onDrop(source: Square, target: Square) {
    if (status !== 'playing' || isThinking) return false;
    let move = null;

    safeMutate((g) => {
      move = g.move({ from: source, to: target, promotion: 'q' });
    });

    if (!move) return false;

    if (!checkEnd(game.fen())) handleAIMove();
    return true;
  }

  useEffect(() => {
    if (game.turn() === 'b' && status === 'playing' && !isThinking) handleAIMove();
  }, [game, status, handleAIMove, isThinking]);

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
          <h3>Farcaster Achievement!</h3>
          <a
            href={`https://warpcast.com/~/compose?text=I%20${status.toUpperCase()}%20against%20AI!%20Check%20out%20my%20result!&embeds[]=${frameUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-button"
          >
            Share Frame
          </a>
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
          margin-top: 15px;
          text-align: center;
        }
        .share-button {
          background-color: #7c4dff;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
        .share-button:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
