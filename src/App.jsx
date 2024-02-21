import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { useState } from "react";
import { WINNING_COMBINATION } from "./winning-combination";

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";
  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }
  return currentPlayer;
}

function deriveWinner(gameBoard, playersName) {
  let winner;
  for (const combination of WINNING_COMBINATION) {
    const first = gameBoard[combination[0].row][combination[0].col];
    const second = gameBoard[combination[1].row][combination[1].col];
    const third = gameBoard[combination[2].row][combination[2].col];
    if (first && first === second && first === third) {
      winner = playersName[first];
      break;
    }
  }
  return winner;
}
function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD].map((array) => [...array]);
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }
  return gameBoard;
}

function App() {
  const [playersName, setPlayersName] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, playersName);
  const hasDraw = gameTurns.length === 9 && !winner;

  function handlePlayersNameChange(symbol, newName) {
    setPlayersName((prevPlayerNames) => {
      return {
        ...prevPlayerNames,
        [symbol]: newName,
      };
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }
  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevGameTurns) => {
      const currentPlayer = deriveActivePlayer(prevGameTurns);
      const updatedGameTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevGameTurns,
      ];
      return updatedGameTurns;
    });
  }
  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            intialName="Player 1"
            symbol="X"
            isActive={activePlayer === "X"}
            onChange={handlePlayersNameChange}
          />
          <Player
            intialName="Player 2"
            symbol="O"
            isActive={activePlayer === "O"}
            onChange={handlePlayersNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBoard onSelect={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
