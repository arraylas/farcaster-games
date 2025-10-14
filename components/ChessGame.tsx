import React, { useState, useEffect } from "react";
import { Chess, Square } from "chess.js";

interface ChessGameProps {
  onGameOver: (result: "You" | "AI" | "Draw") => void;
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
  return symbols[
    piece.type === piece.type.toLowerCase() && piece.color === "b"
      ? piece.type
      : piece.type.toUpperCase()
  ] || "";
};

const ChessGameBoard: React.FC<ChessGameProps> = ({
  onGameOver,
  isDarkTheme,
}) => {
  const [game] = useState(new Chess());
  const [board, setBoard] = useState<any[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
    setBoard(game.board().reverse()); // Inisialisasi board
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
    if (!isPlayerTurn) return;

    if (selected) {
      const [sr, sc] = selected;

      // ✅ Pastikan TypeScript tahu bahwa ini adalah "Square"
      const fromSquare = `${"abcdefgh"[sc]}${sr + 1}` as Square;
      const toSquare = `${"abcdefgh"[c]}${r + 1}` as Square;

      const result = game.move({ from: fromSquare, to: toSquare });

      if (result) {
        setBoard(game.board().reverse());
        setSelected(null);
        setIsPlayerTurn(false);

        if (game.isCheckmate()) onGameOver("You");
        else if (game.isDraw()) onGameOver("Draw");
        else setTimeout(makeAiMove, 500);
      } else {
        setSelected(null);
      }
    } else {
      const piece = game.get(`${"abcdefgh"[c]}${r + 1}` as Square);
      if (piece && piece.color === "w") {
        setSelected([r, c]);
      }
    }
  };

  const darkSquareColor = isDarkTheme ? "bg-stone-700" : "bg-amber-700";
  const lightSquareColor = isDarkTheme ? "bg-stone-200" : "bg-amber-200";

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div
        className="p-3 rounded-2xl shadow-lg"
        style={{ backgroundColor: isDarkTheme ? "#1a0030" : "white" }}
      >
        <div
          className="grid border-4 border-amber-800 rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: "repeat(8, 1fr)",
            gridTemplateRows: "repeat(8, 1fr)",
            width: "384px",
            height: "384px",
          }}
        >
          {board.map((row, r) =>
            row.map((p, c) => {
              const dark = (r + c) % 2 === 0;
              const isSelected =
                selected && selected[0] === r && selected[1] === c;

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleSquareClick(r, c)}
                  className={`flex items-center justify-center text-2xl sm:text-3xl cursor-pointer select-none
                    ${dark ? darkSquareColor : lightSquareColor}
                    ${isSelected ? "ring-4 ring-yellow-400" : ""}
                    ${p && p.color === "w" ? "text-white" : "text-black"}
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
