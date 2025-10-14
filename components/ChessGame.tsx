// components/ChessGame.tsx
"use client";
import React, { useEffect, useState } from "react";

type Piece = string | null;
type Move = { from: number; to: number; promotion?: string | null };

const cloneBoard = (b: Piece[]) => b.slice();
const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
const rcToIndex = (r: number, c: number) => r * 8 + c;
const indexToRC = (i: number) => [Math.floor(i / 8), i % 8];
const isWhite = (p: Piece) => !!p && p.startsWith("w");
const isBlack = (p: Piece) => !!p && p.startsWith("b");

const initialBoard = (): Piece[] => {
  const b: Piece[] = new Array(64).fill(null);
  const back = ["R", "N", "B", "Q", "K", "B", "N", "R"];
  for (let i = 0; i < 8; i++) {
    b[i] = "b" + back[i];
    b[8 + i] = "bP";
    b[48 + i] = "wP";
    b[56 + i] = "w" + back[i];
  }
  return b;
};

const pieceToChar = (p: Piece) => {
  if (!p) return "";
  const map: Record<string, string> = {
    wK: "♔",
    wQ: "♕",
    wR: "♖",
    wB: "♗",
    wN: "♘",
    wP: "♙",
    bK: "♚",
    bQ: "♛",
    bR: "♜",
    bB: "♝",
    bN: "♞",
    bP: "♟︎",
  };
  return map[p] ?? "?";
};

// simplified move generation (no castling/en-passant checks)
const generateMoves = (board: Piece[], side: "w" | "b") => {
  const moves: Move[] = [];
  for (let i = 0; i < 64; i++) {
    const p = board[i];
    if (!p) continue;
    if (side === "w" && !isWhite(p)) continue;
    if (side === "b" && !isBlack(p)) continue;
    const [r, c] = indexToRC(i);
    const kind = p[1];

    const add = (rr: number, cc: number) => {
      if (!inBounds(rr, cc)) return;
      const idx = rcToIndex(rr, cc);
      const t = board[idx];
      if (!t || (side === "w" ? isBlack(t) : isWhite(t))) moves.push({ from: i, to: idx });
    };

    const slide = (dr: number, dc: number) => {
      let rr = r + dr,
        cc = c + dc;
      while (inBounds(rr, cc)) {
        const idx = rcToIndex(rr, cc);
        if (!board[idx]) moves.push({ from: i, to: idx });
        else {
          const t = board[idx];
          if (t && (side === "w" ? isBlack(t) : isWhite(t))) moves.push({ from: i, to: idx });
          break;
        }
        rr += dr;
        cc += dc;
      }
    };

    if (kind === "P") {
      const dir = side === "w" ? -1 : 1;
      const one = r + dir;
      if (inBounds(one, c) && !board[rcToIndex(one, c)]) moves.push({ from: i, to: rcToIndex(one, c) });
      for (const dc of [-1, 1]) {
        const cc = c + dc;
        if (!inBounds(one, cc)) continue;
        const t = board[rcToIndex(one, cc)];
        if (t && (side === "w" ? isBlack(t) : isWhite(t))) moves.push({ from: i, to: rcToIndex(one, cc) });
      }
    } else if (kind === "N") {
      for (const [dr, dc] of [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ])
        add(r + dr, c + dc);
    } else if (kind === "B") {
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dr, dc]) => slide(dr, dc));
    } else if (kind === "R") {
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => slide(dr, dc));
    } else if (kind === "Q") {
      [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dr, dc]) =>
        slide(dr, dc)
      );
    } else if (kind === "K") {
      for (const dr of [-1, 0, 1]) for (const dc of [-1, 0, 1]) if (dr || dc) add(r + dr, c + dc);
    }
  }
  return moves;
};

const makeMove = (board: Piece[], move: Move): Piece[] => {
  const newB = cloneBoard(board);
  const piece = newB[move.from];
  newB[move.from] = null;
  newB[move.to] = piece;
  return newB;
};

// very simple AI: choose random legal move for black
const findBestMove = (board: Piece[]) => {
  const moves = generateMoves(board, "b");
  if (!moves.length) return null;
  return moves[Math.floor(Math.random() * moves.length)];
};

export default function ChessGame({
  onGameOver,
}: {
  onGameOver?: (result: "You" | "AI" | "Draw") => void;
}) {
  const [board, setBoard] = useState<Piece[]>(initialBoard);
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [selected, setSelected] = useState<number | null>(null);
  const [aiThinking, setAiThinking] = useState(false);

  useEffect(() => {
    // quick game-over check by king presence
    const whiteKing = board.includes("wK");
    const blackKing = board.includes("bK");
    if (!whiteKing && onGameOver) onGameOver("AI");
    if (!blackKing && onGameOver) onGameOver("You");
  }, [board, onGameOver]);

  useEffect(() => {
    if (turn === "b") {
      setAiThinking(true);
      const mv = findBestMove(board);
      if (!mv) {
        setTimeout(() => {
          setAiThinking(false);
          if (onGameOver) onGameOver("Draw");
        }, 300);
        return;
      }
      setTimeout(() => {
        setBoard((prev) => makeMove(prev, mv));
        setTurn("w");
        setAiThinking(false);
      }, 600);
    }
  }, [turn, board, onGameOver]);

  const handleClick = (i: number) => {
    if (turn !== "w") return;
    const piece = board[i];
    if (selected === null) {
      if (piece && isWhite(piece)) setSelected(i);
    } else {
      const moves = generateMoves(board, "w");
      const mv = moves.find((m) => m.from === selected && m.to === i);
      if (mv) {
        const newBoard = makeMove(board, mv);
        setBoard(newBoard);
        setTurn("b");
      }
      setSelected(null);
    }
  };

  // BOARD STYLES:
  // wrapper forces a square area (aspect-ratio) and grid layout 8x8
  return (
    <div className="w-full max-w-[520px] mx-auto">
      <div className="text-center mb-3">
        <div className="text-sm opacity-80">{aiThinking ? "AI thinking..." : "Your turn (White)"}</div>
      </div>

      <div
        className="mx-auto bg-gray-800 p-2 rounded-lg"
        style={{
          aspectRatio: "1 / 1",
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: "2px",
          maxWidth: "520px",
        }}
      >
        {board.map((p, i) => {
          const [r, c] = indexToRC(i);
          const dark = (r + c) % 2 === 1;
          const isSelected = selected === i;
          return (
            <div
              key={i}
              onClick={() => handleClick(i)}
              role="button"
              aria-label={`Square ${i}`}
              className={`flex items-center justify-center select-none cursor-pointer transition-all`}
              style={{
                backgroundColor: isSelected ? "#facc15" : dark ? "#2b6b2b" : "#e6f4ea",
                color: dark ? "#e6f4ea" : "#0b1a0b",
                fontSize: "1.35rem",
                userSelect: "none",
              }}
            >
              <span style={{ lineHeight: 1 }}>{pieceToChar(p)}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-center">
        <div className="text-sm opacity-80">You are playing as <strong>White</strong></div>
      </div>
    </div>
  );
}
