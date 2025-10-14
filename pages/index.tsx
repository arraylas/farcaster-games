import Head from 'next/head';
import Link from 'next/link';
import { SiFarcaster } from 'react-icons/si';
// Mengganti GiGamepad dengan ikon yang lebih mendekati desain baru
import { GiGamepad } from 'react-icons/gi'; 
import { TbTallymark1 } from 'react-icons/tb';
import { FaChessPawn } from 'react-icons/fa';
// Menambahkan ikon roket untuk fitur mendatang
import { PiRocketLaunchFill } from 'react-icons/pi'; 

// --- Farcaster Mini App Configuration ---
const APP_DOMAIN = "https://farcaster-games.netlify.app";
const EMBED_IMAGE_URL = `${APP_DOMAIN}/farcaster-games-embed.png`; 
const SUPPORT_ADDRESS = "0x3f05e8770134e70a7acd907c2725d8da64f0f8fe"; // Alamat support dari gambar

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
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
            
            /* Background yang lebih dalam, seperti di gambar */
            .dark-bg {
              background-color: #30064a;
            }
            /* Styling untuk Judul yang Lebih Besar dan Gradasi */
            .gradient-text {
              background-image: linear-gradient(to right, #ffffff, #eeccff);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              color: transparent;
            }
          `}
        </style>
      </Head>

      {/* Dark Purple Background and Centered Layout */}
      <main className="min-h-screen flex flex-col items-center justify-start py-8 px-4 dark-bg text-white">
        <div className="w-full max-w-sm text-center p-4 rounded-xl">
          
          {/* Header Aplikasi (Mirip Gambar) */}
          <div className="flex flex-col justify-center items-center mb-6">
            <GiGamepad className="text-6xl mb-2" style={{ color: '#eeccff' }} />
            <h1 className="text-5xl font-extrabold gradient-text leading-none tracking-tighter">
              Farcaster Games
            </h1>
          </div>

          {/* Deskripsi (Menggunakan Font Bold/Tebal) */}
          <p className="text-xl font-semibold mb-8 text-purple-200/90 leading-normal px-2">
            Welcome to Farcaster Games! This is your hub for fun, challenging 
            mini-games built for the Farcaster ecosystem. Start playing against the AI now!
          </p>

          <h2 className="text-2xl font-bold mb-6 text-white">
            Ready to Play?
          </h2>

          <div className="flex flex-col space-y-4">
            
            {/* OXOX 5x5 Button - Menggunakan ikon 'X O' yang lebih akurat dari gambar */}
            <Link 
              href="/oxox" 
              className="flex items-center justify-center w-full py-4 px-6 rounded-lg font-extrabold text-xl 
                         bg-green-600 hover:bg-green-700 transition duration-300 transform hover:scale-[1.02] 
                         shadow-lg shadow-green-900/50"
            >
              <span className="text-3xl mr-3 font-bold">X O</span>
              Play OXOX 5x5 vs AI
            </Link>

            {/* Chess vs AI Button */}
            <Link 
              href="/chess" 
              className="flex items-center justify-center w-full py-4 px-6 rounded-lg font-extrabold text-xl 
                         bg-blue-600 hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02] 
                         shadow-lg shadow-blue-900/50"
            >
              <FaChessPawn className="text-3xl mr-3" />
              Play Chess vs AI
            </Link>
          </div>
          
          {/* Fitur Mendatang (Coming Soon) */}
          <div className="mt-8 text-lg font-bold text-center text-purple-300">
             <PiRocketLaunchFill className="inline-block mr-2 text-2xl" />
             More Games and Onchain Achievements Coming Soon...
          </div>

          {/* Alamat Support ETH (Sesuai Gambar) */}
          <div className="mt-6 pt-4 border-t border-purple-800 text-sm text-purple-400">
            <p className="mb-1">You can support me on ETH:</p>
            <p className="text-sm font-mono text-purple-200/90 break-words">
              {SUPPORT_ADDRESS}
            </p>
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
