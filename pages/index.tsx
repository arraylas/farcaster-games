import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const IndexPage: NextPage = () => {
  const domain = "https://farcaster-achivement.vercel.app"; // ganti domain deploy kamu

  return (
    <>
      <Head>
        <title>Farcaster Achievement</title>
        <meta
          name="description"
          content="Generate onchain achievements or play mini-games built for Farcaster frames!"
        />

        {/* Open Graph / Frame metadata */}
        <meta property="og:title" content="Farcaster Achievement" />
        <meta
          property="og:description"
          content="Generate onchain achievement images or play mini-games!"
        />
        <meta property="og:image" content={`${domain}/splash.png`} />
        <meta property="og:url" content={domain} />
        <meta property="og:type" content="website" />

        {/* Farcaster Frame metadata */}
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content={`${domain}/splash.png`} />
        <meta name="fc:frame:button:1" content="Play OXOX" />
        <meta name="fc:frame:button:1:action" content="post_redirect" />
        <meta name="fc:frame:post_url" content={`${domain}/oxox`} />
        <meta name="fc:frame:button:2" content="Play Chess" />
        <meta name="fc:frame:button:2:action" content="post_redirect" />
        <meta name="fc:frame:post_url:2" content={`${domain}/chess`} />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-800 to-purple-900 text-white p-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-lg text-center">
          🎮 Farcaster Achievement
        </h1>

        <p className="max-w-md text-center text-lg mb-12 opacity-90">
          Generate your onchain achievements or play fun mini-games built for
          Farcaster Frames!
        </p>

        <div className="flex flex-col items-center w-full max-w-sm space-y-8">
          <Link
            href="/oxox"
            className="w-full bg-green-600 hover:bg-green-700 text-center p-4 rounded-xl text-lg font-semibold shadow-lg transition-all"
          >
            ❌⭕ Play OXOX 5x5
          </Link>

          <Link
            href="/chess"
            className="w-full bg-blue-600 hover:bg-blue-700 text-center p-4 rounded-xl text-lg font-semibold shadow-lg transition-all"
          >
            ♟️ Play Chess vs AI
          </Link>
        </div>

        <p className="mt-12 text-base text-center font-medium opacity-80">
          🚀 More Games Coming Soon...
        </p>

        <p className="mt-4 text-sm opacity-70 text-center">
          You can support me on ETH:{" "}
          <span className="font-mono text-purple-300">
            0x3f05e8770134e70A7ACD907C2725d8DA64f0fBfe
          </span>
        </p>

        <p className="mt-6 text-xs opacity-60 text-center">
          *Share this page on Warpcast to see the live Frame preview!*
        </p>
      </main>
    </>
  );
};

export default IndexPage;
