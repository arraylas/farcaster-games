import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-800 to-purple-900 text-white">
      <h1 className="text-3xl font-bold mb-8">🎮 Farcaster Games</h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link href="/oxox" className="bg-green-600 hover:bg-green-700 text-center p-4 rounded-lg text-lg font-semibold">
          ❌⭕

 Play OXOX 5x5
        </Link>
        <Link href="/chess" className="bg-blue-600 hover:bg-blue-700 text-center p-4 rounded-lg text-lg font-semibold">
          ♟️ Play Chess vs AI
        </Link>
      </div>
    </main>
  );
}
