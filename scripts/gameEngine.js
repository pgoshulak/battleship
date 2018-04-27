define((require, exports, module) => {
  module.exports = {
    game: function (state, render) {
      return {
        // Map of states with {transition:nextState} pairs
        stateMap: {
          /* Game entry */
          'gameEntry': {
            /* 'next': 'awaitingShipPickup' */
            'next': 'getGameType'
          },
          'getGameType': {
            'key1': 'gameSetupAi',
            'key2': 'gameSetupLocal'
          },
          'gameSetupAi': {
            'next': 'awaitingShipPickup'
          },
          'gameSetupLocal': {
            'next': 'awaitingShipPickup'
          },
          /* Ship placement */
          'awaitingShipPickup': {
            'click': 'checkIsOwnShip',
            'playerReadyButton': 'setPlayerReady',
            'keySpacebar': 'setPlayerReady'
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
          'setPlayerReady': {
            'next': 'checkBothPlayersReady'
          },
          /* Check before start of game */
          'checkBothPlayersReady': {
            'yes': 'randomizeStartPlayer',
            'no': 'screeningSetupBoards'
          },
          'randomizeStartPlayer': {
            'ai': 'renderAiStart',
            'local': 'renderLocalStart'
          },
          'renderAiStart': {
            'next': 'startGame'
          },
          'renderLocalStart': {
            'playerReadyButton': 'startGame',
            'keySpacebar': 'startGame'
          },
          'startGame': {
            'next': 'awaitingShot'
          },
          'screeningSetupBoards': {
            'playerReadyButton': 'removeSetupBoardScreens',
            'keySpacebar': 'removeSetupBoardScreens'
          },
          'removeSetupBoardScreens': {
            'next': 'awaitingShipPickup'
          },
          /* Gameplay states */
          'awaitingShot': {
            'click': 'checkShotResult',
            'aiClick': 'checkShotResult'
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
            'ai': 'swapToAi',
            'local': 'awaitingPlayerDone'
          },
          'swapToAi': {
            'next': 'awaitingShot'
          },
          'awaitingPlayerDone': {
            'playerReadyButton': 'screeningGameplayBoards',
            'keySpacebar': 'screeningGameplayBoards'
          },
          'screeningGameplayBoards': {
            'playerReadyButton': 'removeGameplayBoardScreens',
            'keySpacebar': 'removeGameplayBoardScreens'
          },
          'removeGameplayBoardScreens': {
            'next': 'awaitingShot'
          }
        },
        /* State map end */
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
          // Helper function to log a shot in state and render it to screen
          logShot(shot, outcome = '', sunk = 0) {
            if (shot.userId === 0) {
              shot.shooterId = 1;
            } else {
              shot.shooterId = 0;
            }
            state.logLastShot(shot, outcome, sunk);
            render.renderLoggedShot(shot, outcome, sunk);
          },
          // ========== Game Entry ==========
          gameEntry() {
            this.requestTransition('next');
          },
          getGameType() {
            render.setMessageArea('Press [1] - Player vs AI Press [2] - 2P Hotseat');
          },
          gameSetupAi() {
            state.gameType = 'ai';
            state.aiGameInit();
            this.requestTransition('next');
          },
          gameSetupLocal() {
            state.gameType = 'local';
            this.requestTransition('next');
          },
          // ========== Ship Placement ==========
          // Wait for player to pick up a ship
          awaitingShipPickup() {
            render.setMessageArea('Click on a ship to move it');
            render.setReadyButton('Finished placing ships', 'stop');
            render.renderBoards(state, 'opponentScreened');
          },
          // Check if the picked up ship is owned by player
          checkIsOwnShip() {
            let squareInfo = state.getSquareInfo(state.lastSquareClicked);

            // Check that the square belongs to user and contains a ship
            if (state.lastSquareClicked.userId === state.currentPlayer
            && squareInfo.ship > 0) {
              state.setShipPickedUp(state.lastSquareClicked);
              this.requestTransition('yes');
              return;
            } else {
              this.requestTransition('no');
              return;
            }
          },
          // Render the picked up ship
          shipPickedUp() {
            state.removeShip(state.lastSquareClicked.userId, state.shipPickedUp.shipType);
            render.renderBoards(state, 'opponentScreened');
            render.renderShipToCursor(state.shipPickedUp);
            render.setMessageArea('Right-click to rotate');
            render.setReadyButton('Awaiting ship placement', 'disabled');
          },
          // Rotate the ship when spacebar pressed
          rotateShip() {
            if (state.shipPickedUp.direction === 'h') {
              state.shipPickedUp.direction = 'v';
            } else {
              state.shipPickedUp.direction = 'h';
            }
            // render.renderShipToCursor(state.shipPickedUp);
            this.requestTransition('next');
          },
          // Check the ship is placed in a valid location
          isValidPlacement() {
            // Check if the squares exist and are available
            if (state.checkValidPlacement(state.lastSquareClicked,
              state.shipPickedUp.shipType,
              state.shipPickedUp.direction)) {
              this.requestTransition('yes');
            } else {
              this.requestTransition('no');
            }
          },
          // Place the ship on the specified coordinates
          placeShip() {
            // Remove the cursor-following ship outline
            $('#ship-following-cursor').remove();
            // Reset the 'removed' ghost outline
            state.clearRemovedShip(state.lastSquareClicked.userId, state.shipPickedUp.shipType);
            // Place the ship on the clicked coordinates
            state.placeShip(state.lastSquareClicked,
              state.shipPickedUp.shipType,
              state.shipPickedUp.direction);
            this.requestTransition('next');
          },
          // Indicate that the current player is ready to start playing
          setPlayerReady() {
            state.playerBoards[state.currentPlayer].playerReady = true;
            this.requestTransition('next');
          },
          // ========== Check before start of game ==========
          checkBothPlayersReady() {
            if (state.playerBoards[0].playerReady && state.playerBoards[1].playerReady) {
              this.requestTransition('yes');
            } else {
              this.requestTransition('no');
            }
          },
          // Screen boards and randomize starting player
          randomizeStartPlayer() {
            // Randomize which player will start
            if (Math.round(Math.random())) {
              state.swapCurrentPlayers();
            }
            render.setMessageArea('Randomizing starting player...');
            
            if (state.gameType === 'ai') {
              this.requestTransition('ai');
            } else {
              this.requestTransition('local');
            }
          },
          // Render a local (2P) game with screened boards (waiting for 'ready' button)
          renderLocalStart() {
            render.renderBoards(state, 'screened');
            render.setReadyButton(`Player ${state.currentPlayer} is first!`, 'go');
            // Await 'ready' button to indicate the correct player is seated...
          },
          // Render an AI (1P) game with normal boards
          renderAiStart() {
            render.renderBoards(state);
            render.setReadyButton(`Player ${state.currentPlayer} is first!`, 'go');
            this.requestTransition('next');
          },
          // Start the game
          startGame() {
            render.renderBoards(state);
            this.requestTransition('next');
          },
          // Show screened boards while players swap seats to obscure boards
          screeningSetupBoards() {
            state.swapCurrentPlayers();
            render.renderBoards(state, 'screened');
            render.setMessageArea('Please switch seats');
            render.setReadyButton(`Player ${state.currentPlayer} ready!`, 'go');
          },
          // Unscreen boards for next player
          removeSetupBoardScreens() {
            render.renderBoards(state);
            this.requestTransition('next');
          },
          // ========== Gameplay ==========
          awaitingShot() {
            render.setMessageArea(`Player ${state.currentPlayer}, take your shot!`);
            render.setReadyButton('Awaiting shot', 'disabled');

            if (state.gameType === 'ai' && state.currentPlayer === 1) {
              setTimeout(() => {

                state.aiClick();
                this.requestTransition('aiClick');
              }, AI_SHOT_DELAY);
              
            }
          },
          // Swap players
          swapPlayerBoards() {
            state.swapCurrentPlayers();
            render.renderBoards(state);
            this.requestTransition('next');
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
              this.logShot(lastSquareClicked, 'miss');
              render.setMessageArea('Miss!');
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
          // Check if ship is sunk
          checkSunk() {
            let shipType = state.getSquareInfo(state.lastSquareClicked).ship;
            let squaresAlive = state.playerBoards[state.currentOpponent].shipSquaresAlive;

            // If all ships are sunk
            if (squaresAlive.total === 0) {
              state.sinkShip(state.currentOpponent, shipType);
              this.logShot(state.lastSquareClicked, 'victory', shipType);
              this.requestTransition('victory');
              return;
            }

            // If the ship has no squares alive
            if (squaresAlive[shipType] === 0) {
              state.sinkShip(state.currentOpponent, shipType);
              render.setMessageArea(`Sunk the ${SHIP_NAME[shipType]}!`);
              this.logShot(state.lastSquareClicked, 'hit', shipType);
              this.requestTransition('sunk');
            } else {
              // The ship still has some squares alive
              render.setMessageArea('Hit!');
              this.logShot(state.lastSquareClicked, 'hit');
              this.requestTransition('notSunk');
            }
          },
          // End of turn
          endOfTurn() {
            // Render the resulting shot (after calculating hit/miss/sunk)
            render.renderBoards(state);
            // Render the explosion
            let explosionType = state.getSquareInfo(state.lastSquareClicked).status;
            render.renderExplodeLastSquare(explosionType);

            if (state.gameType === 'local') {
              this.requestTransition('local');
            } else {
              this.requestTransition('ai');
            }
          },
          // Switch to AI's turn
          swapToAi() {
            state.swapCurrentPlayers();
            setTimeout(() => {
              this.requestTransition('next');
            }, AI_SHOT_DELAY);
          },
          // Wait for player to indicate they are done (after firing their shot)
          awaitingPlayerDone() {
            render.setReadyButton('Finished', 'stop');
          },
          // Show screened boards while players swap seats to obscure boards
          screeningGameplayBoards() {
            state.swapCurrentPlayers();
            render.renderBoards(state, 'screened');
            render.setMessageArea(`Please switch seats`);
            render.setReadyButton(`Player ${state.currentPlayer} ready!`, 'go');
          },
          // Unscreen boards for next player
          removeGameplayBoardScreens() {
            render.renderBoards(state);
            this.requestTransition('next');
          },
          // End of game - reveal both boards
          gameOver() {
            render.renderBoards(state, 'allVisible');
            let explosionType = state.getSquareInfo(state.lastSquareClicked).status;
            render.renderExplodeLastSquare(explosionType);
            
            render.setMessageArea(`Victory for Player ${state.currentPlayer}`);
            render.setReadyButton('Game over', 'disabled');
          }
        }
      };
    }
  };
});