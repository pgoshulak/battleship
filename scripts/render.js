define((require, exports, module) => {
  module.exports = {
    renderBoards: function (state) {
      let opponentId = state.currentOpponent;
      let playerId = state.currentPlayer;

      let opponentBoard = state.playerBoards[opponentId];
      let playerBoard = state.playerBoards[playerId];

      let opponentBoardRendered = $('<div></div>')
        .text(`this is the Opponent board, showing Player ${opponentId}`)
        .append(`<div>${opponentBoard.spaces.join(', ')}</div>`);
      let playerBoardRendered = $('<div></div>')
        .text(`this is the Player board, showing Player ${playerId}`)
        .append(`<div>${playerBoard.spaces.join(', ')}</div>`);
      $('#board').empty().append(opponentBoardRendered).append(playerBoardRendered);
    }
  };
});