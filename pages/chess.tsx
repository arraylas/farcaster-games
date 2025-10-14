// pages/chess.tsx
import React from "react";
import ChessGame from "../components/ChessGame"; // nanti kita buat file ini di step berikut

export default function ChessPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">♟️ Chess Game (vs AI)</h1>
      <ChessGame />
    </main>
  );
}
