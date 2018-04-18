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
          oldState = state.gameState;
          
          // Check if the triggered transition is valid for the current state
          if (this.stateMap[oldState].hasOwnProperty(transitionName)) {
            // Get the next state
            newState = this.stateMap[oldState][transitionName];
            state.setState(newState);
            console.log(`${oldState} -> ${transitionName} -> ${newState}`);
            // If there is a function associated with this state change
            if (this.stateFunctions.hasOwnProperty(newState)) {
              this.stateFunctions[newState]();
            }
          }
        },
        stateFunctions: {
          // Generic function to trigger a state transition on the global game controller
          triggerTransition(transitionName) {
            $('#game-controller').trigger('triggerTransition', transitionName);
          },
          // Swap players
          swapPlayerBoards() {
            state.swapCurrentPlayers();
            render.renderBoards(state);
            this.triggerTransition('ready');
          }
        }
      };
    }
  };
});