// Generate JQuery object containing CSS grid of a board
const generateBoard = (boardData, visibility) => {
  let userId = boardData.userId;
  let allSpaces = boardData.spaces;
  let board = $('<div></div>')
    .addClass('board');

  // Add blank top-left corner space
  board.append($('<div></div>'));
  // Add numbers along top
  allSpaces[0].forEach((col, colIndex) => {
    board.append($(`<div class="board-label">${colIndex + 1}</div>`));
  });
  // Add blank top-right corner space
  board.append($('<div></div>'));
  
  allSpaces.forEach((row, rowIndex) => {
    // Add letter along left side
    board.append($(`<div class="board-label">${ROW_LETTER[rowIndex]}</div>`));
    // Add each square in the row
    row.forEach((square, colIndex) => {
      let text = $('<span></span>')
        .text(`${ROW_LETTER[rowIndex]}${colIndex + 1}`);
      // Basic square render
      let space = $('<div></div>')
        .addClass('board-square')
        .addClass(`board-square-${visibility}`)
        .data('user-id', userId)
        .data('row', rowIndex)
        .data('col', colIndex)
        .append(text);

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
    // Add the letter on the right side;
    board.append($(`<div class="board-label">${ROW_LETTER[rowIndex]}</div>`));
  });

  // Add blank bottom-left corner space
  board.append($('<div></div>'));
  
  // Add numbers along bottom
  allSpaces[0].forEach((col, colIndex) => {
    board.append($(`<div class="board-label">${colIndex + 1}</div>`));
  });

  // Add blank bottom-right corner space
  board.append($('<div></div>'));
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

  if (renderMode === 'opponentScreened') {
    opponentRenderMode = 'screened';
  }

  // Generate JQuery elements with the two boards
  let opponentBoardRendered = generateBoard(opponentBoard, opponentRenderMode);
  let playerBoardRendered = generateBoard(playerBoard, playerRenderMode);

  // Write the boards to the page
  $('#opponent-board').empty().append(opponentBoardRendered);
  $('#player-board').empty().append(playerBoardRendered);

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

// Set the text/style on the main/ready UI button
function setReadyButton(text, type) {
  let button = $('#ready-button');
  button.text(text);
  if (type === 'disabled') {
    button.prop('disabled', true);
  } else {
    button.prop('disabled', false);
  }
  button.removeClass().addClass(type);
}
// Set the text/style on the screen message area
function setMessageArea(text, type) {
  let message = $('#message-area > div');
  message.text(text);
}

// Insert a shot in the on-screen shot log
function renderLoggedShot(shot, outcome = '', sunk = 0) {
  let victory = false;
  let printedOutcome = outcome;

  // Victory conditions should log 'hit' first, THEN 'victory'
  if (outcome === 'victory') {
    victory = true;
    printedOutcome = 'hit';
  }
  
  // Log the shot's outcome
  $('<li class="shot-log-entry"></li>')
    .text(`Player ${shot.shooterId} shot ${ROW_LETTER[shot.row]}${shot.col + 1}
      : ${printedOutcome}!`)
    .prependTo($('#shot-log'));
  
  // If there is a ship sunk, log it as well
  if (sunk > 0) {
    $('<li class="shot-log-entry shot-log-sunk"></li>')
      .text(`Player ${shot.shooterId} sunk Player ${shot.userId}'s ${SHIP_NAME[sunk]}!`)
      .prependTo($('#shot-log'));
  }

  // Log a victory message
  if (victory) {
    $('<li class="shot-log-entry shot-log-victory"></li>')
      .text(`Victory for Player ${shot.shooterId}!`)
      .prependTo($('#shot-log'));
  }
}

define((require, exports, module) => {
  module.exports = {
    renderBoards: renderBoards,
    renderShipToCursor: renderShipToCursor,
    setReadyButton: setReadyButton,
    setMessageArea: setMessageArea,
    renderLoggedShot: renderLoggedShot
  };
});