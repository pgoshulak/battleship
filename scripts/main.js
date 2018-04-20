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
    $('#game-controller')
      .on('triggerTransition', function(event, type) {
        game.triggerTransition(type);
      });
    // Global listeners
    $(document)
      .keypress(function(e) {
        // Spacebar
        if (e.which === 32) {
          $('#game-controller').trigger('triggerTransition', 'keySpacebar');
        }
      })
      // Right mouse click
      .bind('contextmenu', function(e) {
        e.preventDefault();
        // Store the coordinates (for assigning to ship picked up)
        state.shipPickedUp.mouseX = e.pageX;
        state.shipPickedUp.mouseY = e.pageY;
        $('#game-controller').trigger('triggerTransition', 'clickRight');
      });
    
  });
});
