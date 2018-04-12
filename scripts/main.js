requirejs(['board', 'store'], function (board, store) {
  var state = store.state();
  board.renderBoards(state.currentOpponent, state.currentPlayer);
  console.log(state);
  $('#swapPlayers').click(function () {
    store.swapCurrentPlayers(state);
    board.renderBoards(state.currentOpponent, state.currentPlayer);
  });
});
