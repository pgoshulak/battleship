// Constants defining the ship inside a square
const SHIP = {
  NONE: 0,
  PATROL: 1,
  SUBMARINE: 2,
  DESTROYER: 3,
  BATTLESHIP: 4,
  CARRIER: 5
};

// Constants defining a square's status
const STATUS = {
  EMPTY: 0,
  MISS: 1,
  ALIVE: 2,
  HIT: 3,
  SUNK: 4
};

// A single square on the board
class BoardSpace {
  constructor() {
    this.ship = SHIP.NONE;
    this.status = STATUS.EMPTY;
  }
}

// A user's full 10x10 board
class UserBoard {
  constructor(userId, spaces) {
    // Assign user id
    this.userId = userId;
    if (!spaces) {
      // Initialize 10x10 array of empty squares
      // this.spaces = [...Array(10).fill(Array(10).fill(new BoardSpace))];
      let arr = [];
      for (let i = 0; i < 10; i ++) {
        arr.push([]);
        for (let j = 0; j < 10; j ++) {
          arr[i][j] = new BoardSpace;
        }
      }
      this.spaces = arr;
    } else {
      // Initialize a 10x10 array of predetermined squares
      this.spaces = spaces;
    }
  }
}

define((require, exports, module) => {
  module.exports = {
    // Full game state
    state() {
      return {
        // The boards for the two players
        playerBoards: [
          new UserBoard(0),
          new UserBoard(1)
        ],
        currentPlayer: 0,
        currentOpponent: 1
      };
    },

    // Swap the boards in the 'opponent' (top) and 'player' (bottom) states
    swapCurrentPlayers(state) {
      let temp = state.currentOpponent;
      state.currentOpponent = state.currentPlayer;
      state.currentPlayer = temp;
    },

    // Get info of square
    getSquareInfo(state, squareCoords) {
      let userId = squareCoords.userId;
      let row = squareCoords.row;
      let col = squareCoords.col;

      let squareInfo = state.playerBoards[userId].spaces[row][col];
      let ship = squareInfo.ship;
      let status = squareInfo.status;

      console.log(`User ${userId}'s square R${row}C${col} clicked!`);
      console.log(`--> Ship type = ${ship}`);
      console.log(`--> Status = ${status}`);
    },

    // Set info of square
    setSquareInfo(state, squareCoords, squareInfo) {
      let userId = squareCoords.userId;
      let row = squareCoords.row;
      let col = squareCoords.col;

      console.log(`setting info on R${row} C${col}`);
      state.playerBoards[userId].spaces[row][col].ship = squareInfo.ship;
      state.playerBoards[userId].spaces[row][col].status = squareInfo.status;
    }
  };
});