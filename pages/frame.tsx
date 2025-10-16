// pages/frame.tsx
import Head from "next/head";
import { useRouter } from "next/router";

export default function FramePage() {
  const router = useRouter();
  const { game, status, score } = router.query;

  const titleMap: Record<string, string> = {
    "2048": "2048 Game",
    chess: "Chess Master",
    snake: "Snake Game",
    pou: "Pou Mini Game",
    janken: "Janken Showdown",
  };

  const gameName = titleMap[String(game)] || "Farcaster Games Hub";
  const baseUrl = "https://farcaster-achivement.vercel.app";
  const playUrl = `${baseUrl}/${game || ""}`;
  const displayScore = score ? `Score: ${score}` : "";
  const displayStatus = status
    ? String(status).replace(/_/g, " ").toUpperCase()
    : score
    ? `You scored ${score}!`
    : "Play now!";

  const emojiMap: Record<string, string> = {
    "2048": "🔢",
    chess: "♟️",
    snake: "🐍",
    pou: "🐹",
    janken: "✊",
  };

  const emoji = emojiMap[String(game)] || "🎮";

  return (
    <>
      <Head>
        <title>{`${emoji} ${gameName} - Farcaster Games`}</title>
        <meta
          property="og:title"
          content={`${emoji} ${gameName} | ${displayStatus}`}
        />
        <meta
          property="og:description"
          content={`Join ${gameName} on Farcaster Games Hub — ${displayScore}`}
        />
        <meta
          property="og:image"
          content={`${baseUrl}/og/${game || "hub"}.png`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/frame?game=${game}`} />
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] text-white text-center p-6">
        <h1 className="text-3xl font-extrabold mb-2">
          {emoji} {gameName}
        </h1>
        <p className="text-lg font-semibold text-purple-300 mb-6">
          {displayStatus}
        </p>

        {score && (
          <div className="text-2xl text-yellow-400 font-bold mb-4">
            🏆 {displayScore}
          </div>
        )}

        <a
          href={playUrl}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-2xl font-bold shadow-md text-white text-lg transition-all transform hover:scale-105"
        >
          ▶️ Play Again
        </a>

        <a
          href="https://farcaster.xyz/miniapps/9HwP06is7xxa/farcaster-games-hub"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 text-blue-400 hover:underline"
        >
          Back to Games Hub
        </a>
      </div>
    </>
  );
}
