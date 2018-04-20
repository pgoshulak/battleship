define((require, exports, module) => {
  module.exports = {
    game: function (state, render) {
      return {
        // Map of states with {transition:nextState} pairs
        stateMap: {
          // Ship placement
          'awaitingShipPickup': {
            'click': 'checkIsOwnShip',
            'playerReady': 'checkBothPlayersReady'
          },
          'checkIsOwnShip': {
            'yes': 'shipPickedUp',
            'no': 'awaitingShipPickup'
          },
          'shipPickedUp': {
            'clickRight': 'rotateShip',
            'click': 'isValidPlacement'
          },
          'rotateShip': {
            'next': 'shipPickedUp'
          },
          'isValidPlacement': {
            'yes': 'placeShip',
            'no': 'shipPickedUp'
          },
          'placeShip': {
            'next': 'awaitingShipPickup'
          },
          // Check before start of game
          'checkBothPlayersReady': {
            'yes': 'startGame',
            'no': 'swapSetupBoards'
          },
          'startGame': {
            // Should randomly pick a player to start
            'next': 'awaitingShot'
          },
          'swapSetupBoards': {
            'next': 'awaitingShipPickup'
          },
          // Gameplay states
          'awaitingShot': {
            'click': 'checkShotResult',
            'swap': 'swapPlayerBoards'
          },
          'checkShotResult': {
            'reset': 'awaitingShot',
            'miss': 'endOfTurn',
            'hit': 'checkSunk'
          },
          'checkSunk': {
            'victory': 'gameOver',
            'sunk': 'endOfTurn',
            'notSunk': 'endOfTurn'
          },
          'endOfTurn': {
            'swap': 'swapPlayerBoards'
          },
          'swapPlayerBoards': {
            'ready': 'awaitingShot'
          }
        },
        debugStateTransitions: true,
        // Trigger a state transition
        triggerTransition(transitionName) {
          // Retrieve current game state
          oldState = state.gameState;

          // Check if the triggered transition is valid for the current state
          if (this.stateMap[oldState] && this.stateMap[oldState].hasOwnProperty(transitionName)) {
            // Get the next state
            newState = this.stateMap[oldState][transitionName];
            state.setState(newState);

            // Log state transition if debugging
            if (this.debugStateTransitions) {
              console.info(`${oldState} -> ${transitionName} -> ${newState}`);
            }
            // If there is a function associated with this state change
            if (this.stateFunctions.hasOwnProperty(newState)) {
              this.stateFunctions[newState]();
            }
          }
        },
        stateFunctions: {
          // Generic function to trigger a state transition on the global game controller
          requestTransition(transitionName) {
            $('#game-controller').trigger('triggerTransition', transitionName);
          },
          // ========== Ship Placement ==========
          // Wait for player to pick up ship during ship-placement stage
          awaitingShipPickup() {
            //
          },
          // Check if the picked up ship is owned by player
          checkIsOwnShip() {
            let squareInfo = state.getSquareInfo(state.lastSquareClicked);

            // Check that the square belongs to user and contains a ship
            if (state.lastSquareClicked.userId === state.currentPlayer
            && squareInfo.ship > 0) {
              // Register the ship that has been picked up
              state.shipPickedUp = {
                shipType: squareInfo.ship,
                direction: 'v'
              };
              this.requestTransition('yes');
              return;
            } else {
              this.requestTransition('no');
              return;
            }
          },
          // Render the picked up ship
          shipPickedUp() {
            render.renderShipToCursor(state.shipPickedUp);
          },
          // Rotate the ship when spacebar pressed
          rotateShip() {
            if (state.shipPickedUp.direction === 'h') {
              state.shipPickedUp.direction = 'v';
            } else {
              state.shipPickedUp.direction = 'h';
            }
            render.renderShipToCursor(state.shipPickedUp);
            this.requestTransition('next');
          },

          // ========== Gameplay ==========
          // Swap players
          swapPlayerBoards() {
            state.swapCurrentPlayers();
            render.renderBoards(state);
            this.requestTransition('ready');
          },
          // Check if the shot was a hit or miss
          checkShotResult() {
            let lastSquareClicked = state.lastSquareClicked;
            // If player clicked own board, reset state
            if (state.currentPlayer === lastSquareClicked.userId) {
              this.requestTransition('reset');
              return;
            }
            // Check status of clicked square
            let clickedSquareInfo = state.getSquareInfo(lastSquareClicked);
            // If shot is a miss
            if (clickedSquareInfo.status === STATUS.EMPTY) {
              state.setSquareStatus(lastSquareClicked, STATUS.MISS);
              this.requestTransition('miss');
              return;
            }
            // If shot is a hit
            if (clickedSquareInfo.status === STATUS.ALIVE) {
              state.setSquareStatus(lastSquareClicked, STATUS.HIT);
              this.requestTransition('hit');
              return;
            }
            // If square has already been clicked
            if (clickedSquareInfo.status === STATUS.MISS
              || clickedSquareInfo.status === STATUS.HIT
              || clickedSquareInfo.status === STATUS.SUNK) {
              this.requestTransition('reset');
              return;
            }
          },
          // End of turn
          endOfTurn() {
            this.requestTransition('swap');
          },
          // Check if ship is sunk
          checkSunk() {
            let shipType = state.getSquareInfo(state.lastSquareClicked).ship;
            let squaresAlive = state.playerBoards[state.currentOpponent].shipSquaresAlive;

            // If all ships are sunk
            if (squaresAlive.total === 0) {
              console.log(`Victory for Player ${state.currentPlayer}!`);
              this.requestTransition('victory');
              return;
            }

            // If the ship has no squares alive
            if (squaresAlive[shipType] === 0) {
              state.sinkShip(state.currentOpponent, shipType);
              this.requestTransition('sunk');
            } else {
              // The ship still has some squares alive
              this.requestTransition('notSunk');
            }
          }
        }
      };
    }
  };
});