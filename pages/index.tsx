// pages/index.tsx
import Head from 'next/head';
import Link from 'next/link';
import { SiFarcaster } from 'react-icons/si';
import { GiGamepad } from 'react-icons/gi';
import { FaChessPawn, FaHandRock } from 'react-icons/fa';
import { PiRocketLaunchFill } from 'react-icons/pi';
import { GiSnake, GiAbstract024 } from 'react-icons/gi';
import { GiBabyFace } from 'react-icons/gi'; // icon untuk Pou

const APP_DOMAIN = "https://farcaster-achivement.vercel.app";
const EMBED_IMAGE_URL = `${APP_DOMAIN}/farcaster-games-embed.png`;
const SUPPORT_ADDRESS = "0x3f05e8770134e70a7acd907c2725d8da64f0f8fe";

const miniappMetadata = {
  version: "1",
  name: "Farcaster Games Hub",
  iconUrl: `${APP_DOMAIN}/icon.png`,
  homeUrl: APP_DOMAIN,
  subtitle: "Farcaster Games Hub",
  description: "Play Chess, OXOX, Janken, Snake, 2048, and Pou — all inside the Farcaster Games Hub!",
  imageUrl: EMBED_IMAGE_URL,
  buttonTitle: "Launch Farcaster Games",
  primaryCategory: "games",
};

export default function Home() {
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
        <div className="w-full max-w-sm text-center p-6 rounded-xl">

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

          <div className="flex flex-col space-y-4">

            {/* OXOX */}
            <Link
              href="/oxox"
              className="flex items-center justify-center w-full py-4 px-6 rounded-lg font-extrabold text-xl 
                        bg-green-600 hover:bg-green-700 transition duration-300 transform hover:scale-[1.02]
                        shadow-lg shadow-green-900/50"
            >
              <span className="text-3xl mr-3 font-bold">X O</span>
              Play OXOX 5x5
            </Link>

            {/* Chess */}
            <Link
              href="/chess"
              className="flex items-center justify-center w-full py-4 px-6 rounded-lg font-extrabold text-xl 
                        bg-blue-600 hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02]
                        shadow-lg shadow-blue-900/50"
            >
              <FaChessPawn className="text-3xl mr-3" />
              Play Chess
            </Link>

            {/* Janken */}
            <Link
              href="/janken"
              className="flex items-center justify-center w-full py-4 px-6 rounded-lg font-extrabold text-xl 
                        bg-pink-600 hover:bg-pink-700 transition duration-300 transform hover:scale-[1.02]
                        shadow-lg shadow-pink-900/50"
            >
              <FaHandRock className="text-3xl mr-3" />
              Play Janken
            </Link>

            {/* Snake */}
            <Link
              href="/snake"
              className="flex items-center justify-center w-full py-4 px-6 rounded-lg font-extrabold text-xl
                        bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700
                        transition duration-300 transform hover:scale-[1.02]
                        shadow-lg shadow-purple-900/50"
            >
              <GiSnake className="text-3xl mr-3" />
              Play Snake
            </Link>

            {/* 2048 */}
            <Link
              href="/2048"
              className="flex items-center justify-center w-full py-4 px-6 rounded-lg font-extrabold text-xl
                        bg-orange-600 hover:bg-orange-700 transition duration-300 transform hover:scale-[1.02]
                        shadow-lg shadow-orange-900/50"
            >
              <GiAbstract024 className="text-3xl mr-3" />
              Play 2048
            </Link>

            {/* Pou */}
            <Link
              href="/pou"
              className="flex items-center justify-center w-full py-4 px-6 rounded-lg font-extrabold text-xl
                        bg-yellow-600 hover:bg-yellow-700 transition duration-300 transform hover:scale-[1.02]
                        shadow-lg shadow-yellow-900/50"
            >
              <GiBabyFace className="text-3xl mr-3" />
              Play Pou
            </Link>

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
