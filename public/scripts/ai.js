// AI state:
// - 'random': randomly shooting to find a hit
// - 'targeting': a hit has been made; trying to determine which direction the ship lays
// - 'striking': two adjacent hits; continuing in this direction until miss/sunk
let aiState = 'random';
let smallestShipSize = 2;
// Stack (LI/FO) of hits made
let hitStack = [];

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

// Returns the status of a square, considering whether the shot is within the board or not
function getShotValidity(state, shot) {
  let board = state.playerBoards[0].spaces;
  if (!board[shot.row] || !board[shot.row][shot.col]) {
    return STATUS.INVALID;
  }
  return board[shot.row][shot.col].status;
}

// Find a random, yet-unshot square divisible by smallest living ship
function getRandomShot(state, smallestShipLength) {
  let randomShot;
  let status;
  let isDivisibleByShip;
  let counter = 0;
  do {
    counter++;
    randomShot = {
      userId: 0,
      row: Math.floor(Math.random() * 10),
      col: Math.floor(Math.random() * 10)
    };
    status = state.getSquareInfo(randomShot).status;

    // Filter for shots that rule out the smallest alive ship
    // Eg. Patrol Boat is alive, length 2 -> checkerboard (ie max dist between shots is 1 square)
    // Eg. Battleship is alive, length 4 -> stripes (ie max dist between shots is 3 square)
    isDivisibleByShip = ((randomShot.row + randomShot.col) % smallestShipLength) === 0;

    // Limit the attempts to find a 'divisible' shot
    // Eg. if long ship has a single square alive in the middle but it isn't a 'divisible' square, it will never be shot
    
    if (!isValidShot(state, randomShot)) {
      // Linting note: the while() condition would not accept the boolean !isDivisibleByShip
      // in combination with other booleans. Therefore the condition of isDivisibleByShip would
      // be ignored and shots would not follow this pattern.
      // Using a 'continue' here is admittedly bad form, but it is the only way this condition
      // would be considered
      continue;
    }
    if (counter > 10) {
      return randomShot;
    }
    // Only allow shots that consider smallest ship, and whether they're not already shot at
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
  // Retrieve the last 'hit' shot
  let lastShot = hitStack[hitStack.length - 1];
  let nextShot = null;
  let counter = 0;
  do {
    // Pick random direction from 0=N, 1=W, 2=S, 3=E
    let randomDir = Math.floor(Math.random() * 4);
    // Translate direction into row/col offsets
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

    // If shot wasn't valid, try again until a maximum (max is 20 because dir is randomized,
    // need to wait until all 4 dirs likely tried)
    counter++;
  } while (!isValidShot(state, nextShot) && counter < 20);

  // If shot is invalid but counter has overflowed, return null (indicating no possible adjacent shots)
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

  // Override: if there are only a few squares left and AI is still shooting random,
  // allow AI to shoot at any square (fixes issue of AI not detecting ship clumps and
  // not being able to hit 'that one last shot' that isn't on a ship's valid-shots
  // diagonal ... see getRandomShot() for this value's implementation)
  if (shipSquaresAlive.total < 4) {
    return 1;
  }

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
  let prevShotConsidered = lastShot;
  let counter = 0;
  let nextShot = null;
  // Get the next shot in a given direction, advancing along dir given the following:
  // - space is not shot at -> shoot at it
  // - space is a hit -> skip over it and try again
  // - space is a miss -> return null (parent scope should reverse direction and try again)
  // - space is sunk -> return null (parent scope should reverse direction and try again)
  //   (this might be cheating? The AI would differentiate hit vs sunk, whereas player sees
  //   them both as 'red' but can remember 'sunk' patterns)
  // - space is outside board -> return null (parent scope should reverse direction and try again)
  
  do {
    counter++;
    let offset = getDirectionOffset(direction);
    // Assign the next shot as prev shot + direction offset
    nextShot = {
      userId: 0,
      col: prevShotConsidered.col + offset.col,
      row: prevShotConsidered.row + offset.row
    };
    let nextShotValidity = getShotValidity(state, nextShot);
    
    // If shot hasn't been taken, take it
    if (nextShotValidity === STATUS.EMPTY
      || nextShotValidity === STATUS.ALIVE) {
      // Take the shot
      return nextShot;

      // If shot would be a miss, outside the board, or a known sunk ship
    } else if (nextShotValidity === STATUS.MISS
      || nextShotValidity === STATUS.INVALID
      || nextShotValidity === STATUS.SUNK) {
      // Tell parent scope that no valid shot exists in this direction
      return null;

      // If shot is a hit (ie. likely belongs to same ship)
    } else if (nextShotValidity === STATUS.HIT) {
      // 'Crawl' along the ship (eg. backtracking to find the next unshot square)
      prevShotConsidered = Object.assign({}, nextShot);
    }

    // Limit number of attempts in case of infinite loop
  } while (counter < 20);
  return null;
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
    // If AI was shooting along a known ship direction but reached the end (ie. miss), backtrack
    if (aiState === 'striking') {
      discoveredDirection = reverseDirection(discoveredDirection);
    }
  }
  // Once a ship has been sunk, revert to random shooting
  if (lastAiShot.sunk > 0) {
    // Future: Deal with adjacent ships that may give several adjacent, different-ship hits
    // but would prematurely revert to randomized shooting once one has been sunk
    resetToRandom();
  }
  
  /* ----- Execute the next shot depending on updated state ----- */
  
  // AI knows the ship direction (ie. two adjacent hits)
  if (aiState === 'striking') {
    // If AI knows ship direction, keep shooting in that direction
    nextShot = getNextShotInDirection(this, hitStack, discoveredDirection);
    // If the direction continues into a board edge or a miss, reverse it
    if (nextShot === null) {
      discoveredDirection = reverseDirection(discoveredDirection);
      nextShot = getNextShotInDirection(this, hitStack, discoveredDirection);
    }
    // If direction is still invalid (after initial reversing), downgrade AI state to 'targeting'
    if (nextShot === null) {
      aiState = 'targeting';
    }
  }

  // AI has a single hit but doesn't know which direction the ship proceeds
  if (aiState === 'targeting') {
    // Try shooting adjacent to the most recent hit
    nextShot = getRandomNearbyShot(this, hitStack);
    // If no adjacent shots are availble, downgrade AI state to 'random'
    if (nextShot === null) {
      resetToRandom();
    }
  }

  // AI is shooting randomly to discover a ship
  if (aiState === 'random' || nextShot === null) {
    nextShot = getRandomShot(this, smallestShipSize);
  }

  // Send the click to the board
  this.registerBoardClick(nextShot);
}

define((require, exports, module) => {
  module.exports = {
    aiGameInit,
    aiClick
  };
});