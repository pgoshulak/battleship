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
  // Returns a dict with each ship's number of 'alive' squares
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

// Set only status of a square
function setSquareStatus(squareCoords, newStatus) {
  let newSquareInfo = {
    status: newStatus,
    ship: this.getSquareInfo(squareCoords).ship
  };
  this.setSquareInfo(squareCoords, newSquareInfo);
}

// Set only status of a square
function setSquareShip(squareCoords, newShip) {
  let newSquareInfo = {
    status: this.getSquareInfo(squareCoords).status,
    ship: newShip
  };
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

// Function generator to do <something> to all board squares
function affectAllSpaces(scope, userId, cb) {
  let board = scope.playerBoards[userId].spaces;

  for (let row of board) {
    for (let space of row) {
      cb(space);
    }
  }
}

// Set all of a ship's squares from hit -> sunk
function sinkShip(userId, shipType) {
  affectAllSpaces(this, userId, function(space) {
    if (space.ship === shipType) {
      space.status = STATUS.SUNK;
    }
  });
}

// Remove a ship from the board
function removeShip(userId, shipType) {
  affectAllSpaces(this, userId, function(space) {
    if (space.ship === shipType) {
      space.status = STATUS.REMOVED;
    }
  });
}

// Remove a ship from the board
function clearRemovedShip(userId, shipType) {
  affectAllSpaces(this, userId, function(space) {
    if (space.ship === shipType && space.status === STATUS.REMOVED) {
      space.status = STATUS.EMPTY;
      space.ship = SHIP.NONE;
    }
  });
}

// Place a ship on the board
function placeShip(coords, shipType, direction) {
  let board = this.playerBoards[coords.userId].spaces;
  let shipSize = SHIP_SIZE[shipType];
  
  if (direction === 'h') {
    for (let i = 0; i < shipSize; i++) {
      board[coords.row][coords.col + i].ship = shipType;
      board[coords.row][coords.col + i].status = STATUS.ALIVE;
    }
  } else {
    for (let i = 0; i < shipSize; i++) {
      board[coords.row + i][coords.col].ship = shipType;
      board[coords.row + i][coords.col].status = STATUS.ALIVE;
    }
  }
}

// Reset a removed ship to its original position
function resetShip(userId, shipType) {
  affectAllSpaces(this, userId, function(space) {
    if (space.ship === shipType) {
      space.status = STATUS.ALIVE;
    }
  });
}

// Set ship-picked-up info
function setShipPickedUp(square) {
  let board = this.playerBoards[square.userId].spaces;
  let row = square.row;
  let col = square.col;
  let thisShipType = this.getSquareInfo(square).ship;
  let direction = 'h';

  // Check if ship is vertical
  // Check if board square above exists and is same ship type
  if (board[row - 1] && board[row - 1][col].ship === thisShipType) {
    direction = 'v';
  }
  // Check if board square below exists and is same ship type
  if (board[row + 1] && board[row + 1][col].ship === thisShipType) {
    direction = 'v';
  }

  this.shipPickedUp = Object.assign({}, this.shipPickedUp, {
    shipType: thisShipType,
    direction: direction
  });
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
        shipPickedUp: {
          shipType: 0,
          direction: 'h',
          mouseX: 0,
          mouseY: 0
        },
        currentPlayer: 0,
        currentOpponent: 1,
        gameState: 'awaitingShipPickup',
        setState: setState,
        swapCurrentPlayers: swapCurrentPlayers,
        getSquareInfo: getSquareInfo,
        setSquareInfo: setSquareInfo,
        setSquareStatus: setSquareStatus,
        setSquareShip: setSquareShip,
        registerBoardClick: registerBoardClick,
        sinkShip: sinkShip,
        removeShip: removeShip,
        clearRemovedShip: clearRemovedShip,
        placeShip: placeShip,
        resetShip: resetShip,
        setShipPickedUp: setShipPickedUp
      };
    }
  };
});