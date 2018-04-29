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

// Initialize AI game
function aiGameInit() {
  this.playerBoards[1].playerReady = true;
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

// Shoot a random adjacent square
// Note: side-effect!! Function sets variable `lastDirectionTried` of parent scope, and may (in future) pop() from hitStack
function getRandomNearbyShot(hitStack) {
  let lastShot = hitStack[hitStack.length - 1];
  let nextShot = null;
  do {
    let randomDir = Math.floor(Math.random() * 4);
    
    if (randomDir === 0 && lastShot.row - 1 >= 0) {
      // Next shot is North
      nextShot = { userId: 0, col: lastShot.col, row: lastShot.row - 1};
      lastDirectionTried = 'n';

    } else if (randomDir === 1 && lastShot.col + 1 <= 9) {
      // Next shot is EAST
      nextShot = { userId: 0, col: lastShot.col + 1, row: lastShot.row};
      lastDirectionTried = 'e';

    } else if (randomDir === 2 && lastShot.row + 1 <= 9) {
      // Next shot is SOUTH
      nextShot = { userId: 0, col: lastShot.col, row: lastShot.row + 1};
      lastDirectionTried = 's';

    } else if (randomDir === 3 && lastShot.col - 1 >= 0) {
      // Next shot is WEST
      nextShot = { userId: 0, col: lastShot.col - 1, row: lastShot.row};
      lastDirectionTried = 'w';
    }

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

    // If shot wasn't valid, try again
  } while (!nextShot);
  return nextShot;
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

// Register that the AI clicked the calculated square
function aiClick() {
  let nextShot = null;
  smallestShipSize = getSmallestShipSize(this);

  // Get the AI's last shot (ie. two shots ago in the log, since Player shot last)
  let lastAiShot = this.shotLog[this.shotLog.length - 2] || {outcome: 'miss', sunk: 0};

  /* ----- Assign new state variables given previous shot outcome ----- */
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
  } else if (lastAiShot.sunk > 0) {
    aiState = 'random';
  }
  
  /* ----- Execute the next shot depending on updated state ----- */
  if (aiState === 'random') {
    nextShot = getRandomShot(this, smallestShipSize);
    this.registerBoardClick(nextShot);
    return;
  } else if (aiState === 'targeting') {
    nextShot = getRandomNearbyShot(hitStack);
    // Try shooting adjacent to the most recent hit
    this.registerBoardClick(nextShot);
    return;
  } else if (aiState === 'striking') {
    nextShot = 
  }

}

define((require, exports, module) => {
  module.exports = {
    aiGameInit,
    aiClick
  };
});