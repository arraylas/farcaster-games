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
  return symbols[piece?.type ? (piece.color === "w" ? piece.type.toUpperCase() : piece.type) : ""] || "";
};

const isWhite = (piece: any) => piece?.color === "w";

const ChessGame: React.FC<ChessGameProps> = ({ onGameOver }) => {
  const [game] = useState(new Chess());
  const [board, setBoard] = useState(game.board());
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

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
      if (piece && isWhite(piece)) {
        setSelected([r, c]);
      }
    }
  };

  useEffect(() => {
    setBoard(game.board());
  }, [game]);

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="bg-amber-900 p-3 rounded-2xl shadow-lg">
        <div className="grid grid-cols-8 gap-0 border-4 border-amber-800 rounded-lg overflow-hidden">
          {board.map((row, r) =>
            row.map((p, c) => {
              const dark = (r + c) % 2 === 1;
              const key = `${r}-${c}`;
              return (
                <div
                  key={key}
                  onClick={() => handleSquareClick(r, c)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl sm:text-3xl cursor-pointer select-none
                    ${dark ? "bg-amber-800" : "bg-amber-200"}
                    ${selected && selected[0] === r && selected[1] === c ? "ring-4 ring-yellow-400" : ""}
                    ${p && isWhite(p) ? "text-white" : p ? "text-black" : ""}
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
