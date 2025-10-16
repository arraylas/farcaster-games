// pages/snake.tsx
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Cell = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Cell[] = [{ x: 10, y: 10 }];
const INITIAL_FOOD: Cell = { x: 5, y: 5 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Cell[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Cell>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const gameLoop = useRef<ReturnType<typeof setInterval> | null>(null);

  // Main game loop
  useEffect(() => {
    if (isGameOver) return;
    gameLoop.current = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        if (direction === "UP") head.y -= 1;
        if (direction === "DOWN") head.y += 1;
        if (direction === "LEFT") head.x -= 1;
        if (direction === "RIGHT") head.x += 1;

        // Collision detection
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE ||
          prev.some((cell) => cell.x === head.x && cell.y === head.y)
        ) {
          setIsGameOver(true);
          return prev;
        }

        let newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
          setScore((s) => s + 10);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => {
      if (gameLoop.current) clearInterval(gameLoop.current);
    };
  }, [direction, food, isGameOver]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection("RIGHT");
    setScore(0);
    setIsGameOver(false);
  };

  const shareFrame = () => {
    alert("🪄 Share feature coming soon!");
  };

  return (
    <>
      <Head>
        <title>🐍 Snake Game - Farcaster Games</title>
      </Head>

      <main className="flex flex-col items-center min-h-screen bg-[#1a0030] text-white p-6 text-center font-inter">
        <h1 className="text-3xl font-bold mb-3 text-sky-400">🐍 Snake Game</h1>
        <p className="text-lg text-purple-200 mb-4">Touch the arrows to move!</p>

        {/* Game Grid */}
        <div
          className="grid border-4 border-purple-500 rounded-lg mb-4"
          style={{
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: "90vw",
            maxWidth: "400px",
            aspectRatio: "1 / 1",
            backgroundColor: "#220044",
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={index}
                className={`border border-[#2e004e] ${
                  isHead
                    ? "bg-green-400 shadow-[0_0_10px_#00ff99]"
                    : isSnake
                    ? "bg-green-700"
                    : isFood
                    ? "bg-pink-400 shadow-[0_0_10px_#ff66cc]"
                    : "bg-transparent"
                }`}
              />
            );
          })}
        </div>

        {/* Score & Game Over */}
        <p className="text-xl font-semibold text-purple-200 mt-2">
          Score: {score}
        </p>
        {isGameOver && (
          <div className="mt-1 text-lg font-bold text-red-400">
            Game Over 💀
          </div>
        )}

        {/* D-Pad Controls (Touch Only) */}
        <div className="flex flex-col items-center mt-4">
          {/* Up */}
          <button
            onClick={() => setDirection("UP")}
            className="bg-green-600 hover:bg-green-700 active:scale-95 p-4 rounded-lg text-2xl"
          >
            ⬆️
          </button>

          {/* Middle row: Left + Right */}
          <div className="flex justify-center gap-4 mt-1">
            <button
              onClick={() => setDirection("LEFT")}
              className="bg-green-600 hover:bg-green-700 active:scale-95 p-4 rounded-lg text-2xl"
            >
              ⬅️
            </button>
            <button
              onClick={() => setDirection("RIGHT")}
              className="bg-green-600 hover:bg-green-700 active:scale-95 p-4 rounded-lg text-2xl"
            >
              ➡️
            </button>
          </div>

          {/* Down */}
          <button
            onClick={() => setDirection("DOWN")}
            className="bg-green-600 hover:bg-green-700 active:scale-95 p-4 rounded-lg text-2xl mt-1"
          >
            ⬇️
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-3 mt-6">
          <button onClick={resetGame} className="bg-purple-500 hover:bg-purple-600 py-2 px-5 rounded-lg font-bold">
            🔄 Play Again
          </button>
          <button onClick={shareFrame} className="bg-pink-500 hover:bg-pink-600 py-2 px-5 rounded-lg font-bold">
            🔗 Share Frame
          </button>
          <Link
            href="/"
            className="bg-blue-500 hover:bg-blue-600 py-2 px-5 rounded-lg font-bold"
          >
            🏠 Back to Hub
          </Link>
        </div>
      </main>
    </>
  );
}
