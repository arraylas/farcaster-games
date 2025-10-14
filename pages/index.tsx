import Head from 'next/head';
import Link from 'next/link';
import { SiFarcaster } from 'react-icons/si';
import { GiGamepad } from 'react-icons/gi';
import { TbTallymark1 } from 'react-icons/tb';
// FIX: Switched from problematic PiPawnFill (Phosphor Icons) to FaChessPawn (Font Awesome)
import { FaChessPawn } from 'react-icons/fa';

// --- Farcaster Mini App Configuration ---
const APP_DOMAIN = "https://farcaster-games.netlify.app";
const EMBED_IMAGE_URL = `${APP_DOMAIN}/farcaster-games-embed.png`; 

const miniappMetadata = {
  version: "1",
  name: "Farcaster Games Hub & Achievements",
  iconUrl: `${APP_DOMAIN}/icon.png`,
  homeUrl: APP_DOMAIN,
  subtitle: "Chess, OXOX, and Onchain Achievement Generator",
  description: "A combined Mini App featuring single-player games and a tool to generate onchain achievements.",
  imageUrl: EMBED_IMAGE_URL,
  buttonTitle: "Launch Farcaster Games",
  primaryCategory: "games"
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Farcaster Games Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Farcaster Mini App for Chess and OXOX. Play against AI and earn onchain achievements." />
        
        {/* Farcaster Embed Metadata */}
        <meta property="og:title" content="Farcaster Games: Chess & OXOX" />
        <meta property="og:description" content="Play Chess and OXOX 5x5 directly inside the Farcaster Mini App!" />
        <meta property="og:image" content={EMBED_IMAGE_URL} />
        
        {/* Farcaster Mini App Tag KRUSIAL */}
        <meta name="fc:miniapp" content={JSON.stringify(miniappMetadata)} />
        
        {/* Tailwind config (assumed to be loaded) */}
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
            }
          `}
        </style>
      </Head>

      {/* Dark Purple Background and Centered Layout */}
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#30064a] text-white">
        <div className="w-full max-w-lg text-center p-8 rounded-xl">
          
          {/* Application Header */}
          <div className="flex justify-center items-center mb-6">
            <GiGamepad className="text-4xl text-purple-400 mr-3" />
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              Farcaster Games
            </h1>
          </div>

          {/* Description */}
          <p className="text-lg mb-8 text-purple-200/90">
            Welcome to Farcaster Games! This is your hub for challenging mini-games,
            built for the Farcaster ecosystem. Start playing against the AI now!
          </p>

          <h2 className="text-xl font-semibold mb-6 text-purple-300">
            Ready to Play?
          </h2>

          <div className="flex flex-col space-y-4">
            
            {/* OXOX 5x5 Button */}
            <Link 
              href="/oxox" 
              className="flex items-center justify-center w-full py-4 px-6 rounded-xl font-bold text-lg 
                         bg-green-600 hover:bg-green-700 transition duration-300 transform hover:scale-[1.02] 
                         shadow-lg shadow-green-900/50"
            >
              <TbTallymark1 className="text-2xl mr-2" />
              Play OXOX 5x5 vs AI
            </Link>

            {/* Chess vs AI Button */}
            <Link 
              href="/chess" 
              className="flex items-center justify-center w-full py-4 px-6 rounded-xl font-bold text-lg 
                         bg-blue-600 hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02] 
                         shadow-lg shadow-blue-900/50"
            >
              {/* FIX: Use FaChessPawn (Font Awesome) */}
              <FaChessPawn className="text-2xl mr-2" />
              Play Chess vs AI
            </Link>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-12 text-sm text-purple-400">
          Powered by <SiFarcaster className="inline-block mx-1" /> Farcaster Mini Apps
        </footer>
      </main>
    </>
  );
}
