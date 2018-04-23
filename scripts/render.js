// Generate JQuery object containing CSS grid of a board
const generateBoard = (boardData, visibility) => {
  let userId = boardData.userId;
  let allSpaces = boardData.spaces;
  let board = $('<div></div>')
    .addClass('board');

  allSpaces.forEach((row, rowIndex) => {
    row.forEach((square, colIndex) => {
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
      case STATUS.EMPTY:
        space.addClass('board-square-empty');
        break;
      case STATUS.MISS:
        space.addClass('board-square-miss');
        break;
      case STATUS.ALIVE:
        space.addClass('board-square-alive');
        break;
      case STATUS.HIT:
        space.addClass('board-square-hit');
        break;
      case STATUS.SUNK:
        space.addClass('board-square-sunk');
        break;
      case STATUS.REMOVED:
        space.addClass('board-square-ship-removed');
        break;
      default:
        break;
      }
      board.append(space);
    });
  });
  return board;
};

// Render a floating ship to the cursor position, during ship placement
function renderShipToCursor (shipData) {
  let shipLength = SHIP_SIZE[shipData.shipType];

  $('#ship-following-cursor').remove();
  let shipContainer = $('<div id="ship-following-cursor"></div>')
    .css({
      left: shipData.mouseX - BOARD_SQUARE_SIZE / 2,
      top: shipData.mouseY - BOARD_SQUARE_SIZE / 2
    });
  const shipSquare = () => {
    return $('<div></div>')
      .addClass('board-square')
      .addClass('board-square-follow-cursor');
  };
  
  // Create the CSS-grid sized to the ship length
  // Horizontal ships:
  if (shipData.direction === 'h') {
    shipContainer.css({
      gridTemplateColumns: `repeat(${shipLength}, 1fr)`,
      gridTemplateRows: `1fr`
    });
  } else {
    // Vertical ships:
    shipContainer.css({
      gridTemplateRows: `repeat(${shipLength}, 1fr)`,
      gridTemplateColumns: `1fr`
    });
  }

  // Add squares to show the length of the ship
  for (let i = 0; i < shipLength; i++) {
    shipContainer.append(shipSquare());
  }

  // Follow the mouse cursor
  $(document).on('mousemove', function(e){
    shipContainer.css({
      left: e.pageX - BOARD_SQUARE_SIZE / 2,
      top: e.pageY - BOARD_SQUARE_SIZE / 2
    });
  });
  $('#game-controller').append(shipContainer);
}

// Helper function to call a state transition on global game controller
function requestTransition(transitionName) {
  $('#game-controller').trigger('triggerTransition', transitionName);
}

// Render the boards
function renderBoards (state, renderMode = 'normal') {
  // IDs of the users
  let opponentId = state.currentOpponent;
  let playerId = state.currentPlayer;

  let opponentBoard = state.playerBoards[opponentId];
  let playerBoard = state.playerBoards[playerId];

  // Determine how the boards will render
  // - Normal = full visibility, all shots and ships
  // - Obscured = partial visibility, only shots
  // - Screened = nothing visible
  let opponentRenderMode = 'obscured';
  let playerRenderMode = 'revealed';

  if (renderMode === 'screened') {
    opponentRenderMode = 'screened';
    playerRenderMode = 'screened';
  }

  if (renderMode === 'allVisible') {
    opponentRenderMode = 'revealed';
  }

  // Generate JQuery elements with the two boards
  let opponentBoardRendered = $('<div></div>')
    .text(`this is the Opponent board, showing Player ${opponentId}`)
    .append(generateBoard(opponentBoard, opponentRenderMode));
  let playerBoardRendered = $('<div></div>')
    .text(`this is the Player board, showing Player ${playerId}`)
    .append(generateBoard(playerBoard, playerRenderMode));

  // Write the boards to the page
  $('#game-area').empty().append(opponentBoardRendered).append(playerBoardRendered);

  // Refresh board bindings
  $('.board').on('click', '.board-square', function (e) {
    let squareCoords = {
      userId: $(this).data('user-id'),
      row: $(this).data('row'),
      col: $(this).data('col')
    };
    // Store mouseclick coords for rendering a picked-up ship
    state.shipPickedUp.mouseX = e.pageX;
    state.shipPickedUp.mouseY = e.pageY;

    state.registerBoardClick(squareCoords);
    requestTransition('click');
    // renderBoards(state);
  });
}
define((require, exports, module) => {
  module.exports = {
    renderBoards: renderBoards,
    renderShipToCursor: renderShipToCursor
  };
});