import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import React, { useState } from 'react'; // PERBAIKAN: Import useState

// Import komponen game yang sudah diperbaiki
import ChessGame from '../components/ChessGame'; 

// --- STYLE OBJECTS (Consisten with your dark design) ---

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
    display: 'inline-block', // Penting untuk tombol Link
};


const ChessPage: NextPage = () => {
    // State untuk menangani Game Over
    const [gameOver, setGameOver] = useState(false);
    const [result, setResult] = useState<string>('');

    const handleGameOver = (res: "You" | "AI" | "Draw") => {
        setResult(res);
        setGameOver(true);
        console.log(`Game Over! Winner: ${res}`);
    };

    return (
        <div style={containerStyle}>
            <Head>
                <title>Chess vs AI - Farcaster Games</title>
            </Head>

            <h1 style={titleStyle}>♟️ Chess Game (vs AI)</h1>
            
            {/* Tampilkan pesan Game Over atau komponen Game */}
            {gameOver ? (
                <div style={{ padding: '40px', backgroundColor: '#300050', borderRadius: '10px', marginTop: '30px' }}>
                    <h2 style={{ color: '#FFD700', fontSize: '1.5em' }}>Game Over!</h2>
                    <p style={{ marginTop: '10px' }}>Result: {result === 'You' ? 'You Win!' : result === 'AI' ? 'AI Wins!' : 'It\'s a Draw!'}</p>
                </div>
            ) : (
                <ChessGame onGameOver={handleGameOver} isDarkTheme={IS_DARK_THEME} />
            )}
            
            <Link href="/" style={buttonStyle}>
                Back to Home
            </Link>
        </div>
    );
};

export default ChessPage;