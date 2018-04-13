// Constants defining the ship inside a square
const SHIP = {
  NONE: 0,
  CRUISER: 1,
  SUBMARINE: 2,
  DESTROYER: 3,
  BATTLESHIP: 4,
  CARRIER: 5
};

// Constants defining a square's status
const STATUS = {
  EMPTY: 0,
  ALIVE: 1,
  HIT: 2,
  SUNK: 3
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
      this.spaces = [...Array(10).fill(Array(10).fill(new BoardSpace))];
      console.log(this.spaces);
    } else {
      // Initialize a 10x10 array of predetermined squares
      this.spaces = spaces;
    }
  }
  log() {
    console.log(`hello from player ${this.userId}'s board`);
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
    }
  };
});