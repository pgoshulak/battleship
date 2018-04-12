define((require, exports, module) => {
  module.exports = {
    renderBoards: function (currentOpponent, currentPlayer) {
      // var currentOpponent = state.currentOpponent;
      // var currentPlayer = state.currentPlayer;

      var opponentBoard = $('<div></div>').text(`this is the Opponent board, showing Player ${currentOpponent}`);
      var playerBoard = $('<div></div>').text(`this is the Player board, showing Player ${currentPlayer}`);
      $('#board').empty().append(opponentBoard).append(playerBoard);
    }
  };
});