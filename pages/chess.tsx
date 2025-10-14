import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import React, { useState } from 'react';

// Import komponen game yang sudah diperbaiki
import dynamic from 'next/dynamic';

// Dynamic Import (PENTING untuk Pages Router juga)
const ChessGame = dynamic(() => import('../components/ChessGame'), {
    ssr: false, 
});

// --- STYLE OBJECTS ---

const GRADIENT_BACKGROUND = 'linear-gradient(180deg, #300050 0%, #1a0030 100%)'; 
const IS_DARK_THEME = true;

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
    display: 'inline-block',
};

// Tombol Reset Baru
const resetButton: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#D32F2F', // Merah
    marginRight: '15px',
};


const ChessPage: NextPage = () => {
    // Gunakan 'key' pada komponen ChessGame untuk memaksa mount/unmount saat reset
    const [gameKey, setGameKey] = useState(0); 
    const [gameOver, setGameOver] = useState(false);
    const [result, setResult] = useState<'You' | 'AI' | 'Draw' | ''>('');

    const handleGameOver = (res: 'You' | 'AI' | 'Draw') => {
        setResult(res);
        setGameOver(true);
    };
    
    const handleReset = () => {
        setGameOver(false);
        setResult('');
        setGameKey(prevKey => prevKey + 1); // Ganti key untuk mereset ChessGame
    };

    return (
        <div style={containerStyle}>
            <Head>
                <title>Chess vs AI - Farcaster Games</title>
            </Head>

            <h1 style={titleStyle}>♟️ Chess Game (vs AI Acak)</h1>
            
            {/* ChessGame ditampilkan di sini. Gunakan key untuk memaksa render ulang saat reset */}
            <ChessGame key={gameKey} onGameOver={handleGameOver} isDarkTheme={IS_DARK_THEME} />
            
            {/* Area Tombol Reset dan Navigasi */}
            <div style={{ marginTop: '20px' }}>
                {gameOver && (
                    <button onClick={handleReset} style={resetButton}>
                        Mulai Ulang Game
                    </button>
                )}
                <Link href="/" style={buttonStyle}>
                    Kembali ke Home
                </Link>
            </div>
        </div>
    );
};

export default ChessPage;