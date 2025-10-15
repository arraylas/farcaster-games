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

  // Load FID safely
  useEffect(() => {
    (async () => {
      try {
        const ctx: any = await sdk.context; // cast ke any
        if (ctx?.fid) setFid(ctx.fid.toString());
      } catch (e) {
        console.warn("Farcaster context not available", e);
      }
    })();
  }, []);

  // Load saved Pou
  useEffect(() => {
    const saved = fid ? localStorage.getItem(`${SAVE_KEY}_${fid}`) : localStorage.getItem(SAVE_KEY);
    if (saved) setPou(JSON.parse(saved));
  }, [fid]);

  // Auto-save
  useEffect(() => {
    if (fid) localStorage.setItem(`${SAVE_KEY}_${fid}`, JSON.stringify(pou));
    else localStorage.setItem(SAVE_KEY, JSON.stringify(pou));
  }, [pou, fid]);

  // Natural decay
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

  // Pou actions
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

  // Share frame
  const shareFrame = () => {
    (sdk as any).ui?.shareFrame?.({
      title: "My Pou is doing great! 🐣",
      text: `Hunger: ${pou.hunger}, Happiness: ${pou.happiness}, Energy: ${pou.energy}`,
      imageUrl: `${window.location.origin}/pou.svg`,
    });
  };

  // Pou animation class
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Take care of your Pou! Feed, play, and sleep." />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-start py-10 px-6 bg-[#30064a] text-white">
        <h1 className="text-4xl font-extrabold mb-6 text-purple-200">🐣 Pou Game</h1>

        <div className="w-full max-w-sm bg-[#1a0030] p-6 rounded-xl flex flex-col items-center space-y-4">
          {/* Pou Visual */}
          <div className="w-40 h-40 mb-4 relative">
            <img src="/pou.svg" alt="Pou" className={`w-full h-full object-contain ${getPouClass()}`} />
          </div>

          {/* Stats */}
          <div className="text-xl font-bold">Hunger: {pou.hunger}</div>
          <div className="text-xl font-bold">Happiness: {pou.happiness}</div>
          <div className="text-xl font-bold">Energy: {pou.energy}</div>

          {/* Actions */}
          <div className="flex space-x-4 mt-4">
            <button className="px-4 py-2 bg-green-600 rounded-lg font-bold hover:bg-green-700 transition" onClick={feed}>Feed 🍎</button>
            <button className="px-4 py-2 bg-yellow-600 rounded-lg font-bold hover:bg-yellow-700 transition" onClick={play}>Play 🎾</button>
            <button className="px-4 py-2 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition" onClick={sleep}>Sleep 🛌</button>
          </div>

          {/* Share Frame */}
          {(sdk as any).ui?.shareFrame && (
            <button className="mt-4 px-6 py-2 bg-pink-600 rounded-lg font-bold hover:bg-pink-700 transition" onClick={shareFrame}>
              Share Frame 📸
            </button>
          )}

          <Link href="/" className="mt-4 px-6 py-2 bg-purple-600 rounded-lg font-bold hover:bg-purple-700 transition">
            Back to Hub
          </Link>
        </div>
      </main>

      <style jsx>{`
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
