requirejs(['render', 'store', 'gameEngine'], function (render, store, gameEngine) {
  let state = store.state();
  let game = gameEngine.game(state, render);
  render.renderBoards(state);



  $(document).ready(() => {
    // Swap the user boards top <-> bottom
    /* $('#swapPlayers').click(function () {
      state.swapCurrentPlayers();
      render.renderBoards(state);
      refreshBoardBindings();
    }); */
    $('#swapPlayers').click(function() {
      $('#game-controller').trigger('triggerTransition', 'swap');
    });
    // refreshBoardBindings();
    $('#game-controller').on('triggerTransition', function(event, type) {
      game.triggerTransition(type);
    });
    render.renderShipToCursor(2, 0);
  });
});
