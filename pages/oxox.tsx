import { useState, useCallback, useMemo, useEffect } from 'react';
import type { NextPage } from 'next';
import styles from '../styles/Oxox.module.css'; 

// Game Constants
const BOARD_SIZE = 5; // Board is 5x5
const WIN_COUNT = 4; // 4-in-a-row to win

type Symbol = 'X' | 'O' | null;

// ==========================================================
// Cell Component (UI)
// ==========================================================

interface CellProps {
    value: Symbol;
    onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ value, onClick }) => {
    return (
        <div
            className={`${styles.cell} ${value ? styles[value] : ''}`}
            onClick={onClick}
        >
            {value}
        </div>
    );
};

// ==========================================================
// Winning Logic Function
// ==========================================================

const checkWinner = (boardState: Symbol[]): Symbol => {
    const size = BOARD_SIZE;
    const count = WIN_COUNT;

    const checkLine = (line: number[]): Symbol => {
        const symbols = line.map(index => boardState[index]);
        const firstSymbol = symbols[0];
        if (firstSymbol && symbols.every(symbol => symbol === firstSymbol)) {
            return firstSymbol;
        }
        return null;
    };

    // Check all lines (Horizontal, Vertical, Diagonals)
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            // Horizontal check
            if (col <= size - count) {
                let hLine: number[] = [];
                for(let k = 0; k < count; k++) hLine.push(row * size + col + k);
                const hWinner = checkLine(hLine);
                if (hWinner) return hWinner;
            }
            
            // Vertical check
            if (row <= size - count) {
                let vLine: number[] = [];
                for(let k = 0; k < count; k++) vLine.push((row + k) * size + col);
                const vWinner = checkLine(vLine);
                if (vWinner) return vWinner;
            }

            // Diagonal Top-Left to Bottom-Right check
            if (row <= size - count && col <= size - count) {
                let diag1: number[] = [];
                for(let k = 0; k < count; k++) diag1.push((row + k) * size + col + k);
                const d1Winner = checkLine(diag1);
                if (d1Winner) return d1Winner;
            }

            // Diagonal Top-Right to Bottom-Left check
            if (row <= size - count && col >= count - 1) {
                let diag2: number[] = [];
                for(let k = 0; k < count; k++) diag2.push((row + k) * size + col - k);
                const d2Winner = checkLine(diag2);
                if (d2Winner) return d2Winner;
            }
        }
    }

    return null;
};


// ==========================================================
// 🧠 SMARTER AI LOGIC (Winning & Blocking)
// ==========================================================

const getAiMove = (boardState: Symbol[]): number => {
    const emptyIndices: number[] = [];
    boardState.forEach((value, index) => {
        if (value === null) {
            emptyIndices.push(index);
        }
    });

    if (emptyIndices.length === 0) {
        return -1;
    }

    const findWinningMove = (currentPlayer: Symbol): number => {
        for (const index of emptyIndices) {
            const tempBoard = [...boardState];
            tempBoard[index] = currentPlayer;
            if (checkWinner(tempBoard) === currentPlayer) {
                return index;
            }
        }
        return -1;
    };

    // 1. Check if AI ('O') can win in the next move
    const aiWinningMove = findWinningMove('O');
    if (aiWinningMove !== -1) {
        return aiWinningMove;
    }

    // 2. Check if Player ('X') can win in the next move and block it
    const playerWinningMove = findWinningMove('X');
    if (playerWinningMove !== -1) {
        return playerWinningMove;
    }

    // 3. If no immediate win or block, pick a random available move
    const randomIndex = Math.floor(Math.random() * emptyIndices.length);
    return emptyIndices[randomIndex];
};

// ==========================================================
// Main Game Component
// ==========================================================

const TicTacToe5x5: NextPage = () => {
    const [boardState, setBoardState] = useState<Symbol[]>(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    const [isXNext, setIsXNext] = useState(true);

    const winner = useMemo(() => checkWinner(boardState), [boardState]);
    const isDraw = !winner && boardState.every(cell => cell !== null);
    const gameActive = !winner && !isDraw;
    
    // Game Status Message
    let status: string;
    if (winner) {
        status = `Winner: ${winner}!`;
    } else if (isDraw) {
        status = `It's a Draw!`;
    } else {
        status = `Next player: ${isXNext ? 'You (X)' : 'Computer (O)'}`;
    }

    // Core function to execute a move
    const makeMove = useCallback((index: number) => {
        if (boardState[index] || !gameActive) {
            return;
        }

        const newBoardState = boardState.slice();
        newBoardState[index] = isXNext ? 'X' : 'O';
        
        setBoardState(newBoardState);
        setIsXNext(!isXNext); // Toggle turn
    }, [boardState, isXNext, gameActive]);


    // EFFECT FOR AI TURN
    useEffect(() => {
        if (!isXNext && gameActive) {
            const aiTurn = async () => {
                await new Promise(resolve => setTimeout(resolve, 500)); 

                const moveIndex = getAiMove(boardState);
                
                if (moveIndex !== -1) {
                    makeMove(moveIndex);
                }
            };
            aiTurn();
        }
    }, [isXNext, gameActive, boardState, makeMove]); 

    
    // Handler for human player click
    const handlePlayerClick = (index: number) => {
        if (isXNext) {
            makeMove(index);
        }
    };

    const resetGame = () => {
        setBoardState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
        setIsXNext(true); // Player 'X' always starts
    };

    // Function to create a Farcaster cast
    const handleShareCast = () => {
        let message = '';
        // TODO: GANTI [link-to-your-miniapp] dengan URL yang sudah dideploy
        const appUrl = 'https://[link-to-your-miniapp].vercel.app/oxox'; 

        if (winner) {
            message = `I just won as ${winner} in the XOXO 5x5 MiniApp! Can you beat the computer? Play here: ${appUrl}`;
        } else if (isDraw) {
            message = `It was a draw in the XOXO 5x5 MiniApp! Try your luck: ${appUrl}`;
        } else {
            message = `Check out this XOXO 5x5 MiniApp! Play against the computer: ${appUrl}`;
        }
        
        const farcasterCastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(message)}`;
        window.open(farcasterCastUrl, '_blank');
    };


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>XOXO 5x5 (4-in-a-row VS Computer)</h1> 
            <div className={styles.status}>{status}</div>

            {/* Game Board (Grid 5x5) */}
            <div 
                className={styles.board}
                style={{
                    gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                    gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
                }}
            >
                {boardState.map((value, index) => (
                    <Cell 
                        key={index} 
                        value={value} 
                        onClick={() => handlePlayerClick(index)} 
                    />
                ))}
            </div>

            {/* Restart and Share Buttons */}
            <div style={{ display: 'flex', marginTop: '10px' }}>
                <button onClick={resetGame} className={styles.resetButton}>
                    Restart Game
                </button>
                { (winner || isDraw) && ( 
                    <button onClick={handleShareCast} className={styles.shareButton}>
                        Share to Farcaster 🎙️
                    </button>
                )}
            </div>
        </div>
    );
}

export default TicTacToe5x5;
