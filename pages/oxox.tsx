import React, { useState, useEffect } from 'react';
import { shareToFarcaster } from '../utils'; // pastikan ada di repo utils

const SIZE = 9;
const WIN_COUNT = 3;

export default function OXOXGame() {
  const [board, setBoard] = useState(Array(SIZE*SIZE).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<{player:string, points:number, date:string}[]>([]);

  useEffect(() => {
    const currentLeaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    const weekly = currentLeaderboard.filter(item => new Date(item.date) >= getWeekStart());
    setLeaderboard(weekly);
  }, []);

  function getWeekStart() {
    const d = new Date();
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() - d.getDay()); // Sunday start
    return d;
  }

  function checkWinner(b:string[]) {
    function inBounds(x:number,y:number){ return x>=0 && x<SIZE && y>=0 && y<SIZE; }

    for(let y=0;y<SIZE;y++){
      for(let x=0;x<SIZE;x++){
        const player = b[y*SIZE + x];
        if(!player) continue;
        const dirs = [[1,0],[0,1],[1,1],[1,-1]];
        for(const [dx,dy] of dirs){
          let count = 0;
          for(let k=0;k<WIN_COUNT;k++){
            const nx = x + dx*k, ny = y + dy*k;
            if(inBounds(nx,ny) && b[ny*SIZE + nx] === player) count++;
          }
          if(count === WIN_COUNT) return player;
        }
      }
    }
    if(!b.includes(null)) return 'Draw';
    return null;
  }

  function handleClick(index:number) {
    if(board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if(winner){
      setGameOver(true);
      handleWin(winner);
      return;
    }

    setTimeout(computerMove, 500);
  }

  function computerMove() {
    const empty = board.map((v,i)=>v===null?i:null).filter(i=>i!==null);
    if(empty.length===0) return;
    const choice = empty[Math.floor(Math.random()*empty.length)];
    const newBoard = [...board];
    newBoard[choice] = 'O';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if(winner){
      setGameOver(true);
      handleWin(winner);
    }
  }

  function handleWin(winner:string) {
    if(winner==='X'){
      alert("You won!");
      setScore(prev=>prev+1);
      updateLeaderboard('You',1);
    } else if(winner==='O'){
      alert("Computer won!");
    } else {
      alert("It's a draw!");
    }
  }

  function updateLeaderboard(player:string, points:number) {
    const currentLeaderboard = JSON.parse(localStorage.getItem('leaderboard')||'[]');
    currentLeaderboard.push({player, points, date:new Date().toISOString()});
    const weekly = currentLeaderboard.filter(item=>new Date(item.date) >= getWeekStart());
    localStorage.setItem('leaderboard', JSON.stringify(weekly));
    setLeaderboard(weekly);
  }

  function shareResult() {
    const winner = checkWinner(board);
    let text:string;
    if(winner==='X') text="I won against the computer in OXOX 9x9!";
    else if(winner==='O') text="The computer won in OXOX 9x9!";
    else text="It's a draw in OXOX 9x9!";
    shareToFarcaster(text);
  }

  function resetBoard() {
    setBoard(Array(SIZE*SIZE).fill(null));
    setGameOver(false);
  }

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', padding:'20px'}}>
      <h2>OXOX 9x9 vs Computer</h2>
      <div style={{
        display:'grid', 
        gridTemplateColumns:`repeat(${SIZE},40px)`, 
        gap:'2px', 
        marginTop:'10px'
      }}>
        {board.map((val,idx)=>(
          <button key={idx} onClick={()=>handleClick(idx)}
                  style={{width:'40px', height:'40px', fontSize:'20px'}}>
            {val}
          </button>
        ))}
      </div>
      <div style={{marginTop:'15px'}}>
        <button onClick={resetBoard} style={{padding:'10px 20px'}}>Reset</button>
        <button onClick={shareResult} style={{padding:'10px 20px', marginLeft:'5px'}}>Share Result</button>
      </div>
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
