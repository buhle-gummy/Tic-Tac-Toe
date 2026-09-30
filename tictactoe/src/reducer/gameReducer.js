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

export const initialState = {
  board: Array(9).fill(null),
  currentPlayer: "X",
  winner: null,
  draw: false,
};

export function getWinner(board) {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;

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

export function gameReducer(state, action) {
  switch (action.type) {
    case "MAKE_MOVE": {
      const { index } = action;

      if (state.winner || state.draw) {
        return state;
      }

      if (state.board[index]) {
        return state;
      }

      const newBoard = [...state.board];
      newBoard[index] = state.currentPlayer;

      const winner = getWinner(newBoard);

      if (winner) {
        return {
          ...state,
          board: newBoard,
          winner,
        };
      }

      const isDraw = newBoard.every(
        (square) => square !== null
      );

      if (isDraw) {
        return {
          ...state,
          board: newBoard,
          draw: true,
        };
      }

      return {
        ...state,
        board: newBoard,
        currentPlayer:
          state.currentPlayer === "X" ? "O" : "X",
      };
    }

    case "RESET_GAME":
      return initialState;

    default:
      return state;
  }
}