define((require, exports, module) => {
  module.exports = {
    renderBoards: function (state) {
      var opponentId = state.currentOpponent;
      var playerId = state.currentPlayer;

      var opponentBoard = state.playerBoards[opponentId];
      var playerBoard = state.playerBoards[playerId];

      var opponentBoardRendered = $('<div></div>')
        .text(`this is the Opponent board, showing Player ${opponentId}`)
        .append(`<div>${opponentBoard.spaces.join(', ')}</div>`);
      var playerBoardRendered = $('<div></div>')
        .text(`this is the Player board, showing Player ${playerId}`)
        .append(`<div>${playerBoard.spaces.join(', ')}</div>`);
      $('#board').empty().append(opponentBoardRendered).append(playerBoardRendered);
    }
  };
});