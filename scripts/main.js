requirejs(['render', 'store'], function (render, store) {
  let state = store.state();
  render.renderBoards(state);
  console.log(state);

  $(document).ready(() => {
    // Swap the user boards top <-> bottom
    $('#swapPlayers').click(function () {
      store.swapCurrentPlayers(state);
      render.renderBoards(state);
    });
    
    // Get the coordinates of a clicked square
    $('.board-square').click(function () {
      let row = $(this).data('row');
      let col = $(this).data('col');
      console.log(`Board square R${row}C${col} clicked!`);
    });
  });
});
