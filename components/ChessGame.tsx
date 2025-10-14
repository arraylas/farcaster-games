"use client";
import React, { useEffect, useState } from "react";

// ======= Type definitions =======
type Piece = string | null; // e.g. "wP", "bK"
type Move = { from: number; to: number; promotion?: string | null };

// ======= Utility functions =======
const cloneBoard = (b: Piece[]) => b.slice();
const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
const rcToIndex = (r: number, c: number) => r * 8 + c;
const indexToRC = (i: number) => [Math.floor(i / 8), i % 8];
const isWhite = (p: Piece) => !!p && p.startsWith("w");
const isBlack = (p: Piece) => !!p && p.startsWith("b");

// ======= Initial board setup =======
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

// ======= Piece symbols =======
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

// ======= Move generation (simplified, no castling/en passant) =======
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
      let rr = r + dr,
        cc = c + dc;
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

    if (kind === "P") {
      const dir = side === "w" ? -1 : 1;
      const start = side === "w" ? 6 : 1;
      const promote = side === "w" ? 0 : 7;
      const one = r + dir;
      if (inBounds(one, c) && !board[rcToIndex(one, c)]) {
        if (one === promote)
          ["Q", "R", "B", "N"].forEach((pr) =>
            moves.push({ from: i, to: rcToIndex(one, c), promotion: pr })
          );
        else moves.push({ from: i, to: rcToIndex(one, c) });

        if (r === start && !board[rcToIndex(r + 2 * dir, c)])
          moves.push({ from: i, to: rcToIndex(r + 2 * dir, c) });
      }
      for (const dc of [-1, 1]) {
        const cc = c + dc;
        if (!inBounds(one, cc)) continue;
        const t = board[rcToIndex(one, cc)];
        if (t && (side === "w" ? isBlack(t) : isWhite(t))) {
          if (one === promote)
            ["Q", "R", "B", "N"].forEach((pr) =>
              moves.push({ from: i, to: rcToIndex(one, cc), promotion: pr })
            );
          else moves.push({ from: i, to: rcToIndex(one, cc) });
        }
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
      [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ].forEach(([dr, dc]) => slide(dr, dc));
    } else if (kind === "K") {
      for (const dr of [-1, 0, 1])
        for (const dc of [-1, 0, 1]) {
          if (dr || dc) add(r + dr, c + dc);
        }
    }
  }
  return moves;
};

// ======= Make move (mutates new board) =======
const makeMove = (board: Piece[], move: Move): Piece[] => {
  const newB = cloneBoard(board);
  const piece = newB[move.from];
  newB[move.from] = null;
  if (move.promotion && piece) newB[move.to] = piece[0] + move.promotion;
  else newB[move.to] = piece;
  return newB;
};

// ======= Evaluation function =======
const pieceValue: Record<string, number> = {
  K: 900,
  Q: 90,
  R: 50,
  B: 30,
  N: 30,
  P: 10,
};
const evaluateBoard = (board: Piece[]): number => {
  let score = 0;
  for (const p of board) {
    if (!p) continue;
    const val = pieceValue[p[1]] ?? 0;
    score += isWhite(p) ? val : -val;
  }
  return score;
};

// ======= Minimax with alpha-beta =======
const minimax = (
  board: Piece[],
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean
): number => {
  if (depth === 0) return evaluateBoard(board);
  const side = maximizing ? "b" : "w"; // AI is black here
  const moves = generateMoves(board, side);
  if (moves.length === 0) return evaluateBoard(board);

  if (maximizing) {
    let maxEval = -Infinity;
    for (const m of moves) {
      const val = minimax(makeMove(board, m), depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const m of moves) {
      const val = minimax(makeMove(board, m), depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

// ======= Find best move =======
const findBestMove = (board: Piece[], depth = 2): Move | null => {
  const moves = generateMoves(board, "b");
  let bestScore = -Infinity;
  let bestMove: Move | null = null;
  for (const m of moves) {
    const val = minimax(makeMove(board, m), depth - 1, -Infinity, Infinity, false);
    if (val > bestScore) {
      bestScore = val;
      bestMove = m;
    }
  }
  return bestMove;
};

// ======= Component =======
export default function ChessGame() {
  const [board, setBoard] = useState<Piece[]>(initialBoard);
  const [selected, setSelected] = useState<number | null>(null);
  const [turn, setTurn] = useState<"w" | "b">("w");

  const handleClick = (i: number) => {
    if (turn !== "w") return; // only human (white) moves
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

  // AI move effect
  useEffect(() => {
    if (turn === "b") {
      const best = findBestMove(board, 2);
      if (best) {
        const newBoard = makeMove(board, best);
        setTimeout(() => {
          setBoard(newBoard);
          setTurn("w");
        }, 600);
      } else {
        console.log("AI has no moves!");
      }
    }
  }, [turn]);

  return (
    <div className="grid grid-cols-8 border-4 border-gray-600 rounded-lg">
      {board.map((p, i) => {
        const [r, c] = indexToRC(i);
        const dark = (r + c) % 2 === 1;
        return (
          <div
            key={i}
            onClick={() => handleClick(i)}
            className={`w-16 h-16 flex items-center justify-center text-3xl cursor-pointer select-none ${
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
