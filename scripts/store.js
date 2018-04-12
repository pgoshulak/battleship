class Board {
  constructor(playerNum, spaces) {
    this.playerNum = playerNum;
    this.spaces = spaces;
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
          new Board(0, [1, 2, 3]),
          new Board(1, [4, 5, 6])
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