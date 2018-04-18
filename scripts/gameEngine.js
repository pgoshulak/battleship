define((require, exports, module) => {
  module.exports = {
    game: function(state) {
      return {
        logState () {
          console.log(state.currentPlayer);
        },
        stateMap: {
          'awaitingShot': {
            'shot': 'checkShotResult'
          },
          'checkShotResult': {
            'miss': 'endOfTurn',
            'hit': 'checkSunk'
          },
          'checkSunk': {
            'sunk': 'checkVictory',
            'notSunk': 'endOfTurn'
          },
          'checkVictory': {
            'victory': 'gameOver',
            'noVictory': 'endOfTurn'
          },
          'endOfTurn': {
            'swap': 'swapPlayerBoards'
          },
          'swapPlayerBoards': {
            'ready': 'awaitingShot'
          }
        }
      };
    }
  };
});