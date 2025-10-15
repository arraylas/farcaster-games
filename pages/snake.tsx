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

  // 🎮 Handle Arrow Key Controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
      if (e.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
      if (e.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
      if (e.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction]);

  // 🐍 Main Game Loop
  useEffect(() => {
    if (isGameOver) return;

    gameLoop.current = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        if (direction === "UP") head.y -= 1;
        if (direction === "DOWN") head.y += 1;
        if (direction === "LEFT") head.x -= 1;
        if (direction === "RIGHT") head.x += 1;

        // Collision check
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

        // Eat food
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
    alert("🪄 Share feature coming soon to Farcaster!");
  };

  return (
    <>
      <Head>
        <title>Snake Game - Farcaster Games</title>
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-[#1a0030] text-white font-sans p-6">
        <h1 className="text-4xl font-extrabold mb-4 text-[#90CAF9]">🐍 Snake Game</h1>
        <p className="text-lg text-purple-300 mb-6">
          Use your arrow keys to move and eat the glowing food!
        </p>

        {/* 🧩 Game Grid */}
        <div
          className="grid border-4 border-purple-500 rounded-lg mb-6"
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

        {/* 🎯 Score Display */}
        <p className="text-xl font-semibold text-purple-200 mb-4">
          Score: {score}
        </p>

        {/* 🧠 Game Over Screen */}
        {isGameOver ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-2xl text-pink-400 font-bold">Game Over! 💀</p>

            <p className="text-purple-200 text-center">
              If you like this game, just share it!
            </p>

            <button
              onClick={shareFrame}
              className="bg-purple-400 hover:bg-purple-500 text-[#1a0030] font-bold py-2 px-6 rounded-lg shadow-lg transition"
            >
              Share Frame
            </button>

            <button
              onClick={resetGame}
              className="bg-pink-500 hover:bg-pink-600 text-[#1a0030] font-bold py-2 px-6 rounded-lg shadow-lg transition"
            >
              Play Again
            </button>

            <Link
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-[#1a0030] font-bold py-2 px-6 rounded-lg shadow-lg transition"
            >
              Back to Main Menu
            </Link>
          </div>
        ) : (
          <button
            onClick={resetGame}
            className="mt-2 bg-pink-500 hover:bg-pink-600 text-[#1a0030] font-bold py-2 px-6 rounded-lg shadow-lg transition"
          >
            Restart
          </button>
        )}
      </main>
    </>
  );
}
