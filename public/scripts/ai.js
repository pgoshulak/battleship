// AI state:
// - 'random': randomly shooting to find a hit
// - 'targeting': a hit has been made; trying to determine which direction the ship lays
// - 'striking': two adjacent hits; continuing in this direction until miss/sunk
let aiState = 'random';
let smallestShipSize = 2;
// Stack (LI/FO) of hits made
let hitStack = [];
let nextShot = {};

// Upon two adjacent hits, direction of hits
let lastDirectionTried = '';
let discoveredDirection = '';

// TODO: array of shot attempts before prevShot != recentShot --> if array grows too big, reset aiState to random (ie. current strategy has failed)

// Initialize AI game
function aiGameInit() {
  this.playerBoards[1].playerReady = true;
}

// Check if a shot is to a valid square (row/col exist) and not already taken (not a miss/hit/sunk)
function isValidShot(state, shot) {
  let board = state.playerBoards[0].spaces;
  if (board[shot.row]
    && board[shot.row][shot.col]
    && board[shot.row][shot.col].status !== STATUS.MISS
    && board[shot.row][shot.col].status !== STATUS.HIT
    && board[shot.row][shot.col].status !== STATUS.SUNK) {
    return true;
  } else {
    return false;
  }
}

// Find a random, yet-unshot square divisible by smallest living ship
function getRandomShot(state, smallestShipLength) {
  let randomShot;
  let status;
  let isDivisibleByShip;
  do {
    randomShot = {
      userId: 0,
      row: Math.floor(Math.random() * 10),
      col: Math.floor(Math.random() * 10)
    };
    status = state.getSquareInfo(randomShot).status;

    // Generate shots that rule out the smallest alive ship
    // Eg. Patrol Boat is alive, length 2 -> checkerboard (ie max dist between shots is 1 square)
    // Eg. Battleship is alive, length 4 -> stripes (ie max dist between shots is 3 square)
    isDivisibleByShip = ((randomShot.row + randomShot.col) % smallestShipLength) === 0;

    // Note: the while() condition originally considered if a shot was to an
    // empty square, but the !isDivisibleByShip boolean mysteriously doesn't
    // work with that check. Currently, an invalid shot (ie. to MISS/HIT square)
    // simply loops back to 'awaitingShot' game state.
  } while (!isDivisibleByShip);
  return randomShot;
}

// Translate a NSEW direction into row+/- and col+/-
function getDirectionOffset(dir) {
  // Given a direction 0=N, 1=W, 2=S, 3=E, return row and col differential
  // eg. dir=0 -> N -> rowDiff = -1 (move up 1), colDiff = 0 (don't move sideways);
  return {
    col: (dir - 2) % 2,
    row: (dir - 1) % 2
  };
}

// Return the reverse of a given NSEW direction
function reverseDirection(dir) {
  // Given a direction 0=N, 1=W, 2=S, 3=E, return opposite direction
  // eg. dir=0 -> N -> return 2 (S)
  return (dir + 2) % 4;
}
// Shoot a random adjacent square
// Note: side-effect!! Function sets variable `lastDirectionTried` of parent scope, and may (in future) pop() from hitStack
function getRandomNearbyShot(state, hitStack) {
  let lastShot = hitStack[hitStack.length - 1];
  let nextShot = null;
  let counter = 0;
  do {
    let randomDir = Math.floor(Math.random() * 4);
    let offset = getDirectionOffset(randomDir);
    nextShot = {
      userId: 0,
      col: lastShot.col + offset.col,
      row: lastShot.row + offset.row
    };
    lastDirectionTried = randomDir;

    /* TODO: This is where AI can get more advanced. Finding a valid shot should involve
    both whether the space exists (as is currently) AND if the shot has been taken. IF the
    shot has already been taken (ie. status == miss/hit/sunk), take that shot's direction
    (n/e/s/w) out of contention. If there are no more valid directions, pop the current
    space from the hitStack (ie. it's been exhausted) and continue getting shots adjacent
    to the remaining shots in the stack. Once the stack has been exhausted, return null to
    indicate the parent scope should reset aiState to 'random'.

    Note that this strategy wouldn't account for when ships are sunk, and how to pop the
    correct number of squares off the stack (let alone which ones, eg. if multiple ships
    are tightly packed)
     */

    // If shot wasn't valid, try again until a maximum (max is 20 because dir is randomized, need to wait until all dirs likely tried)
  } while (!isValidShot(state, nextShot) && counter < 20);

  if (!isValidShot(state, nextShot)) {
    return null;
  } else {
    return nextShot;
  }
}

// Get the size of the smallest ship (for choosing shot spacing)
function getSmallestShipSize(state) {
  let shipSquaresAlive = state.playerBoards[0].shipSquaresAlive;
  let smallestShipSize = 5;

  // Check each ship from biggest -> smallest
  for (let shipType = 5; shipType > 0; shipType--) {
    if (shipSquaresAlive[shipType] > 0) {
      smallestShipSize = SHIP_SIZE[shipType];
    }
  }
  return smallestShipSize;
}

// Reset state and helper variables to 'random' shooting
function resetToRandom() {
  aiState = 'random';
  lastDirectionTried = '';
  discoveredDirection = '';
}

// Return the next shot in a given direction
function getNextShotInDirection(state, hitStack, direction) {
  let board = state.playerBoards[0].spaces;
  let lastShot = hitStack[hitStack.length - 1];
  // If there is a valid shot in the direction, return it
  // If the direction leads to a board edge, return null (requesting a reverse)
  // FIXME: Need to be able to backtrack over squares

  if (direction === 'n' && lastShot.row - 1 >= 0) {
    return { userId: 0, row: lastShot.row - 1, col: lastShot.col };

  } else if (direction === 's' && lastShot.row + 1 <= 9) {
    return { userId: 0, row: lastShot.row + 1, col: lastShot.col };
    
  } else if (direction === 'e' && lastShot.col + 1 <= 9) {
    return { userId: 0, row: lastShot.row, col: lastShot.col + 1 };
    
  } else if (direction === 'w' && lastShot.col - 1 >= 0) {
    return { userId: 0, row: lastShot.row, col: lastShot.col - 1 };
    
  } else {
    return null;
  }
}

// Register that the AI clicked the calculated square
function aiClick() {
  let nextShot = null;
  smallestShipSize = getSmallestShipSize(this);

  // Get the AI's last shot (ie. two shots ago in the log, since Player shot last)
  let lastAiShot = this.shotLog[this.shotLog.length - 2] || {outcome: 'miss', sunk: 0};

  /* ----- Assign new state variables given previous shot outcome ----- */
  // Note: This should be done in a Finite State Machine as is gameEngine.js
  if (lastAiShot.outcome === 'hit') {
    // If last shot was a hit, add it to the stack for 'investigating'
    hitStack.push(lastAiShot);
    // If AI was randomly shooting but got a hit, try to find the ship direction
    if (aiState === 'random') {
      aiState = 'targeting';
      
      // If AI found the direction successfully, keep shooting in that direction
    } else if (aiState === 'targeting') {
      discoveredDirection = lastDirectionTried;
      aiState = 'striking';
    }
  } else if (lastAiShot.outcome === 'miss') {
    if (aiState === 'striking') {
      discoveredDirection = reverseDirection(discoveredDirection);
    }
  }
  if (lastAiShot.sunk > 0) {
    // Future: Deal with adjacent ships that may give several adjacent, different-ship hits
    resetToRandom();
  }
  
  /* ----- Execute the next shot depending on updated state ----- */
  console.log(aiState);
  if (aiState === 'random') {
    nextShot = getRandomShot(this, smallestShipSize);
    
  } else if (aiState === 'targeting') {
    // Try shooting adjacent to the most recent hit
    nextShot = getRandomNearbyShot(this, hitStack);
    if (nextShot === null) {
      resetToRandom();
      nextShot = getRandomShot(this, smallestShipSize);
    }

  } else if (aiState === 'striking') {
    nextShot = getNextShotInDirection(this, hitStack, discoveredDirection);
    // If the direction continues into a board edge, reverse it
    if (nextShot === null) {
      discoveredDirection = reverseDirection(discoveredDirection);
      nextShot = getNextShotInDirection(this, hitStack, discoveredDirection);
    }
    // If direction is still invalid, reset aiState to random
    if (nextShot === null) {
      resetToRandom();
      nextShot = getRandomShot(this, smallestShipSize);
    }
  }
  this.registerBoardClick(nextShot);

}

define((require, exports, module) => {
  module.exports = {
    aiGameInit,
    aiClick
  };
});