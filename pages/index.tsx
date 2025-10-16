// pages/index.tsx
import Head from 'next/head';
import Link from 'next/link';
import { SiFarcaster } from 'react-icons/si';
import { GiGamepad, GiSnake, GiAbstract024, GiBabyFace } from 'react-icons/gi';
import { FaChessPawn, FaHandRock } from 'react-icons/fa';
import { PiRocketLaunchFill } from 'react-icons/pi';
import { TbSquareRotated, TbBomb } from 'react-icons/tb'; // Tetris + Minesweeper

const APP_DOMAIN = "https://farcaster-achivement.vercel.app";
const EMBED_IMAGE_URL = `${APP_DOMAIN}/farcaster-games-embed.png`;
const SUPPORT_ADDRESS = "0x3f05e8770134e70a7acd907c2725d8da64f0f8fe";

const miniappMetadata = {
  version: "1",
  name: "Farcaster Games Hub",
  iconUrl: `${APP_DOMAIN}/icon.png`,
  homeUrl: APP_DOMAIN,
  subtitle: "Farcaster Games Hub",
  description: "Play Chess, OXOX, Janken, Snake, 2048, Pou, Tetris, Minesweeper — all inside the Farcaster Games Hub!",
  imageUrl: EMBED_IMAGE_URL,
  buttonTitle: "Launch Farcaster Games",
  primaryCategory: "games",
};

export default function Home() {
  const games = [
    { href: '/oxox', label: 'Play OXOX 5x5', bg: 'bg-green-600', icon: <span className="text-3xl mr-3">X O</span> },
    { href: '/chess', label: 'Play Chess', bg: 'bg-blue-600', icon: <FaChessPawn className="text-3xl mr-3" /> },
    { href: '/janken', label: 'Play Janken', bg: 'bg-pink-600', icon: <FaHandRock className="text-3xl mr-3" /> },
    { href: '/snake', label: 'Play Snake', bg: 'bg-purple-700', icon: <GiSnake className="text-3xl mr-3" /> },
    { href: '/2048', label: 'Play 2048', bg: 'bg-orange-600', icon: <GiAbstract024 className="text-3xl mr-3" /> },
    { href: '/pou', label: 'Play Pou', bg: 'bg-yellow-600', icon: <GiBabyFace className="text-3xl mr-3" /> },
    { href: '/tetris', label: 'Play Tetris', bg: 'bg-teal-600', icon: <TbSquareRotated className="text-3xl mr-3" /> },
    { href: '/minesweeper', label: 'Play Minesweeper', bg: 'bg-red-600', icon: <TbBomb className="text-3xl mr-3" /> },
  ];

  return (
    <>
      <Head>
        <title>Farcaster Games Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Farcaster Games Hub directly inside the Farcaster Mini App." />
        <meta property="og:title" content="Farcaster Games Hub" />
        <meta property="og:description" content="Farcaster Games Hub!" />
        <meta property="og:image" content={EMBED_IMAGE_URL} />
        <meta name="fc:miniapp" content={JSON.stringify(miniappMetadata)} />

        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-start py-10 px-6 bg-[#30064a] text-white">
        <div className="w-full max-w-3xl text-center p-6 rounded-xl">

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <GiGamepad className="text-6xl mb-2 text-[#eeccff]" />
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent leading-none tracking-tighter">
              Farcaster Games
            </h1>
          </div>

          {/* Description */}
          <p className="text-xl font-semibold mb-8 text-purple-200/90 leading-normal px-2">
            Welcome to the Farcaster Games Hub! Play fun, challenging mini-games — all built for the Farcaster ecosystem.
          </p>

          <h2 className="text-2xl font-bold mb-6 text-white">Choose Your Game</h2>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {games.map((game) => (
              <Link
                key={game.href}
                href={game.href}
                className={`${game.bg} hover:opacity-90 transition duration-300 transform hover:scale-[1.02] shadow-lg shadow-black/30 flex items-center justify-center py-6 px-4 rounded-lg font-extrabold text-xl h-24`}
              >
                {game.icon}
                {game.label}
              </Link>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mt-8 text-lg font-bold text-center text-purple-300">
            <PiRocketLaunchFill className="inline-block mr-2 text-2xl" />
            More Games and Onchain Achievements Coming Soon...
          </div>

          {/* Support Section */}
          <div className="mt-6 pt-4 border-t border-purple-800 text-sm text-purple-400">
            <p className="mb-1">Support me on Base:</p>
            <a
              href={`https://basescan.org/address/${SUPPORT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-purple-200/90 break-words underline hover:text-purple-100"
            >
              {SUPPORT_ADDRESS}
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-sm text-purple-400">
          Powered by <SiFarcaster className="inline-block mx-1" /> Farcaster Mini Apps
        </footer>
      </main>
    </>
  );
}
