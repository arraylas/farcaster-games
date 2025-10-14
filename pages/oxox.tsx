import { useState, useCallback, useMemo, useEffect } from 'react';
import type { NextPage } from 'next';
import styles from '../styles/Oxox.module.css'; 

// Game Constants
const BOARD_SIZE = 9;
const WIN_COUNT = 5; // Winning condition: 5 symbols in a row

type Symbol = 'X' | 'O' | null;

// ==========================================================
// Cell Component (Reusable UI)
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
// Winning Logic Function (Checks for WIN_COUNT symbols in a line)
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

    // Note: The logic for checking Horizontal, Vertical, and Diagonal lines is extensive 
    // for a 9x9 board and should be copied fully from the previous response here.
    // --- (Insert full checkWinner logic here) ---
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
// 🧠 SIMPLE AI LOGIC (Random Move)
// ==========================================================

const getAiMove = (boardState: Symbol[]): number => {
    // Strategy: Find a random empty cell
    const emptyIndices: number[] = [];
    boardState.forEach((value, index) => {
        if (value === null) {
            emptyIndices.push(index);
        }
    });

    if (emptyIndices.length > 0) {
        // Pick a random empty index
        const randomIndex = Math.floor(Math.random() * emptyIndices.length);
        return emptyIndices[randomIndex];
    }
    return -1; // No available moves
};

// ==========================================================
// Main Game Component
// ==========================================================

const TicTacToe9x9: NextPage = () => {
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
        // X is the Human Player, O is the AI (Computer)
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


    // ==========================================================
    // EFFECT FOR AI TURN
    // ==========================================================
    useEffect(() => {
        // Only run if it's NOT 'X's turn (i.e., it's 'O's turn) and the game is active
        if (!isXNext && gameActive) {
            const aiTurn = async () => {
                // Introduce a slight delay for better UX (simulating "thinking")
                await new Promise(resolve => setTimeout(resolve, 500)); 

                const moveIndex = getAiMove(boardState);
                
                if (moveIndex !== -1) {
                    makeMove(moveIndex);
                }
            };
            aiTurn();
        }
    }, [isXNext, gameActive, boardState, makeMove]); 

    
    // Handler for human player click (only allowed on 'X' turn)
    const handlePlayerClick = (index: number) => {
        if (isXNext) {
            makeMove(index);
        }
    };

    const resetGame = () => {
        setBoardState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
        setIsXNext(true); // Player 'X' always starts
    };

    return (
        <div className={styles.container}>
            <h1>XOXO 9x9 (VS Computer)</h1>
            <div className={styles.status}>{status}</div>

            {/* Game Board */}
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
                        // Use handlePlayerClick to block clicks during AI turn
                        onClick={() => handlePlayerClick(index)} 
                    />
                ))}
            </div>

            <button onClick={resetGame} className={styles.resetButton}>
                Restart Game
            </button>
        </div>
    );
}

export default TicTacToe9x9;                                                                                                                                                                                                                                                                                                                                    setBoard(newBoard);

                                                                                                                                                                                                                                                                                                                                          const winner = checkWinner(newBoard);
                                                                                                                                                                                                                                                                                                                                              if(winner){ setGameOver(true); handleWin(winner); }
                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                  function handleWin(winner:string){
                                                                                                                                                                                                                                                                                                                                                      if(winner==='X'){
                                                                                                                                                                                                                                                                                                                                                            setWinnerMessage('You won!');
                                                                                                                                                                                                                                                                                                                                                                  setScore(prev=>prev+1);
                                                                                                                                                                                                                                                                                                                                                                        updateLeaderboard(user?.username||'You',1);
                                                                                                                                                                                                                                                                                                                                                                            } else if(winner==='O'){
                                                                                                                                                                                                                                                                                                                                                                                  setWinnerMessage('Computer won!');
                                                                                                                                                                                                                                                                                                                                                                                      } else {
                                                                                                                                                                                                                                                                                                                                                                                            setWinnerMessage("It's a draw!");
                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                                                                                                                                                                                    function updateLeaderboard(player:string, points:number){
                                                                                                                                                                                                                                                                                                                                                                                                        const allTime = JSON.parse(localStorage.getItem('leaderboard')||'[]');
                                                                                                                                                                                                                                                                                                                                                                                                            allTime.push({player, points, date:new Date().toISOString()});
                                                                                                                                                                                                                                                                                                                                                                                                                localStorage.setItem('leaderboard', JSON.stringify(allTime));
                                                                                                                                                                                                                                                                                                                                                                                                                    setLeaderboard(allTime.filter(item=>new Date(item.date) >= getWeekStart()));
                                                                                                                                                                                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                                                                                                                                                                                        async function shareResult(){
                                                                                                                                                                                                                                                                                                                                                                                                                            const winner = checkWinner(board);
                                                                                                                                                                                                                                                                                                                                                                                                                                let text:string;
                                                                                                                                                                                                                                                                                                                                                                                                                                    if(winner==='X') text="I won against the computer in OXOX 9x9!";
                                                                                                                                                                                                                                                                                                                                                                                                                                        else if(winner==='O') text="The computer won in OXOX 9x9!";
                                                                                                                                                                                                                                                                                                                                                                                                                                            else text="It's a draw in OXOX 9x9!";

                                                                                                                                                                                                                                                                                                                                                                                                                                                try{
                                                                                                                                                                                                                                                                                                                                                                                                                                                      if(user){
                                                                                                                                                                                                                                                                                                                                                                                                                                                              const sdkModule = await import('@farcaster/mini-app-sdk');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                      const { useMiniApp } = sdkModule;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              const { user: sdkUser } = useMiniApp();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      await sdkUser.share({ text });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              alert('Result shared to Farcaster!');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    } else {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            const url = `https://farcaster.xyz/share?text=${encodeURIComponent(text)}`;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    window.open(url, '_blank');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              } catch(e){
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    console.error(e);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          alert('Failed to share result.');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  function resetBoard(){
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      setBoard(Array(SIZE*SIZE).fill(null));
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          setGameOver(false);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              setWinnerMessage('');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  return (
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      <div style={{display:'flex', flexDirection:'column', alignItems:'center', padding:'20px'}}>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <h2>OXOX 9x9 vs Computer</h2>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <div style={{ display:'grid', gridTemplateColumns:`repeat(${SIZE},40px)`, gap:'2px', marginTop:'10px'}}>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          {board.map((val,idx)=>(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <button key={idx} 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      onClick={()=>handleClick(idx)} 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        disabled={gameOver || val!==null} 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          style={{width:'40px', height:'40px', fontSize:'20px'}}>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      {val}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ))}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div style={{marginTop:'15px'}}>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <button onClick={resetBoard} style={{padding:'10px 20px'}}>Reset</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <button onClick={shareResult} style={{padding:'10px 20px', marginLeft:'5px'}}>Share Result</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                {winnerMessage && <div style={{marginTop:'10px', fontWeight:'bold'}}>{winnerMessage}</div>}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      <div style={{marginTop:'15px'}}>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              <h3>Weekly Leaderboard</h3>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      <ol>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                {leaderboard.sort((a,b)=>b.points-a.points).map((item,i)=>(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <li key={i}>{item.player}: {item.points}</li>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ))}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </ol>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          <div style={{marginTop:'10px'}}>Current Score: {score}</div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }
