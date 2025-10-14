import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const IndexPage: NextPage = () => {
  const domain = "https://farcaster-achivement.vercel.app"; // TODO: REPLACE WITH YOUR DEPLOYED DOMAIN

  return (
    <>
      <Head>
        {/* JUDUL BROWSER */}
        <title>Farcaster Games</title>
        <meta
          name="description"
          content="Hub for mini-games built for the Farcaster ecosystem. Play against the AI and earn achievements!"
        />

        {/* Open Graph / Frame metadata */}
        <meta property="og:title" content="Farcaster Games" />
        <meta
          property="og:description"
          content="Hub for mini-games built for the Farcaster ecosystem. Play against the AI and earn achievements!"
        />
        <meta property="og:image" content={`${domain}/splash.png`} />
        <meta property="og:url" content={domain} />
        <meta property="og:type" content="website" />

        {/* Farcaster Frame metadata (unchanged) */}
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content={`${domain}/splash.png`} />
        <meta name="fc:frame:button:1" content="Play OXOX" />
        <meta name="fc:frame:button:1:action" content="post_redirect" />
        <meta name="fc:frame:post_url" content={`${domain}/oxox`} />
        <meta name="fc:frame:button:2" content="Play Chess" />
        <meta name="fc:frame:button:2:action" content="post_redirect" />
        <meta name="fc:frame:post_url:2" content={`${domain}/chess`} />
      </Head>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-800 to-purple-900 text-white p-6">
        {/* JUDUL UTAMA */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-lg text-center">
          🎮 Farcaster Games
        </h1>

        {/* DESKRIPSI UTAMA YANG DIUBAH */}
        <p className="max-w-md text-center text-lg mb-12 opacity-90">
          Welcome to Farcaster Games! This is your hub for fun, challenging mini-games built for the Farcaster ecosystem. Start playing against the AI now!
        </p>

        {/* Vertical stacking buttons FIX */}
        <div className="block w-full max-w-sm space-y-4">
          
          {/* BUTTON 1: OXOX */}
          <div className="block w-full">
            <Link
              href="/oxox"
              className="block w-full bg-green-600 hover:bg-green-700 text-center p-4 rounded-xl text-lg font-semibold shadow-lg transition-all"
            >
              ❌⭕ Play OXOX 5x5
            </Link>
          </div>
          
          {/* BUTTON 2: CHESS - Added mt-4 for clear separation */}
          <div className="block w-full mt-4">
            <Link
              href="/chess"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-center p-4 rounded-xl text-lg font-semibold shadow-lg transition-all"
            >
              ♟️ Play Chess vs AI
            </Link>
          </div>
        </div>

        <p className="mt-12 text-base text-center font-medium opacity-80">
          🚀 More Games and Onchain Achievements Coming Soon...
        </p>

        <p className="mt-4 text-sm opacity-70 text-center">
          You can support me on ETH:{" "}
          <span className="font-mono text-purple-300">
            0x3f05e8770134e70A7ACD907C2725d8DA64f0fBfe
          </span>
        </p>
        
      </main>
    </>
  );
};

export default IndexPage;
