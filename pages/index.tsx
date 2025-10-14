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

      {/* Main Content (Mencocokkan gaya Gambar 1) */}
      <div className="min-h-screen bg-[#30064a] text-white flex flex-col items-center justify-center p-4 font-inter">
        
        {/* Kontainer Utama yang Ditempatkan di Tengah */}
        <div className="w-full max-w-md text-center p-4">
          
          {/* Judul Utama */}
          <h1 className="text-4xl font-extrabold mb-4 flex items-center justify-center text-purple-300">
            <span className="text-4xl mr-3">🎮</span>
            Farcaster Games
          </h1>
          
          {/* Subtitle/Deskripsi */}
          <p className="text-center text-gray-300 mb-12 max-w-xs mx-auto">
            Welcome to Farcaster Games! This is your hub for fun, challenging mini-games built for the Farcaster ecosystem. Start playing against the AI now!
          </p>

          {/* Header Tombol */}
          <h2 className="text-2xl font-semibold text-white mb-6">
            Ready to Play?
          </h2>

          {/* Tombol Game */}
          <div className="space-y-4">
            <button
              onClick={() => navigateToGame('/oxox')}
              // Gaya tombol OXOX (seperti Gambar 1)
              className="w-full py-4 text-lg font-bold rounded-xl transition duration-300 ease-in-out transform hover:scale-[1.02] bg-green-600 hover:bg-green-700 shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500/50"
            >
              ❌⭕ Play OXOX 5x5
            </button>
            <button
              onClick={() => navigateToGame('/chess')}
              // Gaya tombol Chess (seperti Gambar 1)
              className="w-full py-4 text-lg font-bold rounded-xl transition duration-300 ease-in-out transform hover:scale-[1.02] bg-blue-600 hover:bg-blue-700 shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              ♟️ Play Chess vs AI
            </button>
          </div>
          
          {/* Footer */}
          <p className="text-xs text-center text-gray-500 mt-12">
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
