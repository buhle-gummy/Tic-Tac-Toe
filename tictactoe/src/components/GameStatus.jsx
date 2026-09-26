function GameStatus({ winner, draw, currentPlayer }) {
  if (winner) {
    return <h2 className="status">Winner: {winner}</h2>;
  }

  if (draw) {
    return <h2 className="status">Draw!</h2>;
  }

  return (
    <h2 className="status">
      Next Player: {currentPlayer}
    </h2>
  );
}

export default GameStatus;