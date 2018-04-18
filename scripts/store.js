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
      this.spaces = Array(10).fill().map(() => {
        return Array(10).fill().map(() => new BoardSpace);
      });
    } else {
      // Initialize a 10x10 array of predetermined squares
      this.spaces = spaces;
    }
  }
  // Returns a dict with each ship's
  get shipSquaresAlive() {
    let ships = {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      'total': 0
    };
    for (let row of this.spaces) {
      for (let space of row) {
        if (space.status === STATUS.ALIVE) {
          ships[space.ship] += 1;
          ships['total'] += 1;
        }
      }
    }
    return ships;
  }
}

// Swap the boards in the 'opponent' (top) and 'player' (bottom) states
function swapCurrentPlayers() {
  let temp = this.currentOpponent;
  this.currentOpponent = this.currentPlayer;
  this.currentPlayer = temp;
}

// Get info of square
function getSquareInfo(squareCoords) {
  let userId = squareCoords.userId;
  let row = squareCoords.row;
  let col = squareCoords.col;

  let squareInfo = this.playerBoards[userId].spaces[row][col];
  let ship = squareInfo.ship;
  let status = squareInfo.status;

  return {
    squareInfo: squareInfo,
    ship: ship,
    status: status
  };
}

// Set info of square
function setSquareInfo(squareCoords, squareInfo) {
  let userId = squareCoords.userId;
  let row = squareCoords.row;
  let col = squareCoords.col;

  this.playerBoards[userId].spaces[row][col].ship = squareInfo.ship;
  this.playerBoards[userId].spaces[row][col].status = squareInfo.status;
}

// Register a shot to a square
function registerShot(squareCoords) {
  let squareInfo = this.getSquareInfo(squareCoords);

  // Player has clicked on their own square (TODO: Factor this out???)
  if (squareCoords.userId === this.currentPlayer) {
    return;
  }

  let newSquareInfo = {};
  // Check if the square is a hit (ie. there is an alive ship)
  if (squareInfo.status === 2) {
    newSquareInfo = Object.assign({}, squareInfo, {
      status: 3
    });
  } else {
    // The shot is a miss
    newSquareInfo = Object.assign({}, squareInfo, {
      status: 1
    });
  }
  this.setSquareInfo(squareCoords, newSquareInfo);
}

// Register a click on a square
function registerBoardClick(squareCoords) {
  this.lastSquareClicked = Object.assign({}, squareCoords);
}

// Set new state
function setState(newState) {
  this.gameState = newState;
}

define((require, exports, module) => {
  module.exports = {
    // Full game state
    state() {
      return {
        // The boards for the two players
        playerBoards: [
          new UserBoard(0, JSON.parse(randomBoardNoShots)),
          new UserBoard(1, JSON.parse(randomBoardWithShots))
        ],
        lastSquareClicked: {
          userId: 0,
          row: 0,
          col: 0
        },
        currentPlayer: 0,
        currentOpponent: 1,
        gameState: 'awaitingShot',
        setState: setState,
        swapCurrentPlayers: swapCurrentPlayers,
        getSquareInfo: getSquareInfo,
        setSquareInfo: setSquareInfo,
        registerShot: registerShot,
        registerBoardClick: registerBoardClick
      };
    }
  };
});