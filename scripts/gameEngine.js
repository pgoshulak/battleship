define((require, exports, module) => {
  module.exports = {
    game: function(state, render) {
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
          console.log('Transition!', transitionName);
          gameState = state.gameState;
          if (this.stateMap[gameState].hasOwnProperty(transitionName)) {
            newState = this.stateMap[gameState][transitionName];

            // If there is a function associated with this state change
            if (this.onStateSet.hasOwnProperty(newState)) {
              this.onStateSet[newState]();
            }
            state.setState(newState);
            console.log('successful transition to ', newState);
            console.log(state);
          }
        },
        onStateSet: {
          swapPlayerBoards: function() {
            state.swapCurrentPlayers();
            render.renderBoards(state);
            console.log('boards swapped!');
            console.log(state);
            this.triggerTransition('ready');
          }
        }
      };
    }
  };
});