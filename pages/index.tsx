import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const IndexPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Farcaster Achievement</title>
        <meta
          name="description"
          content="Generate onchain achievements or play mini-games built for Farcaster frames!"
        />

        {/* OG (Open Graph) metadata */}
        <meta property="og:title" content="Farcaster Achievement" />
        <meta
          property="og:description"
          content="Generate onchain achievement images based on your Farcaster history or play mini-games!"
        />
        <meta
          property="og:image"
          content="https://farcaster-achivement.vercel.app/splash.png"
        />
        <meta
          property="og:url"
          content="https://farcaster-achivement.vercel.app/"
        />
        <meta property="og:type" content="website" />

        {/* Frame metadata for Warpcast */}
        <meta name="fc:frame" content="vNext" />
        <meta
          name="fc:frame:image"
          content="https://farcaster-achivement.vercel.app/splash.png"
        />
        <meta name="fc:frame:button:1" content="Play XOXO" />
        <meta name="fc:frame:button:1:action" content="post_redirect" />
        <meta
          name="fc:frame:post_url"
          content="https://farcaster-achivement.vercel.app/oxox"
        />
        <meta name="fc:frame:button:2" content="Play Chess" />
        <meta name="fc:frame:button:2:action" content="post_redirect" />
        <meta
          name="fc:frame:post_url:2"
          content="https://farcaster-achivement.vercel.app/chess"
        />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-800 to-purple-900 text-white p-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center drop-shadow-lg">
          🎮 Farcaster Achievement
        </h1>

        <p className="max-w-md text-center text-lg mb-8 opacity-90">
          Generate your onchain achievements or play mini-games built for
          Farcaster Frames!
        </p>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Link
            href="/oxox"
            className="bg-green-600 hover:bg-green-700 text-center p-4 rounded-lg text-lg font-semibold shadow-md transition-all"
          >
            ❌⭕ Play OXOX 5x5
          </Link>

          <Link
            href="/chess"
            className="bg-blue-600 hover:bg-blue-700 text-center p-4 rounded-lg text-lg font-semibold shadow-md transition-all"
          >
            ♟️ Play Chess vs AI
          </Link>
        </div>

        <p className="mt-10 text-sm opacity-70 text-center">
          *Share this page on Warpcast to see the live Frame preview!*
        </p>
      </main>
    </>
  );
};

export default IndexPage;
