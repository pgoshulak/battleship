function aiLog() {
  console.log('AI module reading gamestate:', this.gameState);
}
// Initialize AI game
function aiGameInit() {
  this.playerBoards[1].playerReady = true;
}

// Find a random, yet-unshot square divisible by smallest living ship
function getRandomShot(smallestShipLength) {
  let randomShot;
  let status;
  let isDivisibleByShip;
  do {
    randomShot = {
      userId: 0,
      row: Math.floor(Math.random() * 10),
      col: Math.floor(Math.random() * 10)
    };
    status = this.getSquareInfo(randomShot).status;

    // Generate shots that rule out the smallest alive ship
    // Eg. Patrol Boat is alive, length 2 -> checkerboard (ie max dist between shots is 1 square)
    // Eg. Battleship is alive, length 4 -> stripes (ie max dist between shots is 3 square)
    isDivisibleByShip = ((randomShot.row + randomShot.col) % smallestShipLength) === 0;
  } while (!isDivisibleByShip);
  return randomShot;
}

// Register that the AI clicked the calculated square
function aiClick() {
  this.registerBoardClick(this.getRandomShot(5));
}

define((require, exports, module) => {
  module.exports = {
    aiLog,
    aiGameInit,
    aiClick,
    getRandomShot
  };
});