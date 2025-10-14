import Head from 'next/head';
import { useRouter } from 'next/router';

// --- Configuration Constants (Updated to Netlify Domain) ---
const APP_DOMAIN = "https://farcaster-games.netlify.app";
// Ensure this file exists in your /public folder to avoid the broken image error
const EMBED_IMAGE_URL = `${APP_DOMAIN}/farcaster-games-embed.png`; 

export default function Home() {
  const router = useRouter();

  const navigateToGame = (path: string) => {
    router.push(path);
  };

  // Define the Farcaster Mini App metadata object
  const miniappMetadata = {
    version: "next",
    imageUrl: EMBED_IMAGE_URL,
    button: {
      title: "Launch Farcaster Games",
      action: {
        type: "launch_miniapp",
        name: "Farcaster Games Hub",
        url: APP_DOMAIN,
      },
    },
  };

  return (
    <>
      {/* CRITICAL: Farcaster Metadata (OpenGraph & fc:miniapp) 
        This is what tells Farcaster clients how to render the embed.
      */}
      <Head>
        <title>Farcaster Games Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Standard OpenGraph Meta Tags for previews */}
        <meta property="og:title" content="Farcaster Games Hub: Chess & OXOX" />
        <meta property="og:description" content="Play Chess and OXOX 5x5 directly inside the Farcaster Mini App." />
        <meta property="og:image" content={EMBED_IMAGE_URL} />
        <meta property="og:url" content={APP_DOMAIN} />

        {/* Farcaster Mini App Specific Tag */}
        <meta name="fc:miniapp" content={JSON.stringify(miniappMetadata)} />
      </Head>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-inter">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h1 className="text-4xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
            Farcaster Games Hub
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Challenge the AI in two classic games.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => navigateToGame('/oxox')}
              className="w-full py-4 text-lg font-bold rounded-xl transition duration-300 ease-in-out transform hover:scale-[1.02] bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
            >
              ❌⭕ Play OXOX 5x5
            </button>
            <button
              onClick={() => navigateToGame('/chess')}
              className="w-full py-4 text-lg font-bold rounded-xl transition duration-300 ease-in-out transform hover:scale-[1.02] bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-500/50"
            >
              ♟️ Play Chess vs AI
            </button>
          </div>
          <p className="text-xs text-center text-gray-500 mt-6">
            <a 
              href="https://docs.farcaster.xyz/mini-apps" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-purple-400 underline"
            >
              Powered by Farcaster Mini Apps
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
