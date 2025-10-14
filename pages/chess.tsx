// pages/chess.tsx (File utama)

import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import ChessGameBoard from '../components/ChessGameBoard'; // Asumsikan Anda memindahkan komponen ke components/ChessGameBoard.tsx

// --- STYLE OBJECTS (Consisten with your dark design) ---

const BACKGROUND_COLOR = '#3a065f'; 
const GRADIENT_BACKGROUND = 'linear-gradient(180deg, #300050 0%, #1a0030 100%)'; 
const IS_DARK_THEME = true; // Flag untuk komponen game board

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  minHeight: '100vh',
  padding: '20px',
  textAlign: 'center',
  fontFamily: 'Arial, sans-serif',
  color: 'white',
  backgroundImage: GRADIENT_BACKGROUND,
};

const titleStyle: React.CSSProperties = {
  fontSize: '2.0em',
  fontWeight: 'bold',
  marginTop: '20px',
  marginBottom: '20px',
  color: '#90CAF9', 
};

const buttonStyle: React.CSSProperties = {
    marginTop: '30px',
    padding: '10px 20px',
    fontSize: '1em',
    backgroundColor: '#1976D2', 
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
};


const ChessPage: NextPage = () => {
    // Fungsi dummy onGameOver
    const handleGameOver = (result: "You" | "AI" | "Draw") => {
        console.log(`Game Over! Winner: ${result}`);
        // TODO: Implementasi UI untuk Game Over dan tombol Share
    };

    return (
        <div style={containerStyle}>
            <Head>
                <title>Chess vs AI - Farcaster Games</title>
            </Head>

            <h1 style={titleStyle}>♟️ Chess Game (vs AI)</h1>
            
            {/* Menggunakan komponen board yang sudah diperbaiki */}
            <ChessGameBoard onGameOver={handleGameOver} isDarkTheme={IS_DARK_THEME} />
            
            <Link href="/" style={buttonStyle}>
                Back to Home
            </Link>
        </div>
    );
};

export default ChessPage;
