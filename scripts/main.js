requirejs(['render', 'store', 'gameEngine'], function (render, store, gameEngine) {
  let state = store.state();
  let game = gameEngine.game(state);
  render.renderBoards(state);

  // Various tasks to perform when board is re-rendered
  const refreshBoardBindings = () => {
    // Get the coordinates of a clicked square
    $('.board-square').click(function () {
      let squareCoords = {
        userId: $(this).data('user-id'),
        row: $(this).data('row'),
        col: $(this).data('col')
      };

      state.registerShot(squareCoords);

      render.renderBoards(state);
      refreshBoardBindings();
    });
  };

  $(document).ready(() => {
    // Swap the user boards top <-> bottom
    $('#swapPlayers').click(function () {
      state.swapCurrentPlayers();
      render.renderBoards(state);
      refreshBoardBindings();
    });
    refreshBoardBindings();
    
  });
});
