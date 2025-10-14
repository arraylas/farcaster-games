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
        : "🤝 Draw against the AI in Farcaster Chess!";
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      text + " ♟️ #FarcasterGames"
    )}`;
    window.open(url, "_blank");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-700 to-green-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-center drop-shadow-lg">
        ♟️ Chess Game (vs AI)
      </h1>

      {!finished ? (
        <ChessGame onGameOver={handleGameOver} />
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {winner === "Draw"
              ? "🤝 It's a Draw!"
              : winner === "You"
              ? "🏆 You Win!"
              : "💀 AI Wins!"}
          </h2>

          <div className="flex flex-col gap-3">
            <button
              onClick={shareToWarpcast}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 rounded-lg font-semibold"
            >
              📤 Share to Warpcast
            </button>
            <button
              onClick={resetToHome}
              className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-lg font-semibold"
            >
              🔙 Back to Menu
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
