import React, { useState, useEffect } from "react";
import { Chess, Square } from "chess.js";

interface ChessGameProps {
  onGameOver: (result: "You" | "AI" | "Draw") => void;
  isDarkTheme: boolean; 
}

// Fungsi untuk mengkonversi objek bidak (piece object) dari chess.js menjadi karakter Unicode
const pieceToChar = (piece: any) => {
  const symbols: Record<string, string> = {
    p: "♟︎", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", // Black pieces (lowercase)
    P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", // White pieces (uppercase)
  };
  if (!piece) return "";
  
  return symbols[piece.color === 'w' ? piece.type.toUpperCase() : piece.type];
};

const ChessGame: React.FC<ChessGameProps> = ({ onGameOver, isDarkTheme }) => {
  const [game] = useState(new Chess());
  const [board, setBoard] = useState<any[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  // Inisialisasi papan
  useEffect(() => {
    // PERBAIKAN: Hapus .reverse(). Papan standar chess.js sudah benar (Rank 8 di atas, Rank 1 di bawah).
    setBoard(game.board()); 
  }, [game]);

  const makeAiMove = () => {
    const moves = game.moves();
    if (moves.length === 0) {
      if (game.isCheckmate()) onGameOver("You");
      else onGameOver("Draw");
      return;
    }

    const move = moves[Math.floor(Math.random() * moves.length)];
    game.move(move);
    // PERBAIKAN: Hapus .reverse()
    setBoard(game.board());
    setIsPlayerTurn(true);

    if (game.isCheckmate()) onGameOver("AI");
    else if (game.isDraw()) onGameOver("Draw");
  };

  const handleSquareClick = (r: number, c: number) => {
    if (!isPlayerTurn || game.isGameOver()) return;

    // Grid JS (r, c) -> Notasi Catur (file, rank)
    // Karena TIDAK ada reverse, r=0 adalah Rank 8, r=7 adalah Rank 1.
    const rank = (8 - r) as number;
    const file = "abcdefgh"[c]; 
    const targetSquare = `${file}${rank}` as Square;

    if (selected) {
      const [sr, sc] = selected;
      const selectedRank = 8 - sr;
      const selectedFile = "abcdefgh"[sc];

      const fromSquare = `${selectedFile}${selectedRank}` as Square;
      const toSquare = targetSquare;
      
      const result = game.move({ from: fromSquare, to: toSquare, promotion: 'q' });
      
      if (result) {
        // PERBAIKAN: Hapus .reverse()
        setBoard(game.board());
        setSelected(null);
        setIsPlayerTurn(false);
        if (game.isCheckmate()) onGameOver("You");
        else if (game.isDraw()) onGameOver("Draw");
        else setTimeout(makeAiMove, 500);
      } else {
        setSelected(null);
      }
    } else {
      const piece = game.get(targetSquare);
      if (piece && piece.color === "w") {
        setSelected([r, c]);
      }
    }
  };

  const darkSquareColor = isDarkTheme ? "#6C4F7F" : "#7D523C"; 
  const lightSquareColor = isDarkTheme ? "#CDB5D9" : "#F5EAD4"; 

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      {/* Papan catur 8x8 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: "repeat(8, 1fr)",
          gridTemplateRows: "repeat(8, 1fr)",
          width: "90vw", 
          maxWidth: "400px", 
          aspectRatio: '1 / 1', 
          border: '4px solid #4a148c', 
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)'
        }}
      >
        {board.map((row, r) =>
          row.map((p, c) => {
            // Menentukan warna kotak (hitam/putih)
            const dark = (r + c) % 2 === 0; 
            const isSelected = selected && selected[0] === r && selected[1] === c;
            
            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleSquareClick(r, c)}
                style={{
                    backgroundColor: dark ? darkSquareColor : lightSquareColor,
                    // PERBAIKAN: Set warna bidak agar bidak hitam terlihat di dark theme
                    color: p && p.color === 'w' ? '#FFFFFF' : '#111111', 
                    
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4.5vmin', 
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    userSelect: 'none',
                    boxShadow: isSelected ? 'inset 0px 0px 0px 4px #FFD700' : 'none',
                    zIndex: isSelected ? 10 : 1,
                }}
              >
                {pieceToChar(p)}
              </div>
            );
          })
        )}
      </div>

      <p className="mt-4 text-sm text-gray-300">You are playing as White</p>
    </div>
  );
};

export default ChessGame;