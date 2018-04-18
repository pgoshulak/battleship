// Generate JQuery object containing CSS grid of a board
const generateBoard = (boardData, visibility) => {
  let userId = boardData.userId;
  let allSpaces = boardData.spaces;
  let board = $('<div></div>')
    .addClass('board');

  allSpaces.forEach((row, rowIndex) => {
    row.forEach((square, colIndex) => {
      // console.log(square);
      // Basic square render
      let space = $('<div></div>')
        .addClass('board-square')
        .addClass(`board-square-${visibility}`)
        .data('user-id', userId)
        .data('row', rowIndex)
        .data('col', colIndex)
        .text(`R${rowIndex}C${colIndex}`);

      // Color based on status
      switch (square.status) {
      case 0:
        break;
      case 1:
        space.addClass('board-square-miss');
        break;
      case 2:
        space.addClass('board-square-alive');
        break;
      case 3:
        space.addClass('board-square-hit');
        break;
      case 4:
        space.addClass('board-square-sunk');
        break;
      default:
        break;
      }
      board.append(space);
    });
  });
  return board;
};

// Various tasks to perform when board is re-rendered
function refreshBoardBindings (state) {
  // Get the coordinates of a clicked square
  $('.board-square').click(function () {
    let squareCoords = {
      userId: $(this).data('user-id'),
      row: $(this).data('row'),
      col: $(this).data('col')
    };

    state.registerShot(squareCoords);

    renderBoards(state);
    refreshBoardBindings(state);
  });
}

function renderBoards (state) {
  // IDs of the users
  let opponentId = state.currentOpponent;
  let playerId = state.currentPlayer;

  let opponentBoard = state.playerBoards[opponentId];
  let playerBoard = state.playerBoards[playerId];

  // Generate JQuery elements with the two boards
  let opponentBoardRendered = $('<div></div>')
    .text(`this is the Opponent board, showing Player ${opponentId}`)
    .append(generateBoard(opponentBoard, 'obscured'));
  let playerBoardRendered = $('<div></div>')
    .text(`this is the Player board, showing Player ${playerId}`)
    .append(generateBoard(playerBoard, 'revealed'));

  // Write the boards to the page
  $('#game-area').empty().append(opponentBoardRendered).append(playerBoardRendered);

  // Refresh board bindings
  refreshBoardBindings(state);
}
define((require, exports, module) => {
  module.exports = {
    renderBoards: renderBoards
  };
});