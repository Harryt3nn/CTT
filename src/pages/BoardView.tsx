/*src/pages/BoardView.tsx*/

import React, { useState } from 'react';
import Settings from './Settings';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';

// main viewer for the analysis board

type Page = 'home' | 'settings';

const BoardView = ({ onBack }: { onBack: () => void }) => {
  const [page, setPage] = useState<Page>('home');
  const [game, setGame] = useState(new Chess());

  const [highlightedSquares, setHighlightedSquares] = useState<Record<string, string>>({});
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  if (page === 'settings') return <Settings onBack={onBack} />;

  const onPieceDrop = (source: Square, target: Square) => {
    const newGame = new Chess(game.fen());

    try {
      const move = newGame.move({ from: source, to: target, promotion: 'q' });
      if (!move) return false;

      setGame(newGame);
      setHighlightedSquares({});
      setSelectedSquare(null);
      return true;
    } catch {
      return false;
    }
  };

  const onSquareClick = (square: Square) => {
    const sq = square as string;

    if (selectedSquare) {
      const newGame = new Chess(game.fen());
      try {
        const move = newGame.move({
          from: selectedSquare as Square,
          to: square,
          promotion: 'q',
        });

        if (move) {
          setGame(newGame);
          setHighlightedSquares({});
          setSelectedSquare(null);
          return;
        }
      } catch {}
    }

    const moves = game.moves({ square, verbose: true });

    if (moves.length === 0) {
      setHighlightedSquares({});
      setSelectedSquare(null);
      return;
    }

    const newHighlights: Record<string, string> = {};

    moves.forEach(m => {
      newHighlights[m.to as string] = 'var(--highlight-dot)';
    });

    newHighlights[sq] = 'var(--highlight-selected)';

    setHighlightedSquares(newHighlights);
    setSelectedSquare(sq);
  };

  const customSquareStyles = Object.fromEntries(
    Object.entries(highlightedSquares).map(([sq, cssVar]) => [
      sq,
      { background: cssVar }
    ])
  );

  // render
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <i className="fa-solid fa-chess-queen"></i>
          <span>CTT</span>
        </div>

        <nav className="sidebar-nav"></nav>

        <div className="sidebar-bottom">
          <button className="nav-btn" onClick={onBack}>
            <i className="fa-solid fa-house"></i>
            <span>Home</span>
          </button>

          <button className="nav-btn" onClick={() => setPage('settings')}>
            <i className="fa-solid fa-gear"></i>
            <span>Settings</span>
          </button>
        </div>
      </aside>

      <main className="board-view-main">
        <div className="board-container">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            customSquareStyles={customSquareStyles}
            boardWidth={560}
          />
        </div>

        <div className="board-panel">
          <h2 className="board-panel-title">Move History</h2>

          <div className="move-history">
            {game.history().length === 0 ? (
              <span className="move-history-empty">No moves yet</span>
            ) : (
              game.history().map((move, i) => (
                <span key={i}>
                  {i % 2 === 0 && (
                    <span className="move-number">{Math.floor(i / 2) + 1}.</span>
                  )}
                  <span className="move-text">{move}</span>
                </span>
              ))
            )}
          </div>

          <button
            className="btn-reset"
            onClick={() => {
              setGame(new Chess());
              setHighlightedSquares({});
              setSelectedSquare(null);
            }}
          >
            Reset Board
          </button>
        </div>
      </main>
    </div>
  );
};

export default BoardView;
