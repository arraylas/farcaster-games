import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";

interface ChessGameProps {
  onGameOver: (result: "You" | "AI" | "Draw") => void;
  // Tambahkan props untuk style agar konsisten dengan design gelap
  isDarkTheme: boolean; 
}

const pieceToChar = (piece: any) => {
  const symbols: Record<string, string> = {
    p: "♟︎",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
    P: "♙",
    R: "♖",
    N: "♘",
    B: "♗",
    Q: "♕",
    K: "♔",
  };
  if (!piece) return "";
  // Catatan: chess.js sudah memberikan type (p, r, n, etc.) dan color (w, b)
  return symbols[piece.type === piece.type.toLowerCase() && piece.color === 'b' ? piece.type : piece.type.toUpperCase()] || "";
};

// ==========================================================
// CHESS GAME COMPONENT
// ==========================================================

// Mengganti nama fungsi ke ChessGameBoard agar bisa diimpor di file utama Anda
const ChessGameBoard: React.FC<ChessGameProps> = ({ onGameOver, isDarkTheme }) => { 
  const [game] = useState(new Chess());
  const [board, setBoard] = useState<any[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
    // Memastikan board state diinisialisasi
    setBoard(game.board().reverse()); // Kita reverse di sini sekali saja
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
    setBoard(game.board().reverse()); // Reverse lagi setelah move
    setIsPlayerTurn(true);

    if (game.isCheckmate()) onGameOver("AI");
    else if (game.isDraw()) onGameOver("Draw");
  };

  const handleSquareClick = (r: number, c: number) => {
    if (!isPlayerTurn) return;

    if (selected) {
      const [sr, sc] = selected;
      
      // Konversi koordinat array (0-7) ke notasi catur (a1-h8)
      // Baris 0 adalah 8, Baris 7 adalah 1
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
      const piece = game.get(`${"abcdefgh"[c]}${r + 1}`); // Ambil bidak dari posisi catur asli
      if (piece && piece.color === "w") {
        setSelected([r, c]);
      }
    }
  };

  const darkSquareColor = isDarkTheme ? "bg-stone-700" : "bg-amber-700";
  const lightSquareColor = isDarkTheme ? "bg-stone-200" : "bg-amber-200";


  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="p-3 rounded-2xl shadow-lg" style={{ backgroundColor: isDarkTheme ? '#1a0030' : 'white' }}>
        {/* Papan catur 8x8 */}
        <div
          className="grid border-4 border-amber-800 rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: "repeat(8, 1fr)",
            gridTemplateRows: "repeat(8, 1fr)",
            width: "384px", // Menggunakan ukuran tetap (bisa diubah ke % jika diperlukan)
            height: "384px",
          }}
        >
          {board.map((row, r) =>
            row.map((p, c) => {
              const dark = (r + c) % 2 === 0; // Logika warna untuk board yang sudah dibalik
              const isSelected = selected && selected[0] === r && selected[1] === c;
              
              // Tentukan warna bidak (putih untuk player, hitam untuk AI)
              const pieceColor = p && p.color === 'w' ? 'text-white' : 'text-black';
              
              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleSquareClick(r, c)}
                  className={`flex items-center justify-center text-2xl sm:text-3xl cursor-pointer select-none
                    ${dark ? darkSquareColor : lightSquareColor}
                    ${isSelected ? "ring-4 ring-yellow-400" : ""}
                    ${p && p.color === 'w' ? 'text-white' : 'text-black'} 
                  `}
                >
                  {pieceToChar(p)}
                </div>
              );
            })
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-300">You are playing as White</p>
    </div>
  );
};

export default ChessGameBoard;
