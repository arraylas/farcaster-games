import { useState, useCallback, useMemo, useEffect } from "react";
import type { NextPage } from "next";
import styles from "../styles/Oxox.module.css";

// Game Constants
const BOARD_SIZE = 5;
const WIN_COUNT = 4;

type Symbol = "X" | "O" | null;

// ==========================================================
// Cell Component
// ==========================================================
interface CellProps {
  value: Symbol;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ value, onClick }) => {
  return (
    <div
      className={`${styles.cell} ${value ? styles[value] : ""}`}
      onClick={onClick}
    >
      {value}
    </div>
  );
};

// ==========================================================
// Winning Logic
// ==========================================================
const checkWinner = (boardState: Symbol[]): Symbol => {
  const size = BOARD_SIZE;
  const count = WIN_COUNT;

  const checkLine = (line: number[]): Symbol => {
    const symbols = line.map((index) => boardState[index]);
    const firstSymbol = symbols[0];
    if (firstSymbol && symbols.every((symbol) => symbol === firstSymbol)) {
      return firstSymbol;
    }
    return null;
  };

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Horizontal
      if (col <= size - count) {
        const hLine = Array.from({ length: count }, (_, k) => row * size + col + k);
        const hWinner = checkLine(hLine);
        if (hWinner) return hWinner;
      }
      // Vertical
      if (row <= size - count) {
        const vLine = Array.from({ length: count }, (_, k) => (row + k) * size + col);
        const vWinner = checkLine(vLine);
        if (vWinner) return vWinner;
      }
      // Diagonal ↘
      if (row <= size - count && col <= size - count) {
        const d1 = Array.from({ length: count }, (_, k) => (row + k) * size + col + k);
        const d1Winner = checkLine(d1);
        if (d1Winner) return d1Winner;
      }
      // Diagonal ↙
      if (row <= size - count && col >= count - 1) {
        const d2 = Array.from({ length: count }, (_, k) => (row + k) * size + col - k);
        const d2Winner = checkLine(d2);
        if (d2Winner) return d2Winner;
      }
    }
  }

  return null;
};

// ==========================================================
// AI Logic
// ==========================================================
const getAiMove = (boardState: Symbol[]): number => {
  const emptyIndices = boardState
    .map((v, i) => (v === null ? i : -1))
    .filter((i) => i !== -1);

  if (emptyIndices.length === 0) return -1;

  const findWinningMove = (currentPlayer: Symbol): number => {
    for (const index of emptyIndices) {
      const tempBoard = [...boardState];
      tempBoard[index] = currentPlayer;
      if (checkWinner(tempBoard) === currentPlayer) {
        return index;
      }
    }
    return -1;
  };

  // AI tries to win first
  const aiWin = findWinningMove("O");
  if (aiWin !== -1) return aiWin;

  // Block player
  const block = findWinningMove("X");
  if (block !== -1) return block;

  // Else random
  const randomIndex = Math.floor(Math.random() * emptyIndices.length);
  return emptyIndices[randomIndex];
};

// ==========================================================
// Main Component
// ==========================================================
const TicTacToe5x5: NextPage = () => {
  const [boardState, setBoardState] = useState<Symbol[]>(
    Array(BOARD_SIZE * BOARD_SIZE).fill(null)
  );
  const [isXNext, setIsXNext] = useState(true);

  const winner = useMemo(() => checkWinner(boardState), [boardState]);
  const isDraw = !winner && boardState.every((cell) => cell !== null);
  const gameActive = !winner && !isDraw;

  const status = winner
    ? `🏆 ${winner === "X" ? "You Win!" : "Computer Wins!"}`
    : isDraw
    ? `🤝 It's a Draw!`
    : `Next Player: ${isXNext ? "You (X)" : "Computer (O)"}`;

  const makeMove = useCallback(
    (index: number) => {
      if (boardState[index] || !gameActive) return;
      const newBoard = [...boardState];
      newBoard[index] = isXNext ? "X" : "O";
      setBoardState(newBoard);
      setIsXNext(!isXNext);
    },
    [boardState, isXNext, gameActive]
  );

  useEffect(() => {
    if (!isXNext && gameActive) {
      const aiTurn = async () => {
        await new Promise((r) => setTimeout(r, 400));
        const move = getAiMove(boardState);
        if (move !== -1) makeMove(move);
      };
      aiTurn();
    }
  }, [isXNext, gameActive, boardState, makeMove]);

  const handlePlayerClick = (index: number) => {
    if (isXNext) makeMove(index);
  };

  const restartGame = () => {
    setBoardState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setIsXNext(true);
  };

  // === 🟣 Share to Warpcast ===
  const handleShareCast = () => {
    const appUrl = "https://farcaster.xyz/miniapps/9HwP06is7xxa/farcaster-achievement";
    let message = "";

    if (winner === "X") {
      message = `🏆 I beat the AI in OXOX 5x5! Play it yourself here: ${appUrl}`;
    } else if (winner === "O") {
      message = `💀 The AI defeated me in OXOX 5x5! Try your luck: ${appUrl}`;
    } else if (isDraw) {
      message = `🤝 It's a draw in OXOX 5x5! Play here: ${appUrl}`;
    }

    const farcasterCastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      message
    )}`;
    window.open(farcasterCastUrl, "_blank");
  };

  const backToHome = () => {
    window.location.href = "/";
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>❌⭕ OXOX 5x5 (4-in-a-row vs AI)</h1>

      <div className={styles.status}>{status}</div>

      <div
        className={styles.board}
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
        }}
      >
        {boardState.map((value, index) => (
          <Cell key={index} value={value} onClick={() => handlePlayerClick(index)} />
        ))}
      </div>

      {(winner || isDraw) && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
          <button onClick={handleShareCast} className={styles.shareButton}>
            📤 Share to Warpcast
          </button>

          <button onClick={restartGame} className={styles.resetButton} style={{ marginTop: "10px" }}>
            🔁 Restart Game
          </button>

          <button
            onClick={backToHome}
            className={styles.resetButton}
            style={{ backgroundColor: "#635BFF", marginTop: "10px" }}
          >
            🔙 Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default TicTacToe5x5;
