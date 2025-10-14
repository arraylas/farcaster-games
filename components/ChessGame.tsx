"use client";
import React, { useEffect, useState } from "react";

type Piece = string | null;
type Move = { from: number; to: number; promotion?: string | null };

const rcToIndex = (r: number, c: number) => r * 8 + c;
const indexToRC = (i: number) => [Math.floor(i / 8), i % 8];
const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
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
    wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
    bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟︎",
  };
  return map[p] ?? "?";
};

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
      if (!t || (side === "w" ? isBlack(t) : isWhite(t)))
        moves.push({ from: i, to: idx });
    };

    const slide = (dr: number, dc: number) => {
      let rr = r + dr, cc = c + dc;
      while (inBounds(rr, cc)) {
        const idx = rcToIndex(rr, cc);
        if (!board[idx]) moves.push({ from: i, to: idx });
        else {
          const t = board[idx];
          if (t && (side === "w" ? isBlack(t) : isWhite(t)))
            moves.push({ from: i, to: idx });
          break;
        }
        rr += dr;
        cc += dc;
      }
    };

    // simple pawn/rook/etc logic
    if (kind === "P") {
      const dir = side === "w" ? -1 : 1;
      const one = r + dir;
      if (inBounds(one, c) && !board[rcToIndex(one, c)]) moves.push({ from: i, to: rcToIndex(one, c) });
      for (const dc of [-1, 1]) {
        const cc = c + dc;
        if (!inBounds(one, cc)) continue;
        const t = board[rcToIndex(one, cc)];
        if (t && (side === "w" ? isBlack(t) : isWhite(t)))
          moves.push({ from: i, to: rcToIndex(one, cc) });
      }
    } else if (kind === "N") {
      for (const [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]])
        add(r + dr, c + dc);
    } else if (kind === "B") {
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dr, dc]) => slide(dr, dc));
    } else if (kind === "R") {
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => slide(dr, dc));
    } else if (kind === "Q") {
      [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dr, dc]) => slide(dr, dc));
    } else if (kind === "K") {
      for (const dr of [-1, 0, 1]) for (const dc of [-1, 0, 1]) if (dr || dc) add(r + dr, c + dc);
    }
  }
  return moves;
};

const makeMove = (board: Piece[], move: Move): Piece[] => {
  const newB = [...board];
  const piece = newB[move.from];
  newB[move.from] = null;
  newB[move.to] = piece;
  return newB;
};

const findBestMove = (board: Piece[]): Move | null => {
  const moves = generateMoves(board, "b");
  if (moves.length === 0) return null;
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

  // AI turn
  useEffect(() => {
    const whiteKing = board.includes("wK");
    const blackKing = board.includes("bK");
    if (!whiteKing && onGameOver) onGameOver("AI");
    if (!blackKing && onGameOver) onGameOver("You");

    if (turn === "b") {
      const mv = findBestMove(board);
      if (!mv && onGameOver) onGameOver("Draw");
      if (mv) {
        const newB = makeMove(board, mv);
        setTimeout(() => {
          setBoard(newB);
          setTurn("w");
        }, 600);
      }
    }
  }, [turn]);

  return (
    <div className="grid grid-cols-8 border-4 border-gray-700 rounded-xl shadow-lg overflow-hidden max-w-[480px] mx-auto">
      {board.map((p, i) => {
        const [r, c] = indexToRC(i);
        const dark = (r + c) % 2 === 1;
        return (
          <div
            key={i}
            onClick={() => handleClick(i)}
            className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl sm:text-3xl cursor-pointer select-none ${
              dark ? "bg-green-700" : "bg-green-200"
            } ${selected === i ? "ring-4 ring-yellow-400" : ""}`}
          >
            {pieceToChar(p)}
          </div>
        );
      })}
    </div>
  );
}
