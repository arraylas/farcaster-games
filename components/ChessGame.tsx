//file ChessGame.tsx
import React, { useState, useEffect } from "react";
import { Chess, Square } from "chess.js";

interface ChessGameProps {
  onGameOver: (result: "You" | "AI" | "Draw") => void;
  isDarkTheme: boolean; 
}

const pieceToChar = (piece: any) => {
  const symbols: Record<string, string> = {
    p: "♟︎", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", 
    P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", 
  };
  if (!piece) return "";
  
  return symbols[piece.color === 'w' ? piece.type.toUpperCase() : piece.type];
};

const ChessGame: React.FC<ChessGameProps> = ({ onGameOver, isDarkTheme }) => {
  const [game] = useState(new Chess());
  const [board, setBoard] = useState<any[][]>([]);
  // selected menyimpan index array yang SUDAH DIBALIK (0=Rank 1/White, 7=Rank 8/Black)
  const [selected, setSelected] = useState<[number, number] | null>(null); 
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  // Inisialisasi papan: Balik array agar Rank 1 (White) berada di index 0
  useEffect(() => {
    // Menggunakan .slice().reverse() untuk membalik tampilan secara konsisten
    setBoard(game.board().slice().reverse()); 
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
    // Update board dengan array yang sudah dibalik
    setBoard(game.board().slice().reverse());
    setIsPlayerTurn(true);

    if (game.isCheckmate()) onGameOver("AI");
    else if (game.isDraw()) onGameOver("Draw");
  };

  // r dan c di sini adalah index array yang SUDAH DIBALIK (0=Rank 1, 7=Rank 8)
  const handleSquareClick = (r: number, c: number) => {
    if (!isPlayerTurn || game.isGameOver()) return;

    // Logika Konversi Rank: Rank Catur = r + 1. (Karena array sudah dibalik)
    const rank = (r + 1) as number; 
    const file = "abcdefgh"[c]; 
    const targetSquare = `${file}${rank}` as Square;

    if (selected) {
      const [sr, sc] = selected;
      const selectedRank = sr + 1; // Konversi index yang sudah dibalik ke Rank catur
      const selectedFile = "abcdefgh"[sc];

      const fromSquare = `${selectedFile}${selectedRank}` as Square;
      const toSquare = targetSquare;
      
      const result = game.move({ from: fromSquare, to: toSquare, promotion: 'q' });
      
      if (result) {
        // Update board dengan array yang sudah dibalik
        setBoard(game.board().slice().reverse()); 
        setSelected(null);
        setIsPlayerTurn(false);
        if (game.isCheckmate()) onGameOver("You");
        else if (game.isDraw()) onGameOver("Draw");
        else setTimeout(makeAiMove, 500);
      } else {
        setSelected(null);
      }
    } else {
      // Pastikan kita hanya bisa memilih bidak putih (player)
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
        {/* Render board yang sudah dibalik (index 0 = Rank 1/White) */}
        {board.map((row, r) =>
          row.map((p, c) => {
            // r kini adalah index tampilan catur yang benar (0=bawah, 7=atas)
            const dark = (r + c) % 2 === 0; 
            // Logika isSelected menggunakan index yang sudah dibalik
            const isSelected = selected && selected[0] === r && selected[1] === c;

            return (
              <div
                key={`${r}-${c}`}
                // Kirim index r dan c yang sudah dibalik (dan benar untuk tampilan)
                onClick={() => handleSquareClick(r, c)}
                style={{
                    backgroundColor: dark ? darkSquareColor : lightSquareColor,
                    // Warna bidak putih: Putih, Bidak hitam: Abu-abu Sangat Gelap (Agar terlihat di dark theme)
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
      <p className="mt-2 text-sm text-gray-400">Your King is under check!</p>
    </div>
  );
};

export default ChessGame;