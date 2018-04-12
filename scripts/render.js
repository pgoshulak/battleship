// Generate JQuery object containing CSS grid of a board
generateBoard(board) {

}

define((require, exports, module) => {
  module.exports = {
    renderBoards: function (state) {
      // IDs of the users
      let opponentId = state.currentOpponent;
      let playerId = state.currentPlayer;

      let opponentBoard = state.playerBoards[opponentId];
      let playerBoard = state.playerBoards[playerId];

      // Generate JQuery elements with the two boards
      let opponentBoardRendered = $('<div></div>')
        .text(`this is the Opponent board, showing Player ${opponentId}`)
        .append(generateBoard(opponentBoard));
      let playerBoardRendered = $('<div></div>')
        .text(`this is the Player board, showing Player ${playerId}`)
        .append(generateBoard(playerBoard));

      // Write the boards to the page
      $('#board').empty().append(opponentBoardRendered).append(playerBoardRendered);
    }
  };
});