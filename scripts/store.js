class Board {
  constructor(playerNum) {
    this.playerNum = playerNum;
    this.spaces = [1, 2, 3];
  }
  log() {
    console.log(`hello from player ${this.playerNum}'s board`);
  }
}
define((require, exports, module) => {

  module.exports = {
    state() {
      return {
        playerBoards: [
          new Board(0),
          new Board(1)
        ],
        currentPlayer: 0,
        currentOpponent: 1
      };
    },

    swapCurrentPlayers(state) {
      var temp = state.currentOpponent;
      state.currentOpponent = state.currentPlayer;
      state.currentPlayer = temp;
    }
  };
});