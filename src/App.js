import React, { useState } from 'react';
import './App.css';

const X = 'X';
const O = 'O';
const EMPTY = ' ';
const DRAW = 'DRAW';

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  const [board, setBoard] = useState(Array(9).fill(EMPTY));
  const [currentPlayer, setCurrentPlayer] = useState(X);
  const [winner, setWinner] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  // Function to handle a square click
  const handleClick = (index) => {
    if (board[index] !== EMPTY || isGameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setIsGameOver(true);
    } else if (!newBoard.includes(EMPTY)) {
      setWinner(DRAW);
      setIsGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === X ? O : X);
      if (currentPlayer === X) {
        makeComputerMove(newBoard);
      }
    }
  };

  // Check for a winner or a draw
  const checkWinner = (board) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] !== EMPTY && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  // Function to make a computer move (basic AI logic for simplicity)
  const makeComputerMove = (newBoard) => {
    let bestMove = getBestMove(newBoard, O);
    if (bestMove !== -1) {
      newBoard[bestMove] = O;
      setBoard(newBoard);

      const newWinner = checkWinner(newBoard);
      if (newWinner) {
        setWinner(newWinner);
        setIsGameOver(true);
      } else if (!newBoard.includes(EMPTY)) {
        setWinner(DRAW);
        setIsGameOver(true);
      } else {
        setCurrentPlayer(X);
      }
    }
  };

  // Minimax algorithm for finding the best move for "O"
  const getBestMove = (board, player) => {
    let bestScore = player === O ? -Infinity : Infinity;
    let move = -1;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === EMPTY) {
        board[i] = player;
        let score = minimax(board, 0, false);
        board[i] = EMPTY;
        if (player === O) {
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        } else {
          if (score < bestScore) {
            bestScore = score;
            move = i;
          }
        }
      }
    }
    return move;
  };

  // Minimax algorithm to calculate the best score
  const minimax = (board, depth, isMaximizing) => {
    const newWinner = checkWinner(board);
    if (newWinner === O) return 10 - depth;
    if (newWinner === X) return depth - 10;
    if (!board.includes(EMPTY)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === EMPTY) {
          board[i] = O;
          let score = minimax(board, depth + 1, false);
          board[i] = EMPTY;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === EMPTY) {
          board[i] = X;
          let score = minimax(board, depth + 1, true);
          board[i] = EMPTY;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  // Restart the game
  const resetGame = () => {
    setBoard(Array(9).fill(EMPTY));
    setCurrentPlayer(X);
    setWinner(null);
    setIsGameOver(false);
  };

  return (
    <div className="App">
      <h1>Tic-Tac-Toe</h1>
      <Board board={board} onClick={handleClick} />
      {winner && (
        <div className="winner-message">
          {winner === DRAW ? 'It\'s a draw!' : `${winner} wins!`}
        </div>
      )}
      <button onClick={resetGame}>Restart Game</button>
    </div>
  );
}

const Board = ({ board, onClick }) => {
  return (
    <div className="board">
      {board.map((value, index) => (
        <Square key={index} value={value} onClick={() => onClick(index)} />
      ))}
    </div>
  );
};

const Square = ({ value, onClick }) => {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
};

export default App;
