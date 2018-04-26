function aiLog() {
  console.log('AI module reading gamestate:', this.gameState);
}

define((require, exports, module) => {
  module.exports = {
    aiLog
  };
});