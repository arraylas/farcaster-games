import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";

interface ChessGameProps {
  onGameOver: (result: "You" | "AI" | "Draw") => void;
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
  const key = piece.color === "w" ? piece.type.toUpperCase() : piece.type;
  return symbols[key] || "";
};

const ChessGame: React.FC<ChessGameProps> = ({ onGameOver }) => {
  const [game] = useState(new Chess());
  const [board, setBoard] = useState<any[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
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
    setBoard(game.board());
    setIsPlayerTurn(true);

    if (game.isCheckmate()) onGameOver("AI");
    else if (game.isDraw()) onGameOver("Draw");
  };

  const handleSquareClick = (r: number, c: number) => {
    if (!isPlayerTurn) return;

    if (selected) {
      const [sr, sc] = selected;
      const move = {
        from: `${"abcdefgh"[sc]}${8 - sr}`,
        to: `${"abcdefgh"[c]}${8 - r}`,
      };
      const result = game.move(move);
      if (result) {
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
      const piece = board[r][c];
      if (piece && piece.color === "w") {
        setSelected([r, c]);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="bg-amber-900 p-3 rounded-2xl shadow-lg">
        {/* papan chess 8x8 */}
        <div
          className="grid border-4 border-amber-800 rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: "repeat(8, 1fr)",
            gridTemplateRows: "repeat(8, 1fr)",
            width: "384px",
            height: "384px",
          }}
        >
          {board
            .slice() // bikin salinan biar ga mutasi data asli
            .reverse() // posisi kamu di bawah, AI di atas
            .map((row, r) =>
              row.map((p, c) => {
                const dark = (r + c) % 2 === 1;
                const realRow = 7 - r; // adjust index setelah reverse
                return (
                  <div
                    key={`${realRow}-${c}`}
                    onClick={() => handleSquareClick(realRow, c)}
                    className={`flex items-center justify-center text-2xl sm:text-3xl cursor-pointer select-none
                      ${dark ? "bg-amber-700" : "bg-amber-200"}
                      ${selected &&
                      selected[0] === realRow &&
                      selected[1] === c
                        ? "ring-4 ring-yellow-400"
                        : ""}
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

export default ChessGame;
