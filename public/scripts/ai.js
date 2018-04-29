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
  } while (!isDivisibleByShip);
  return randomShot;
}

// Get the size of the smallest ship (for choosing shot spacing)
function getSmallestShipSize(state) {
  let shipSquaresAlive = state.playerBoards[0].shipSquaresAlive;
  let smallestShipSize = 5;

  // Check each ship from biggest -> smallest
  for (let shipType = 5; shipType > 0; shipType--) {
    console.log(`checking ${SHIP_NAME[shipType]}`);
    if (shipSquaresAlive[shipType] > 0) {
      smallestShipSize = SHIP_SIZE[shipType];
      console.log('alive');
    }
  }
  console.log('smallest size: ', smallestShipSize);
  return smallestShipSize;
}

// Register that the AI clicked the calculated square
function aiClick() {
  let smallestShipSize = getSmallestShipSize(this);
  this.registerBoardClick(getRandomShot(this, smallestShipSize));
}

define((require, exports, module) => {
  module.exports = {
    aiGameInit,
    aiClick
  };
});