// pages/2048.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const GRID_SIZE = 4;

const getEmptyGrid = () =>
  Array(GRID_SIZE)
    .fill(0)
    .map(() => Array(GRID_SIZE).fill(0));

const getRandomInt = (max: number) => Math.floor(Math.random() * max);
const cloneGrid = (grid: number[][]) => grid.map((row) => [...row]);

export default function Game2048() {
  const [grid, setGrid] = useState<number[][]>(getEmptyGrid());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const newGrid = getEmptyGrid();
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(cloneGrid(newGrid));
  }, []);

  const addRandomTile = (grid: number[][]) => {
    const emptyCells: [number, number][] = [];
    grid.forEach((row, r) =>
      row.forEach((val, c) => {
        if (val === 0) emptyCells.push([r, c]);
      })
    );
    if (emptyCells.length === 0) return;
    const [r, c] = emptyCells[getRandomInt(emptyCells.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  };

  const moveGrid = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (gameOver) return;
      let rotated = cloneGrid(grid);

      const rotate = (g: number[][]) => g[0].map((_, i) => g.map((row) => row[i]));
      const reverse = (g: number[][]) => g.map((row) => row.reverse());

      if (direction === "up") rotated = rotate(rotated);
      if (direction === "down") {
        rotated = rotate(rotated);
        rotated = reverse(rotated);
      }
      if (direction === "right") rotated = reverse(rotated);

      let moved = false,
        scoreGain = 0;

      const newGrid = rotated.map((row) => {
        let filtered = row.filter((v) => v !== 0);
        for (let i = 0; i < filtered.length - 1; i++) {
          if (filtered[i] === filtered[i + 1]) {
            filtered[i] *= 2;
            scoreGain += filtered[i];
            filtered[i + 1] = 0;
          }
        }
        const newRow = filtered.filter((v) => v !== 0);
        while (newRow.length < GRID_SIZE) newRow.push(0);
        if (!moved && newRow.some((v, i) => v !== row[i])) moved = true;
        return newRow;
      });

      if (direction === "up") rotated = rotate(newGrid);
      if (direction === "down") {
        rotated = reverse(newGrid);
        rotated = rotate(rotated);
      }
      if (direction === "right") rotated = reverse(newGrid);
      if (direction === "left") rotated = newGrid;

      if (moved) {
        addRandomTile(rotated);
        setGrid(cloneGrid(rotated));
        setScore((prev) => prev + scoreGain);
        if (checkGameOver(rotated)) setGameOver(true);
      }
    },
    [grid, gameOver]
  );

  const checkGameOver = (g: number[][]) => {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (g[r][c] === 0) return false;
        if (r < GRID_SIZE - 1 && g[r][c] === g[r + 1][c]) return false;
        if (c < GRID_SIZE - 1 && g[r][c] === g[r][c + 1]) return false;
      }
    }
    return true;
  };

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          moveGrid("up");
          break;
        case "ArrowDown":
          moveGrid("down");
          break;
        case "ArrowLeft":
          moveGrid("left");
          break;
        case "ArrowRight":
          moveGrid("right");
          break;
      }
    },
    [moveGrid]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) moveGrid("right");
      else if (dx < -30) moveGrid("left");
    } else {
      if (dy > 30) moveGrid("down");
      else if (dy < -30) moveGrid("up");
    }
    touchStart.current = null;
  };

  const resetGame = () => {
    const newGrid = getEmptyGrid();
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(cloneGrid(newGrid));
    setScore(0);
    setGameOver(false);
  };

  const shareFrame = () => {
    const frameUrl = `https://farcaster-achivement.vercel.app/frame?game=2048&score=${score}`;
    const shareUrl = `https://warpcast.com/~/compose?text=I%20just%20scored%20${score}%20in%202048!%20Can%20you%20beat%20me?&embeds[]=${encodeURIComponent(
      frameUrl
    )}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1a0030] text-white font-sans py-10 px-6">
      <h1 className="text-4xl font-extrabold mb-4 text-[#90CAF9]">2048 Game</h1>
      <p className="text-lg text-purple-300 mb-6 font-semibold">Score: {score}</p>

      <div
        className="grid grid-cols-4 gap-2 bg-[#2a004b] p-3 rounded-xl shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {grid.flat().map((cell, index) => (
          <div
            key={index}
            className={`w-20 h-20 flex items-center justify-center text-2xl font-bold rounded-lg
              ${
                cell === 0
                  ? "bg-[#3a004f]"
                  : "bg-gradient-to-br from-purple-400 to-purple-600 text-white"
              }`}
          >
            {cell || ""}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="mt-4 text-lg font-bold text-red-400">Game Over! 😭</div>
      )}

      {/* ✅ Unified Action Buttons */}
      <div className="action-buttons mt-6">
        <button className="base-button play-again" onClick={resetGame}>
          🔄 Play Again
        </button>
        <button className="base-button share-frame" onClick={shareFrame}>
          📸 Share Frame
        </button>
        <Link href="/" legacyBehavior>
          <a className="base-button back-hub">🏠 Back to Hub</a>
        </Link>
      </div>

      <style jsx>{`
        .action-buttons {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-top: 25px;
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
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
