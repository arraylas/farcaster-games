import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";

interface ChessGameProps {
  onGameOver: (result: "You" | "AI" | "Draw") => void;
  isDarkTheme: boolean; // Diterima dari halaman utama
}

// Fungsi untuk mengkonversi objek bidak (piece object) dari chess.js menjadi karakter Unicode
const pieceToChar = (piece: any) => {
  const symbols: Record<string, string> = {
    p: "♟︎", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", // Black pieces (lowercase)
    P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", // White pieces (uppercase)
  };
  if (!piece) return "";
  
  // Menggunakan type dari chess.js untuk menentukan karakter
  return symbols[piece.color === 'w' ? piece.type.toUpperCase() : piece.type];
};

const ChessGame: React.FC<ChessGameProps> = ({ onGameOver, isDarkTheme }) => {
  const [game] = useState(new Chess());
  const [board, setBoard] = useState<any[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  // Inisialisasi papan
  useEffect(() => {
    // Kita harus membalik board array di sini agar player (White) selalu ada di bawah (row 7)
    // Walaupun di-render dari index 0 ke 7
    setBoard(game.board().reverse()); 
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
    setBoard(game.board().reverse());
    setIsPlayerTurn(true);

    if (game.isCheckmate()) onGameOver("AI");
    else if (game.isDraw()) onGameOver("Draw");
  };

  const handleSquareClick = (r: number, c: number) => {
    if (!isPlayerTurn || winner || game.isGameOver()) return;

    // Koordinat Catur: r=0 adalah baris 8, r=7 adalah baris 1
    // Karena kita membalik array di useEffect, logika ini harus konsisten.

    if (selected) {
      const [sr, sc] = selected;
      
      // Menggunakan 7 - r karena papan sudah di reverse, tapi perlu konversi ke notasi a1-h8
      const fromSquare = `${"abcdefgh"[sc]}${sr + 1}`; 
      const toSquare = `${"abcdefgh"[c]}${r + 1}`;
      
      const result = game.move({ from: fromSquare, to: toSquare });
      
      if (result) {
        setBoard(game.board().reverse());
        setSelected(null);
        setIsPlayerTurn(false);
        if (game.isCheckmate()) onGameOver("You");
        else if (game.isDraw()) onGameOver("Draw");
        else setTimeout(makeAiMove, 500);
      } else {
        // Jika gerakan tidak valid, batalkan seleksi
        setSelected(null);
      }
    } else {
      // Dapatkan bidak pada koordinat catur yang benar (r, c)
      const piece = game.get(`${"abcdefgh"[c]}${r + 1}`); 
      if (piece && piece.color === "w") {
        setSelected([r, c]);
      }
    }
  };

  const darkSquareColor = isDarkTheme ? "#6C4F7F" : "#7D523C"; // Warna ungu gelap atau coklat
  const lightSquareColor = isDarkTheme ? "#CDB5D9" : "#F5EAD4"; // Warna ungu muda atau krem

  const winner = game.isGameOver(); // Cek status game

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      {/* Papan catur 8x8 */}
      <div
        // Menggunakan inline style untuk Grid agar pasti berfungsi
        style={{
          display: 'grid',
          gridTemplateColumns: "repeat(8, 1fr)",
          gridTemplateRows: "repeat(8, 1fr)",
          width: "90vw", // Responsif
          maxWidth: "400px", // Batasan
          aspectRatio: '1 / 1', // Memastikan selalu kotak
          border: '4px solid #4a148c', // Warna border ungu
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
                // Menggunakan inline style untuk warna kotak
                style={{
                    backgroundColor: dark ? darkSquareColor : lightSquareColor,
                    color: p && p.color === 'w' ? '#FFFFFF' : '#000000', // Warna bidak
                    // Styling dasar kotak
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4.5vmin', // Ukuran font relatif ke viewport
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    userSelect: 'none',
                    // Border seleksi
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
