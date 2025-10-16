// pages/minesweeper.tsx
import { useState, useEffect } from "react";
import Link from "next/link";

const ROWS = 8;
const COLS = 8;
const BOMBS = 10;

type Cell = {
  isOpen: boolean;
  hasBomb: boolean;
  flagged: boolean;
  count: number;
};

const generateGrid = (): Cell[][] => {
  const grid: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isOpen: false,
      hasBomb: false,
      flagged: false,
      count: 0
    }))
  );

  // Place bombs randomly
  let bombsPlaced = 0;
  while (bombsPlaced < BOMBS) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!grid[r][c].hasBomb) {
      grid[r][c].hasBomb = true;
      bombsPlaced++;
    }
  }

  // Calculate numbers
  const directions = [
    [-1,-1],[-1,0],[-1,1],
    [0,-1],       [0,1],
    [1,-1],[1,0],[1,1]
  ];

  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      if(grid[r][c].hasBomb) continue;
      let count = 0;
      directions.forEach(([dr,dc])=>{
        const nr = r+dr, nc=c+dc;
        if(nr>=0 && nr<ROWS && nc>=0 && nc<COLS && grid[nr][nc].hasBomb){
          count++;
        }
      });
      grid[r][c].count = count;
    }
  }

  return grid;
};

export default function MinesweeperPage() {
  const [grid, setGrid] = useState<Cell[][]>(generateGrid());
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const openCell = (r:number, c:number) => {
    if(gameOver || win) return;
    const newGrid = grid.map(row => row.map(cell => ({...cell})));
    const cell = newGrid[r][c];
    if(cell.isOpen || cell.flagged) return;

    cell.isOpen = true;

    if(cell.hasBomb){
      setGameOver(true);
    } else if(cell.count===0){
      // open neighbors recursively
      const directions = [
        [-1,-1],[-1,0],[-1,1],
        [0,-1],       [0,1],
        [1,-1],[1,0],[1,1]
      ];
      directions.forEach(([dr,dc])=>{
        const nr = r+dr, nc=c+dc;
        if(nr>=0 && nr<ROWS && nc>=0 && nc<COLS){
          if(!newGrid[nr][nc].isOpen && !newGrid[nr][nc].hasBomb){
            openCell(nr,nc);
          }
        }
      });
    }

    setGrid(newGrid);

    // check win
    const allOpened = newGrid.every(row =>
      row.every(cell => cell.isOpen || cell.hasBomb)
    );
    if(allOpened) setWin(true);
  };

  const toggleFlag = (e:React.MouseEvent, r:number, c:number) => {
    e.preventDefault();
    if(gameOver || win) return;
    const newGrid = grid.map(row => row.map(cell => ({...cell})));
    newGrid[r][c].flagged = !newGrid[r][c].flagged;
    setGrid(newGrid);
  };

  const resetGame = () => {
    setGrid(generateGrid());
    setGameOver(false);
    setWin(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1a0030] text-white py-10 px-4 font-sans">
      <h1 className="text-4xl font-extrabold mb-4 text-[#FFD700]">💣 Minesweeper</h1>

      <p className="text-lg mb-4 font-semibold">
        {gameOver ? "💥 Game Over!" : win ? "🎉 You Win!" : `Bombs: ${BOMBS}`}
      </p>

      <div className="grid grid-cols-8 gap-1">
        {grid.map((row,r)=>
          row.map((cell,c)=>(
            <div key={`${r}-${c}`}
              onClick={()=>openCell(r,c)}
              onContextMenu={(e)=>toggleFlag(e,r,c)}
              className={`w-10 h-10 flex items-center justify-center font-bold cursor-pointer select-none
                ${cell.isOpen ? (cell.hasBomb ? "bg-red-600" : "bg-gray-400") : "bg-gray-800"}
              `}
            >
              {cell.isOpen && !cell.hasBomb && cell.count>0 ? cell.count : cell.flagged ? "🚩" : ""}
              {gameOver && cell.hasBomb ? "💣" : ""}
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col items-center gap-3 mt-6">
        <button onClick={resetGame} className="base-button play-again">Play Again 🔄</button>
        <Link href="/" className="base-button back-hub">Back to Hub 🏠</Link>
      </div>

      <style jsx>{`
        .base-button {
          padding: 10px 18px;
          font-size: 1em;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          transition: background-color 0.3s, transform 0.1s;
        }
        .base-button:active { transform: scale(0.97); }
        .play-again { background-color: #c084fc; color:white; }
        .back-hub { background-color: #38bdf8; color:#0f172a; text-decoration:none; }
      `}</style>
    </div>
  );
}
