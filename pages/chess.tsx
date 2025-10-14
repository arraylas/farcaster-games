// pages/chess.tsx (VERSI FINAL DENGAN CSS TERPISAH)
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useCallback } from 'react';

// Import komponen ChessGame (sudah diperbaiki sebelumnya)
import ChessGame from '../components/ChessGame'; 
// Import file CSS yang baru dibuat
import '../styles/ChessPage.css'; 

// --- PAGE COMPONENT ---
const ChessPage: NextPage = () => {
    // State untuk menyimpan hasil game (You, AI, Draw, atau null jika sedang bermain)
    const [gameResult, setGameResult] = useState<'You' | 'AI' | 'Draw' | null>(null);

    const handleGameOver = useCallback((result: 'You' | 'AI' | 'Draw') => {
        setGameResult(result);
    }, []);

    const resetGame = useCallback(() => {
        // Mengatur ulang state untuk me-render ulang ChessGame
        setGameResult(null); 
    }, []);

    const statusMessage = gameResult 
        ? `Game Over! ${gameResult === 'You' ? 'You Won!' : gameResult === 'AI' ? 'AI Won!' : 'Draw!'}`
        : "White's Turn (w)";


    return (
        <>
            <Head>
                <title>Chess vs AI - Farcaster Games</title>
            </Head>
            
            {/* Menggunakan class dari ChessPage.css */}
            <div className="chess-page-container">
                
                <h1 className="page-title">♟️ Chess vs AI ♚</h1>
                
                <p className="game-status">{statusMessage}</p>

                {/* ChessGame tetap di sini */}
                <ChessGame 
                    key={gameResult === null ? 'playing' : 'reset'} 
                    onGameOver={handleGameOver} 
                    isDarkTheme={true}
                />

                {(gameResult !== null) && (
                    <button 
                        className="base-button new-game-button" // Menggunakan class
                        onClick={resetGame}
                    >
                        Start New Game
                    </button>
                )}
                
                <Link href="/" className="base-button home-link-button">
                    Back to Main Menu
                </Link>

            </div>
        </>
    );
};

export default ChessPage;