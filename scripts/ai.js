function aiLog() {
  console.log('AI module reading gamestate:', this.gameState);
}
// Initialize AI game
function aiGameInit() {
  this.playerBoards[1].playerReady = true;
}

// Find a random, yet-unshot square
function getRandomShot() {
  let randomShot;
  let status;
  do {
    randomShot = {
      userId: 0,
      row: Math.floor(Math.random() * 10),
      col: Math.floor(Math.random() * 10)
    };
    status = this.getSquareInfo(randomShot).status;
  } while (status !== STATUS.EMPTY && status !== STATUS.ALIVE);
  return randomShot;
}

// Register that the AI clicked the calculated square
function aiClick() {
  this.registerBoardClick(this.getRandomShot());
}

define((require, exports, module) => {
  module.exports = {
    aiLog,
    aiGameInit,
    aiClick,
    getRandomShot
  };
});