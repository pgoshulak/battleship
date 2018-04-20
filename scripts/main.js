requirejs(['render', 'store', 'gameEngine'], function (render, store, gameEngine) {
  $(document).ready(() => {
    // Initialize data state and game engine
    let state = store.state();
    let game = gameEngine.game(state, render);

    // First render call
    render.renderBoards(state);

    // Button to manually swap the user boards top <-> bottom
    $('#swapPlayers').click(function() {
      $('#game-controller').trigger('triggerTransition', 'swap');
    });
    // Event listener for triggering state transitions
    $('#game-controller').on('triggerTransition', function(event, type) {
      game.triggerTransition(type);
    });
    render.renderShipToCursor(5, 'v');
  });
});
