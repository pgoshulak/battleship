requirejs(['render', 'store'], function (render, store) {
  let state = store.state();
  render.renderBoards(state);
  console.log(state);

  // Various tasks to perform when board is re-rendered
  const refreshBoardBindings = () => {
    // Get the coordinates of a clicked square
    $('.board-square').click(function () {
      console.log('click detected');
      let squareCoords = {
        userId: $(this).data('user-id'),
        row: $(this).data('row'),
        col: $(this).data('col')
      };
      
      store.getSquareInfo(state, squareCoords);
  
      // Test: immediately sets new square info
      store.setSquareInfo(state, squareCoords, {
        ship: 1,
        status: 1
      });
    });
  };

  $(document).ready(() => {
    // Swap the user boards top <-> bottom
    $('#swapPlayers').click(function () {
      store.swapCurrentPlayers(state);
      render.renderBoards(state);
      refreshBoardBindings();
    });
    refreshBoardBindings();
    
  });
});
