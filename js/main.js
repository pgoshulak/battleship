$(document).ready(function() {
  renderBoards();
  console.log(state);
  $('#swapPlayers').click(function() {
    swapCurrentPlayers();
    renderBoards();
  });
  // state.visibleOpponentBoard.log();
});