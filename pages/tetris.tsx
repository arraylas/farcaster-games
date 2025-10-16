import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Point = [number, number];
type Tetromino = { shape: Point[]; color: string };

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const TETROMINOS: Tetromino[] = [
  { shape: [[0,0],[1,0],[0,1],[1,1]], color: "#FFFF00" }, // O
  { shape: [[-1,0],[0,0],[1,0],[2,0]], color: "#00FFFF" }, // I
  { shape: [[-1,0],[0,0],[1,0],[1,1]], color: "#0000FF" }, // J
  { shape: [[-1,1],[-1,0],[0,0],[1,0]], color: "#FF7F00" }, // L
  { shape: [[-1,0],[0,0],[0,1],[1,1]], color: "#00FF00" }, // S
  { shape: [[-1,1],[0,1],[0,0],[1,0]], color: "#FF0000" }, // Z
  { shape: [[-1,0],[0,0],[1,0],[0,1]], color: "#800080" }  // T
];

const randomTetromino = () => TETROMINOS[Math.floor(Math.random()*TETROMINOS.length)];

export default function TetrisPage() {
  const [grid, setGrid] = useState<(string|null)[][]>(Array.from({length:ROWS},()=>Array(COLS).fill(null)));
  const [current, setCurrent] = useState<{x:number;y:number;tetromino:Tetromino}|null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const collides = (x:number,y:number,shape:Point[]) =>
    shape.some(([dx,dy])=>{
      const nx=x+dx, ny=y+dy;
      return nx<0||nx>=COLS||ny>=ROWS||(ny>=0&&grid[ny][nx]);
    });

  const merge = (x:number,y:number,shape:Point[],color:string)=>{
    const newGrid = grid.map(r=>[...r]);
    shape.forEach(([dx,dy])=>{
      const nx=x+dx, ny=y+dy;
      if(ny>=0) newGrid[ny][nx]=color;
    });
    return newGrid;
  };

  const clearLines = (g:(string|null)[][])=>{
    let cleared=0;
    const newGrid = g.filter(row=>{
      if(row.every(cell=>cell)){ cleared++; return false; }
      return true;
    });
    while(newGrid.length<ROWS) newGrid.unshift(Array(COLS).fill(null));
    setScore(prev=>prev+cleared*10);
    return newGrid;
  };

  const spawnTetromino = () => {
    const tet = randomTetromino();
    const newPos = { x: Math.floor(COLS/2), y: 0, tetromino: tet };
    if(collides(newPos.x,newPos.y,newPos.tetromino.shape)){
      // Game Over
      setGameOver(true);
      if(intervalRef.current) clearInterval(intervalRef.current);
      setCurrent(null);
    } else {
      setCurrent(newPos);
    }
  };

  const tick = () => {
    if(!current || gameOver) return;
    if(!collides(current.x,current.y+1,current.tetromino.shape)){
      setCurrent({...current, y: current.y+1});
    } else {
      let merged = merge(current.x,current.y,current.tetromino.shape,current.tetromino.color);
      merged = clearLines(merged);
      setGrid(merged);
      spawnTetromino();
    }
  };

  const move = (dx:number) => {
    if(!current || gameOver) return;
    if(!collides(current.x+dx,current.y,current.tetromino.shape)){
      setCurrent({...current, x: current.x+dx});
    }
  };

  const rotate = () => {
    if(!current || gameOver) return;
    const rotated:Point[] = current.tetromino.shape.map(([dx,dy])=>[-dy,dx]);
    if(!collides(current.x,current.y,rotated)){
      setCurrent({...current,tetromino:{...current.tetromino,shape:rotated}});
    }
  };

  const drop = () => {
    if(!current || gameOver) return;
    let y=current.y;
    while(!collides(current.x,y+1,current.tetromino.shape)) y++;
    setCurrent({...current,y});
    tick();
  };

  const resetGame = () => {
    setGrid(Array.from({length:ROWS},()=>Array(COLS).fill(null)));
    setScore(0);
    setGameOver(false);
    spawnTetromino();
    if(intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick,500);
  };

  useEffect(()=>{
    resetGame();
    return ()=>{ if(intervalRef.current) clearInterval(intervalRef.current); };
  },[]);

  useEffect(()=>{
    const handleKey = (e:KeyboardEvent)=>{
      switch(e.key){
        case "ArrowLeft": move(-1); break;
        case "ArrowRight": move(1); break;
        case "ArrowDown": tick(); break;
        case "ArrowUp": rotate(); break;
        case " ": drop(); break;
      }
    };
    window.addEventListener("keydown",handleKey);
    return ()=>window.removeEventListener("keydown",handleKey);
  },[current,grid,gameOver]);

  const renderGrid = () => {
    const display = grid.map(r=>[...r]);
    if(current){
      current.tetromino.shape.forEach(([dx,dy])=>{
        const nx=current.x+dx, ny=current.y+dy;
        if(ny>=0 && nx>=0 && nx<COLS) display[ny][nx]=current.tetromino.color;
      });
    }
    return display;
  };

  const shareFrame = () => {
    const frameUrl = `https://farcaster-achivement.vercel.app/frame?game=tetris&score=${score}`;
    const shareUrl = `https://warpcast.com/~/compose?text=I%20scored%20${score}%20in%20Tetris!&embeds[]=${encodeURIComponent(frameUrl)}`;
    window.open(shareUrl,"_blank");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1a0030] text-white py-10 px-4 font-sans">
      <h1 className="text-4xl font-extrabold mb-4 text-[#90CAF9]">🎮 Tetris</h1>
      <p className="text-lg text-purple-300 mb-4 font-semibold">Score: {score}</p>

      {/* Board */}
      <div
        className="relative p-2 rounded-lg"
        style={{
          width: COLS*BLOCK_SIZE,
          height: ROWS*BLOCK_SIZE,
          backgroundColor:"#1a0030"
        }}
      >
        {renderGrid().map((row,y)=>
          row.map((cell,x)=>(
            <div key={`${x}-${y}`}
              style={{
                position:"absolute",
                left:x*BLOCK_SIZE,
                top:y*BLOCK_SIZE,
                width:BLOCK_SIZE-2,
                height:BLOCK_SIZE-2,
                backgroundColor:cell||"#2c003d",
                border:"1px solid #111",
                boxSizing:"border-box",
                borderRadius:"3px",
                boxShadow:cell?`0 0 8px ${cell}`:"none"
              }}
            />
          ))
        )}

        {gameOver && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/70 text-3xl font-bold text-red-500 z-10">
            GAME OVER
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <button onClick={resetGame} className="base-button play-again">Play Again 🔄</button>
        <button onClick={shareFrame} className="base-button share-frame">Share Frame 📸</button>
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
        .share-frame { background-color: #7c4dff; color:white; }
        .back-hub { background-color: #38bdf8; color:#0f172a; text-decoration:none; }
      `}</style>
    </div>
  );
}
