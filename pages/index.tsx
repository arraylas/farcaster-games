import type { NextPage } from 'next';
import Head from 'next/head'; // <-- Import Head
import Link from 'next/link';

// Background: Menggunakan warna ungu gelap sesuai desain Anda
const BACKGROUND_COLOR = '#3a065f'; 
// Warna gradien yang menyerupai 'from-indigo-800 to-purple-900' di Tailwind
const GRADIENT_BACKGROUND = 'linear-gradient(180deg, #300050 0%, #1a0030 100%)'; 

// --- STYLE OBJECTS ---

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '20px',
  textAlign: 'center',
  fontFamily: 'Arial, sans-serif',
  color: 'white', // Mengubah warna teks default menjadi putih
  backgroundColor: BACKGROUND_COLOR, // Menggunakan warna dasar ungu
  backgroundImage: GRADIENT_BACKGROUND, // Menambahkan gradien
};

const titleStyle: React.CSSProperties = {
  fontSize: '2.5em',
  fontWeight: 'bold',
  marginBottom: '15px',
  // Warna yang lebih cerah
  color: '#90CAF9', // Light Blue/Cyan untuk kontras
};

const subTitleStyle: React.CSSProperties = {
  fontSize: '1.5em',
  fontWeight: '600',
  marginTop: '20px',
  marginBottom: '20px',
};

const paragraphStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '10px 0 30px 0',
  fontSize: '1.1em',
  color: 'rgba(255, 255, 255, 0.85)', // Putih transparan
};

// --- STYLE KHUSUS UNTUK TOMBOL ---
const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '300px', // Batasi lebar tombol
    gap: '16px', // Memberikan spasi 16px antar tombol
    margin: '20px 0',
};

const linkStyleBase: React.CSSProperties = {
    width: '100%', // Tombol mengambil lebar penuh container
    padding: '15px 20px',
    fontSize: '1.2em',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    transition: 'background-color 0.3s, transform 0.1s',
    fontWeight: 'bold',
};

const oxoxLinkStyle: React.CSSProperties = {
    ...linkStyleBase,
    backgroundColor: '#388E3C', // Hijau yang lebih gelap
};

const chessLinkStyle: React.CSSProperties = {
    ...linkStyleBase,
    backgroundColor: '#1976D2', // Biru yang lebih gelap
};


// --- PAGE COMPONENT ---
const IndexPage: NextPage = () => {
  
    // Domain aplikasi live Anda
    const APP_DOMAIN = "https://farcaster-achivement.vercel.app";
    // URL untuk gambar pratinjau Mini App
    // MENGGUNAKAN IMAGE PLACEHOLDER SEMENTARA
    const EMBED_IMAGE_URL = "https://i.imgur.com/K5b1V2I.png"; // Placeholder image (Base logo)

  return (
    <>
        <Head>
            {/* META TAG KRITIS UNTUK DISCOVERY MINI APP DI FARCASTER */}
            {/* CATATAN: URL gambar telah diganti dengan placeholder yang valid */}
            <meta name="fc:miniapp" content={`{
                "version":"next",
                "imageUrl":"${EMBED_IMAGE_URL}",
                "button":{
                    "title":"Launch Farcaster Games",
                    "action":{
                        "type":"launch_miniapp",
                        "name":"Farcaster Games Hub",
                        "url":"${APP_DOMAIN}"
                    }
                }
            }`} />
        </Head>
        <div style={containerStyle}>
      
          {/* JUDUL UTAMA */}
          <h1 style={titleStyle}>🎮 Farcaster Games</h1>
      
          {/* DESKRIPSI UTAMA */}
          <p style={paragraphStyle}>
            Welcome to Farcaster Games! This is your hub for fun, challenging mini-games built for the Farcaster ecosystem. Start playing against the AI now!
          </p>
      
          <h2 style={subTitleStyle}>Ready to Play?</h2>
      
          {/* CONTAINER TOMBOL: Memastikan tombol menumpuk */}
          <div style={buttonContainerStyle}>
        
            {/* TOMBOL OXOX */}
            <Link href="/oxox" style={oxoxLinkStyle}>
              ❌⭕ Play OXOX 5x5
            </Link>
            
            {/* TOMBOL CHESS (Ditambahkan, diasumsikan Anda punya halaman /chess) */}
            <Link href="/chess" style={chessLinkStyle}>
              ♟️ Play Chess vs AI
            </Link>

          </div>
      
          <p style={{ marginTop: '20px', fontSize: '1.1em', color: 'rgba(255, 255, 255, 0.7)' }}>
            🚀 More Games and Onchain Achievements Coming Soon...
          </p>

          <p style={{ marginTop: '10px', fontSize: '0.9em', color: 'rgba(255, 255, 255, 0.6)' }}>
            You can support me on ETH:{" "}
            <span style={{ color: '#E0B0FF' }}>
              0x3f05e8770134e70A7ACD907C2725d8DA64f0fBfe
            </span>
          </p>
      
        </div>
    </>
  );
};

export default IndexPage;
