requirejs(['board', 'store'], function (board, store) {
  var state = store.state();
  board.renderBoards(state);
  console.log(state);

  $('#swapPlayers').click(function () {
    store.swapCurrentPlayers(state);
    board.renderBoards(state);
  });

});
