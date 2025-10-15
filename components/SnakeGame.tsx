'use client';

import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

type Direction = { x: number; y: number };

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(getRandomPosition());
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const moveInterval = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile for showing buttons
  useEffect(() => {
    setIsMobile(window.innerWidth < 600);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isGameOver) return;
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 1) break;
          setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === -1) break;
          setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 1) break;
          setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === -1) break;
          setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [direction, isGameOver]);

  // Game loop
  useEffect(() => {
    if (isGameOver) return;
    moveInterval.current = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: (prevSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (prevSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        const hitSelf = prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y);
        if (hitSelf) {
          setIsGameOver(true);
          if (moveInterval.current) clearInterval(moveInterval.current);
          return prevSnake;
        }

        const ateFood = newHead.x === food.x && newHead.y === food.y;
        const newSnake = [newHead, ...prevSnake];
        if (!ateFood) newSnake.pop();
        else {
          setFood(getRandomPosition());
          setScore((s) => s + 1);
        }
        return newSnake;
      });
    }, 150);

    return () => {
      if (moveInterval.current) clearInterval(moveInterval.current);
    };
  }, [direction, food, isGameOver]);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomPosition());
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
  };

  const handleButton = (dir: Direction) => {
    if (isGameOver) return;
    setDirection(dir);
  };

  return (
    <div className="snake-container">
      <div className="score">Score: {score}</div>
      <div className="grid">
        {Array.from({ length: GRID_SIZE }).map((_, y) =>
          Array.from({ length: GRID_SIZE }).map((_, x) => {
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.some((seg) => seg.x === x && seg.y === y);
            const isFood = food.x === x && food.y === y;
            return (
              <div
                key={`${x}-${y}`}
                className={`cell ${
                  isHead ? 'head' : isBody ? 'body' : isFood ? 'food' : ''
                }`}
              />
            );
          })
        )}
      </div>

      {isGameOver && (
        <div className="overlay">
          <h2>Game Over 🐍</h2>
          <p>Your Score: {score}</p>
          <button onClick={restartGame}>Play Again</button>
          <a
            href={`https://warpcast.com/~/compose?text=I%20scored%20${score}%20in%20Snake!%20Try%20it%20on%20Farcaster%20Games!`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Share Frame
          </a>
        </div>
      )}

      {isMobile && !isGameOver && (
        <div className="controls">
          <button onClick={() => handleButton({ x: 0, y: -1 })}>⬆️</button>
          <div className="side-buttons">
            <button onClick={() => handleButton({ x: -1, y: 0 })}>⬅️</button>
            <button onClick={() => handleButton({ x: 1, y: 0 })}>➡️</button>
          </div>
          <button onClick={() => handleButton({ x: 0, y: 1 })}>⬇️</button>
        </div>
      )}

      <style jsx>{`
        .snake-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(${GRID_SIZE}, 1fr);
          grid-template-rows: repeat(${GRID_SIZE}, 1fr);
          width: min(90vw, 400px);
          height: min(90vw, 400px);
          background-color: #240046;
          border: 3px solid #7c4dff;
          border-radius: 12px;
          box-shadow: 0 0 25px rgba(124, 77, 255, 0.6);
          margin-bottom: 15px;
        }

        .cell {
          width: 100%;
          height: 100%;
        }

        .head {
          background-color: #90caf9;
          box-shadow: 0 0 10px #90caf9;
          border-radius: 4px;
        }

        .body {
          background-color: #64b5f6;
          border-radius: 2px;
        }

        .food {
          background-color: #e0b0ff;
          box-shadow: 0 0 8px #e0b0ff;
          border-radius: 50%;
        }

        .score {
          font-size: 1.2em;
          margin-bottom: 10px;
          color: #e0b0ff;
        }

        .overlay {
          position: absolute;
          top: 30%;
          background-color: rgba(20, 0, 30, 0.9);
          padding: 20px 30px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 0 15px rgba(224, 176, 255, 0.4);
        }

        .overlay button,
        .overlay a {
          display: block;
          margin: 10px auto;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          background-color: #7c4dff;
          color: white;
          text-decoration: none;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
        }

        .controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .side-buttons {
          display: flex;
          gap: 60px;
        }

        .controls button {
          font-size: 1.8em;
          background-color: #7c4dff;
          color: white;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          box-shadow: 0 0 10px rgba(124, 77, 255, 0.7);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
