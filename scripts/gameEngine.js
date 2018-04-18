define((require, exports, module) => {
  module.exports = {
    game: function(state) {
      return {
        stateMap: {
          'awaitingShot': {
            'shot': 'checkShotResult',
            'swap': 'swapPlayerBoards'
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
        },
        triggerTransition(transitionName) {
          // console.log('Transition!', data);
          gameState = state.gameState;
          if (this.stateMap[gameState].hasOwnProperty(transitionName)) {
            newState = this.stateMap[gameState][transitionName];
            state.setState(newState);
            console.log('successful transition to ', newState);
            console.log(state);
          }
        }
      };
    }
  };
});