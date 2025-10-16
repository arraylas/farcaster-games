// pages/pou.tsx
import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { sdk } from "@farcaster/miniapp-sdk";

interface PouState {
  hunger: number;
  happiness: number;
  energy: number;
}

const MAX_VALUE = 100;
const SAVE_KEY = "pouState";

export default function PouPage() {
  const [pou, setPou] = useState<PouState>({ hunger: 50, happiness: 50, energy: 50 });
  const [fid, setFid] = useState<string | null>(null);
  const [action, setAction] = useState<"idle" | "feed" | "play" | "sleep">("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const ctx: any = await sdk.context;
        if (ctx?.fid) setFid(ctx.fid.toString());
      } catch (e) {
        console.warn("Farcaster context not available", e);
      }
    })();
  }, []);

  useEffect(() => {
    const saved = fid ? localStorage.getItem(`${SAVE_KEY}_${fid}`) : localStorage.getItem(SAVE_KEY);
    if (saved) setPou(JSON.parse(saved));
  }, [fid]);

  useEffect(() => {
    if (fid) localStorage.setItem(`${SAVE_KEY}_${fid}`, JSON.stringify(pou));
    else localStorage.setItem(SAVE_KEY, JSON.stringify(pou));
  }, [pou, fid]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPou((prev) => ({
        hunger: Math.max(prev.hunger - 1, 0),
        happiness: Math.max(prev.happiness - 1, 0),
        energy: Math.max(prev.energy - 1, 0),
      }));
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const feed = () => {
    setPou((prev) => ({ ...prev, hunger: Math.min(prev.hunger + 20, MAX_VALUE) }));
    setAction("feed");
    setTimeout(() => setAction("idle"), 1000);
  };
  const play = () => {
    setPou((prev) => ({
      ...prev,
      happiness: Math.min(prev.happiness + 20, MAX_VALUE),
      energy: Math.max(prev.energy - 10, 0),
    }));
    setAction("play");
    setTimeout(() => setAction("idle"), 1000);
  };
  const sleep = () => {
    setPou((prev) => ({ ...prev, energy: Math.min(prev.energy + 20, MAX_VALUE) }));
    setAction("sleep");
    setTimeout(() => setAction("idle"), 1000);
  };

  const shareFrame = () => {
    (sdk as any).ui?.shareFrame?.({
      title: "My Pou is doing great! 🐣",
      text: `Hunger: ${pou.hunger}, Happiness: ${pou.happiness}, Energy: ${pou.energy}`,
      imageUrl: `${window.location.origin}/pou.svg`,
    });
  };

  const getPouClass = () => {
    switch (action) {
      case "feed":
        return "animate-bounce feed";
      case "play":
        return "animate-jump play";
      case "sleep":
        return "animate-sleep sleep";
      default:
        return "animate-idle idle";
    }
  };

  return (
    <>
      <Head>
        <title>Pou - Farcaster Games Hub</title>
      </Head>

      <main className="flex flex-col items-center min-h-screen bg-[#1a0030] text-white font-sans py-10 px-6">
        <h1 className="text-4xl font-extrabold mb-4 text-[#90CAF9]">🐣 Pou Game</h1>

        <div className="bg-[#2a004b] p-6 rounded-2xl shadow-lg flex flex-col items-center max-w-sm w-full">
          {/* Pou Image */}
          <img
            src="/pou.svg"
            alt="Pou"
            className={`w-36 h-36 mb-4 ${getPouClass()}`}
          />

          {/* Stats */}
          <div className="text-lg font-semibold space-y-1 text-purple-200">
            <p>🍎 Hunger: {pou.hunger}</p>
            <p>🎾 Happiness: {pou.happiness}</p>
            <p>💤 Energy: {pou.energy}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <button onClick={feed} className="base-btn bg-green-500 hover:bg-green-600">
              🍎 Feed
            </button>
            <button onClick={play} className="base-btn bg-yellow-400 hover:bg-yellow-500">
              🎾 Play
            </button>
            <button onClick={sleep} className="base-btn bg-blue-400 hover:bg-blue-500">
              🛌 Sleep
            </button>
          </div>

          {/* Share + Back */}
          <div className="action-buttons">
            {(sdk as any).ui?.shareFrame && (
              <button onClick={shareFrame} className="base-button share-frame">
                📸 Share Frame
              </button>
            )}
            <Link href="/" className="base-button back-hub">
              🏠 Back to Hub
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        .base-btn {
          padding: 10px 18px;
          font-size: 1em;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          transition: background-color 0.3s, transform 0.1s;
        }
        .base-btn:active {
          transform: scale(0.97);
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
          text-decoration: none;
          display: inline-block;
        }
        .base-button:active {
          transform: scale(0.97);
        }
        .action-buttons {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .share-frame {
          background-color: #7c4dff;
          color: white;
        }
        .back-hub {
          background-color: #38bdf8;
          color: #0f172a;
        }

        .animate-idle { transform: translateY(0); transition: transform 0.5s; }
        .animate-bounce.feed { animation: bounceFeed 0.5s; }
        .animate-jump.play { animation: jumpPlay 0.5s; }
        .animate-sleep.sleep { animation: sleepAnim 1s; }

        @keyframes bounceFeed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px) rotate(-10deg); }
        }
        @keyframes jumpPlay {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes sleepAnim {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 1; }
          50% { transform: translateY(5px) rotate(5deg); opacity: 0.7; }
        }
      `}</style>
    </>
  );
}
