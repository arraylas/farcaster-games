'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Chess, Move, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';

interface Props {
  onGameOver: (result: 'You' | 'AI' | 'Draw') => void;
}

const DARK_SQUARE = '#5e35b1';
const LIGHT_SQUARE = '#90CAF9';

// 🧠 Simple random AI
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
      return true;
    },
    [onGameOver]
  );

  const handleAIMove = useCallback(() => {
    if (game.isGameOver()) return;

    setIsThinking(true);
    setTimeout(() => {
      const tempGame = new Chess(game.fen());
      const aiMove = getAIMove(tempGame);

      if (aiMove) {
        const moveResult = tempGame.move(aiMove);
        if (moveResult) {
          setGame(new Chess(tempGame.fen()));
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
      `}</style>
    </div>
  );
}
