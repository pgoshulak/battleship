const SHIP = {
  NONE: 0,
  CRUISER: 1,
  SUBMARINE: 2,
  DESTROYER: 3,
  BATTLESHIP: 4,
  CARRIER: 5
};

const STATUS = {
  EMPTY: 0,
  ALIVE: 1,
  HIT: 2,
  SUNK: 3
};

class BoardSpace {
  constructor() {
    this.ship = SHIP.NONE;
    this.status = STATUS.EMPTY;
  }
}
class PlayerBoard {
  constructor(playerNum, spaces) {
    this.playerNum = playerNum;
    if (!spaces) {
      this.spaces = [...Array(10).fill(Array(10).fill(new BoardSpace))];
      console.log(this.spaces);
    } else {
      this.spaces = spaces;
    }
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
          new PlayerBoard(0),
          new PlayerBoard(1)
        ],
        currentPlayer: 0,
        currentOpponent: 1
      };
    },

    swapCurrentPlayers(state) {
      let temp = state.currentOpponent;
      state.currentOpponent = state.currentPlayer;
      state.currentPlayer = temp;
    }
  };
});