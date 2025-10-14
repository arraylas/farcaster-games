import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- CONSTANTS ---
const BOARD_SIZE = 8;
const BACKGROUND_COLOR = '#300050'; // Dark Purple
const LIGHT_SQUARE_COLOR = '#90CAF9'; // Light Blue/Cyan
const DARK_SQUARE_COLOR = '#5e35b1'; // Darker Purple
const HIGHLIGHT_COLOR = 'rgba(255, 255, 0, 0.5)'; // Yellow transparent for moves

// --- PIECE MAPPING (Internal string representation to Unicode symbols) ---
const PIECE_SYMBOLS: { [key: string]: string } = {
    wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
    bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
};

// --- INITIAL BOARD SETUP (Internal string representation) ---
const INITIAL_BOARD: (string | null)[][] = [
    ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
    ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
    ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
];

// --- STYLE OBJECTS ---

const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif',
    color: 'white',
    backgroundColor: BACKGROUND_COLOR,
};

const titleStyle: React.CSSProperties = {
    fontSize: '2em',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#E0B0FF', // Lighter Purple
};

const statusStyle: React.CSSProperties = {
    fontSize: '1.2em',
    fontWeight: '600',
    margin: '15px 0',
    color: '#90CAF9', // Light Blue
};

const boardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
    gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
    gap: '0',
    width: 'min(95vw, 450px)', // Responsive and max 450px
    height: 'min(95vw, 450px)',
    aspectRatio: '1 / 1',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
    borderRadius: '8px',
    overflow: 'hidden',
};

const baseButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: '1em',
    fontWeight: 'bold',
    color: BACKGROUND_COLOR,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    transition: 'background-color 0.3s, transform 0.1s',
};

const newGameButtonStyle: React.CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: '#E0B0FF',
};

const homeLinkStyle: React.CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: '#90CAF9',
    textDecoration: 'none',
    display: 'block',
    width: 'fit-content',
    marginTop: '15px',
};

// --- GAME LOGIC HELPERS ---

/**
 * Gets the color (w or b) of a piece.
 */
const getPieceColor = (piece: string | null): 'w' | 'b' | null => {
    if (!piece) return null;
    return piece[0] === 'w' ? 'w' : 'b';
};

/**
 * Checks if the path between two squares is clear (exclusive of start and end).
 * This is used for Rook, Bishop, and Queen movements.
 * Knights and single-step moves (King/Pawn captures) do not use this.
 */
const isPathClear = (board: (string | null)[][], from: { r: number, c: number }, to: { r: number, c: number }): boolean => {
    const dr = to.r - from.r;
    const dc = to.c - from.c;
    const absDr = Math.abs(dr);
    const absDc = Math.abs(dc);

    // Diagonal movement
    if (absDr === absDc && absDr > 1) {
        const rStep = dr > 0 ? 1 : -1;
        const cStep = dc > 0 ? 1 : -1;
        for (let i = 1; i < absDr; i++) {
            if (board[from.r + i * rStep][from.c + i * cStep] !== null) {
                return false; // Path blocked
            }
        }
        return true;
    } 
    // Horizontal movement
    else if (absDr === 0 && absDc > 1) {
        const cStep = dc > 0 ? 1 : -1;
        for (let i = 1; i < absDc; i++) {
            if (board[from.r][from.c + i * cStep] !== null) {
                return false; // Path blocked
            }
        }
        return true;
    } 
    // Vertical movement
    else if (absDc === 0 && absDr > 1) {
        const rStep = dr > 0 ? 1 : -1;
        for (let i = 1; i < absDr; i++) {
            if (board[from.r + i * rStep][from.c] !== null) {
                return false; // Path blocked
            }
        }
        return true;
    } 
    
    // For single-step moves (King) or L-shaped moves (Knight), the path is vacuously clear.
    return true; 
};

/**
 * Checks if a move is valid based on a simplified set of chess rules.
 * NOTE: This update includes path blocking for Rooks, Bishops, and Queens.
 * It still does NOT check for Check/Checkmate, Castling, En Passant, or Pawn Promotion.
 */
const isValidMove = (board: (string | null)[][], from: { r: number, c: number }, to: { r: number, c: number }): boolean => {
    // Basic bounds check (not strictly needed since we iterate 0-7, but good practice)
    if (to.r < 0 || to.r >= BOARD_SIZE || to.c < 0 || to.c >= BOARD_SIZE) return false;

    const piece = board[from.r][from.c];
    if (!piece) return false;

    const pieceType = piece[1];
    const pieceColor = getPieceColor(piece)!;
    const targetPiece = board[to.r][to.c];
    const targetColor = getPieceColor(targetPiece);

    // Rule 1: Cannot capture your own piece
    if (targetColor && targetColor === pieceColor) return false;

    const dr = Math.abs(from.r - to.r);
    const dc = Math.abs(from.c - to.c);

    // --- Piece specific rules (Including Path Check) ---
    switch (pieceType) {
        case 'P': // Pawn
            const direction = pieceColor === 'w' ? -1 : 1; // White moves up (r-1), Black moves down (r+1)
            const rowDiff = to.r - from.r;

            // 1. Forward move (no capture)
            if (from.c === to.c) {
                if (targetPiece) return false; // Cannot capture straight ahead
                if (rowDiff === direction) return true; // Single step
                // Initial two-step move
                if (rowDiff === 2 * direction && ((pieceColor === 'w' && from.r === 6) || (pieceColor === 'b' && from.r === 1))) {
                    // Must check if the square in between is empty (path clear for 2 steps)
                    if (board[from.r + direction][from.c] === null) {
                        return true;
                    }
                }
            }
            // 2. Capture (diagonal)
            if (dc === 1 && rowDiff === direction && targetPiece) return true;
            return false;

        case 'R': // Rook
            if (dr === 0 || dc === 0) { // Horizontal or Vertical
                return isPathClear(board, from, to);
            }
            return false;

        case 'N': // Knight
            if ((dr === 2 && dc === 1) || (dr === 1 && dc === 2)) return true; // Knights jump, so path is irrelevant
            return false;

        case 'B': // Bishop
            if (dr === dc) { // Diagonal
                return isPathClear(board, from, to);
            }
            return false;

        case 'Q': // Queen
            if (dr === 0 || dc === 0 || dr === dc) { // Horizontal, Vertical, or Diagonal
                return isPathClear(board, from, to);
            }
            return false;

        case 'K': // King
            if (dr <= 1 && dc <= 1) return true; // Single step in any direction
            return false;

        default:
            return false;
    }
};

/**
 * Finds all legal moves for a player.
 * @returns Array of { from: {r, c}, to: {r, c} }
 */
const getPlayerLegalMoves = (board: (string | null)[][], playerColor: 'w' | 'b') => {
    const moves: { from: { r: number, c: number }, to: { r: number, c: number } }[] = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const piece = board[r][c];
            if (piece && getPieceColor(piece) === playerColor) {
                for (let tr = 0; tr < BOARD_SIZE; tr++) {
                    for (let tc = 0; tc < BOARD_SIZE; tc++) {
                        if (isValidMove(board, { r, c }, { r: tr, c: tc })) {
                            moves.push({ from: { r, c }, to: { r: tr, c: tc } });
                        }
                    }
                }
            }
        }
    }
    return moves;
};


// --- PAGE COMPONENT ---
const ChessPage: NextPage = () => {
    const [board, setBoard] = useState<(string | null)[][]>(INITIAL_BOARD);
    const [turn, setTurn] = useState<'w' | 'b'>('w');
    const [selectedSquare, setSelectedSquare] = useState<{ r: number, c: number } | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>("White's Turn (w)");
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [isAITurn, setIsAITurn] = useState<boolean>(false);

    // Determines squares that are legal targets for the currently selected piece
    const possibleMoves = useMemo(() => {
        if (!selectedSquare) return [];
        const moves: { r: number, c: number }[] = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (isValidMove(board, selectedSquare, { r, c })) {
                    moves.push({ r, c });
                }
            }
        }
        return moves;
    }, [board, selectedSquare]);

    // Update status message on turn change
    useEffect(() => {
        if (!isGameOver) {
            setStatusMessage(turn === 'w' ? "White's Turn (w)" : "Black's Turn (b) - AI");
        }
    }, [turn, isGameOver]);

    // AI Logic (Black is the AI)
    useEffect(() => {
        if (turn === 'b' && !isGameOver && !isAITurn) {
            setIsAITurn(true);
            setStatusMessage("Black's Turn (b) - AI is thinking...");

            setTimeout(() => {
                const legalMoves = getPlayerLegalMoves(board, 'b');
                
                if (legalMoves.length === 0) {
                    // Simplified: assume King is stuck or it's a draw
                    setIsGameOver(true);
                    setStatusMessage("Game Over! (Stalemate or Checkmate)");
                    setIsAITurn(false);
                    return;
                }

                // Choose a random legal move
                const move = legalMoves[Math.floor(Math.random() * legalMoves.length)];

                // Execute the move
                setBoard(prevBoard => {
                    const newBoard = prevBoard.map(row => [...row]);
                    newBoard[move.to.r][move.to.c] = newBoard[move.from.r][move.from.c];
                    newBoard[move.from.r][move.from.c] = null;
                    return newBoard;
                });

                setTurn('w');
                setIsAITurn(false);
            }, 1000); // 1 second delay for AI move
        }
    }, [turn, isGameOver, isAITurn, board]);


    const handleSquareClick = (r: number, c: number) => {
        if (isGameOver || turn !== 'w' || isAITurn) return;

        const clickedPiece = board[r][c];
        const clickedColor = getPieceColor(clickedPiece);
        
        // 1. Select/Deselect Piece
        if (!selectedSquare || (clickedColor === 'w' && selectedSquare.r === r && selectedSquare.c === c)) {
            if (clickedColor === 'w') {
                setSelectedSquare({ r, c });
            } else {
                setSelectedSquare(null);
            }
        // 2. Execute Move
        } else if (selectedSquare) {
            const isTargetLegal = possibleMoves.some(move => move.r === r && move.c === c);

            if (isTargetLegal) {
                // Execute the move
                setBoard(prevBoard => {
                    const newBoard = prevBoard.map(row => [...row]);
                    newBoard[r][c] = newBoard[selectedSquare.r][selectedSquare.c];
                    newBoard[selectedSquare.r][selectedSquare.c] = null;
                    return newBoard;
                });

                // Clear selection and switch turn
                setSelectedSquare(null);
                setTurn('b'); // Switch to AI (Black)
            } else {
                // Try selecting a new piece if it's white
                if (clickedColor === 'w') {
                    setSelectedSquare({ r, c });
                } else {
                    setSelectedSquare(null);
                }
            }
        }
    };
    
    const resetGame = useCallback(() => {
        setBoard(INITIAL_BOARD);
        setTurn('w');
        setSelectedSquare(null);
        setIsGameOver(false);
        setIsAITurn(false);
        setStatusMessage("White's Turn (w)");
    }, []);

    return (
        <>
            <Head>
                <title>Chess vs AI - Farcaster Games</title>
            </Head>
            <div style={containerStyle}>
                
                <h1 style={titleStyle}>♟️ Chess vs AI ♚</h1>
                
                <p style={statusStyle}>{statusMessage}</p>

                <div style={boardStyle}>
                    {board.map((row, r) => (
                        row.map((piece, c) => {
                            const isLight = (r + c) % 2 === 0;
                            const isSelected = selectedSquare?.r === r && selectedSquare?.c === c;
                            const isPossibleMove = possibleMoves.some(move => move.r === r && move.c === c);
                            
                            // Determine background color
                            let backgroundColor = isLight ? LIGHT_SQUARE_COLOR : DARK_SQUARE_COLOR;
                            if (isSelected) {
                                backgroundColor = 'red'; // Highlight selected piece clearly
                            } else if (isPossibleMove) {
                                backgroundColor = HIGHLIGHT_COLOR;
                            } else {
                                backgroundColor = isLight ? LIGHT_SQUARE_COLOR : DARK_SQUARE_COLOR;
                            }
                            
                            // Style for the piece symbol
                            const pieceDisplay = PIECE_SYMBOLS[piece || ''] || '';
                            const pieceStyle: React.CSSProperties = {
                                fontSize: '2.5em',
                                cursor: isGameOver || isAITurn ? 'default' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: backgroundColor,
                                color: getPieceColor(piece) === 'w' ? 'white' : 'black', // Invert colors for better contrast on the dark board
                            };

                            return (
                                <div 
                                    key={`${r}-${c}`}
                                    style={pieceStyle}
                                    onClick={() => handleSquareClick(r, c)}
                                >
                                    {pieceDisplay}
                                </div>
                            );
                        })
                    ))}
                </div>

                {(isGameOver || getPlayerLegalMoves(board, 'w').length === 0) && (
                    <button 
                        style={newGameButtonStyle} 
                        onClick={resetGame}
                    >
                        Start New Game
                    </button>
                )}
                
                <Link href="/" style={homeLinkStyle}>
                    Back to Main Menu
                </Link>

            </div>
        </>
    );
};

export default ChessPage;
