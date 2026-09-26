import { useEffect, useReducer } from "react";
import Board from "./components/Board";
import GameStatus from "./components/GameStatus";
import { gameReducer, initialState,} from "./reducer/gameReducer";
import "./App.css";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board) {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }

  return null;
}

function minimax(board, isMaximizing) {
  const winner = getWinner(board);

  if (winner === "O") {
    return 10;
  }

  if (winner === "X") {
    return -10;
  }

  if (board.every((square) => square !== null)) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";

        const score = minimax(board, false);

        board[i] = null;

        bestScore = Math.max(bestScore, score);
      }
    }

    return bestScore;
  }

  let bestScore = Infinity;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = "X";

      const score = minimax(board, true);

      board[i] = null;

      bestScore = Math.min(bestScore, score);
    }
  }

  return bestScore;
}

function findWinningMove(board, player) {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = player;

      const winner = getWinner(board);

      board[i] = null;

      if (winner === player) {
        return i;
      }
    }
  }

  return null;
}


function getBestMove(board) {
  const emptySquares = board
    .map((square, index) =>
      square === null ? index : null
    )
    .filter((index) => index !== null);

  if (emptySquares.length === 0) {
    return null;
  }

  const winningMove = findWinningMove(board, "O");

  if (winningMove !== null) {
    return winningMove;
  }

  const blockingMove = findWinningMove(board, "X");

  if (blockingMove !== null) {
    return blockingMove;
  }

  
  const useSmartMove = Math.random() < 0.9;

  if (useSmartMove) {
    let bestScore = -Infinity;
    let bestMoves = [];

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";

        const score = minimax(board, false);

        board[i] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMoves = [i];
        } else if (score === bestScore) {
          bestMoves.push(i);
        }
      }
    }

    return bestMoves[
      Math.floor(Math.random() * bestMoves.length)
    ];
  }

  return emptySquares[
    Math.floor(Math.random() * emptySquares.length)
  ];
}

function App() {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialState
  );

  useEffect(() => {
    if (
      state.currentPlayer === "O" &&
      !state.winner &&
      !state.draw
    ) {
      const timer = setTimeout(() => {
        const boardCopy = [...state.board];

        const computerMove = getBestMove(boardCopy);

        if (computerMove !== null) {
          dispatch({
            type: "MAKE_MOVE",
            index: computerMove,
          });
        }
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [
    state.currentPlayer,
    state.board,
    state.winner,
    state.draw,
  ]);

  const handleSquareClick = (index) => {
    
    if (state.currentPlayer !== "X") {
      return;
    }

    dispatch({
      type: "MAKE_MOVE",
      index,
    });
  };

  const handleRestart = () => {
    dispatch({
      type: "RESET_GAME",
    });
  };

  return (
    <main className="app">
      <div className="game-container">

        
        <div className="players">

          <div className={`player-card ${state.currentPlayer === "X" &&
              !state.winner && !state.draw ? "active" : "" }`} >
          
            <div className="player-symbol x">
              X
            </div>

            <div>
              <strong>You</strong>
            </div>
          </div>

          <div className="vs">
            VS
          </div>

          <div className={`player-card ${state.currentPlayer === "O" && 
          !state.winner && !state.draw ? "active" : "" }`} >
          
            <div className="player-symbol o">O</div>

            <div>
              <strong>Computer</strong>
            </div>
          </div>

        </div>

        <div className="game-card">

          <GameStatus winner={state.winner} draw={state.draw} currentPlayer={state.currentPlayer} />

          <Board board={state.board} onSquareClick={handleSquareClick} />

          <button className="restart-button" onClick={handleRestart} > Restart </button>

        </div>

      </div>
    </main>
  );
}

export default App;