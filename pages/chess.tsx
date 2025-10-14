// pages/chess.tsx
import React, { useState } from "react";
import ChessGame from "../components/ChessGame";

export default function ChessPage() {
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState<"You" | "AI" | "Draw" | null>(null);

  const handleGameOver = (result: "You" | "AI" | "Draw") => {
    setWinner(result);
    setFinished(true);
  };

  const resetToHome = () => {
    window.location.href = "/";
  };

  const shareToWarpcast = () => {
    const text =
      winner === "You"
        ? "🏆 I beat the AI in Farcaster Chess!"
        : winner === "AI"
        ? "💀 The AI checkmated me in Farcaster Chess!"
        : "🤝 It's a draw against the AI in Farcaster Chess!";
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      text + " ♟️ #FarcasterGames"
    )}`;
    window.open(url, "_blank");
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center drop-shadow">
        ♟️ Chess Game (vs AI)
      </h1>

      {/* ChessGame accepts onGameOver callback */}
      {!finished ? (
        <ChessGame onGameOver={handleGameOver} />
      ) : (
        <div className="w-full max-w-md mx-auto text-center mt-6">
          <h2 className="text-xl font-semibold mb-4">
            {winner === "Draw" ? "🤝 It's a Draw!" : winner === "You" ? "🏆 You Win!" : "💀 AI Wins!"}
          </h2>

          <div className="flex flex-col gap-3 items-center">
            <button
              onClick={shareToWarpcast}
              className="w-48 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              📤 Share to Warpcast
            </button>

            <button
              onClick={resetToHome}
              className="w-48 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold"
            >
              🔙 Back to Menu
            </button>

            <button
              onClick={() => {
                setFinished(false);
                setWinner(null);
                // reload page to reset chess component (simple)
                window.location.reload();
              }}
              className="w-48 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              🔁 Restart Game
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
