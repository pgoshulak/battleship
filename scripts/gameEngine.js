define((require, exports, module) => {
  module.exports = {
    game: function (state, render) {
      return {
        // Map of states with {transition:nextState} pairs
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
        // Trigger a state transition
        triggerTransition(transitionName) {
          // Retrieve current game state
          gameState = state.gameState;

          // Check if the triggered transition is valid for the current state
          if (this.stateMap[gameState].hasOwnProperty(transitionName)) {
            // Get the next state
            newState = this.stateMap[gameState][transitionName];
            state.setState(newState);
            // If there is a function associated with this state change
            if (this.hasOwnProperty(newState)) {
              this[newState]();
            }
          }
        },
        // State transition for swapping player boards
        swapPlayerBoards: function () {
          state.swapCurrentPlayers();
          render.renderBoards(state);
          this.triggerTransition('ready');
        }
      };
    }
  };
});