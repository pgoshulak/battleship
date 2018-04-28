// Generate JQuery object containing CSS grid of a board
const generateBoard = (boardData, visibility, lastSquareClicked) => {
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
      
      // Determine if this was the last square clicked
      if (userId === lastSquareClicked.userId
      && rowIndex === lastSquareClicked.row
      && colIndex === lastSquareClicked.col) {
        space.addClass('board-square-last-clicked');
      }

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

// Generate ship list
const generateShipList = (shipSquaresAlive, visibility) => {
  let $shipList = $('<ul>').addClass('ship-list');
  for (let i = 1; i <= 5; i++) {
    // Create the ship name string
    let text = `${SHIP_NAME[i]}`;

    // Show full ship stats (eg. for own player)
    if (visibility === 'revealed') {
      text += ` ( ${shipSquaresAlive[i]} / ${SHIP_SIZE[i]} )`;
    }
    
    // Append element
    let entry = $('<li>')
      .addClass('ship-list-entry')
      .text(text)
      .appendTo($shipList);

    // If the ship is sunk
    if (shipSquaresAlive[i] === 0) {
      entry.addClass('ship-list-sunk');
    }
  }
  return $shipList;
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

// Render the boards and ship lists
function renderBoards (state, renderMode = 'normal') {
  
  let topId;
  let bottomId;

  if (state.gameType === 'local') {
    // Assign current player -> bottom board, current opponent -> top board
    topId = state.currentOpponent;
    bottomId = state.currentPlayer;
  } else if (state.gameType === 'ai') {
    // Force bottom board to always display the player (Player 0)
    topId = 1;
    bottomId = 0;
  } else {
    throw 'Unknown game type';
  }

  let topBoard = state.playerBoards[topId];
  let bottomBoard = state.playerBoards[bottomId];

  // Determine how the boards will render
  // - Normal = full visibility, all shots and ships
  // - Obscured = partial visibility, only shots
  // - Screened = nothing visible
  let topRenderMode = 'obscured';
  let bottomRenderMode = 'revealed';

  if (renderMode === 'screened') {
    topRenderMode = 'screened';
    bottomRenderMode = 'screened';
  }

  if (renderMode === 'allVisible') {
    topRenderMode = 'revealed';
  }

  if (renderMode === 'opponentScreened') {
    topRenderMode = 'screened';
  }

  // Generate JQuery elements with the two boards
  let topBoardRendered = generateBoard(topBoard, topRenderMode, state.lastSquareClicked);
  let bottomBoardRendered = generateBoard(bottomBoard, bottomRenderMode, state.lastSquareClicked);

  let topShipList = generateShipList(topBoard.shipSquaresAlive, topRenderMode);
  let bottomShipList = generateShipList(bottomBoard.shipSquaresAlive, bottomRenderMode);

  // Write the boards to the page
  $('#opponent-board').empty().append(topBoardRendered);
  $('#player-board').empty().append(bottomBoardRendered);
  $('#opponent-ships').empty().append(topShipList);
  $('#player-ships').empty().append(bottomShipList);

  // Click handler for board squares
  function clickHandler(e, thisSquare) {
    let squareCoords = {
      userId: $(thisSquare).data('user-id'),
      row: $(thisSquare).data('row'),
      col: $(thisSquare).data('col')
    };
    state.registerBoardClick(squareCoords);
    // Store mouseclick coords for rendering a picked-up ship
    state.shipPickedUp.mouseX = e.pageX;
    state.shipPickedUp.mouseY = e.pageY;

  }
  
  // Refresh board bindings
  $('.board').on('click', '.board-square', function (e) {
    clickHandler(e, this);
    requestTransition('click');
  });
  $('.board').on('mousedown', '.board-square', function (e) {
    // Check that this is a left-click
    if (e.which === 1) {
      clickHandler(e, this);
      requestTransition('mousedown');
    }
  });
  $('.board').on('mouseup', '.board-square', function (e) {
    // Check that this is a left-click
    if (e.which === 1) {
      clickHandler(e, this);
      requestTransition('mouseup');
    }
  });
}

// Add explosion element to last square clicked
function renderExplodeLastSquare (typeId) {
  let type = '';
  if (typeId === STATUS.MISS) {
    type = 'miss';
  } else if (typeId === STATUS.HIT) {
    type = 'hit';
  } else if (typeId === STATUS.SUNK) {
    type = 'sunk';
  }
  $('<div>')
    .addClass(`board-square-explode-${type}`)
    .appendTo($('.board-square-last-clicked'));
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
    .text(`${this.userNames[shot.shooterId]} shot ${ROW_LETTER[shot.row]}${shot.col + 1}
      : ${printedOutcome}!`)
    .prependTo($('#shot-log'));
  
  // If there is a ship sunk, log it as well
  if (sunk > 0) {
    $('<li class="shot-log-entry shot-log-sunk"></li>')
      .text(`${this.userNames[shot.shooterId]} sunk ${this.userNames[shot.userId]}'s ${SHIP_NAME[sunk]}!`)
      .prependTo($('#shot-log'));
  }

  // Log a victory message
  if (victory) {
    $('<li class="shot-log-entry shot-log-victory"></li>')
      .text(`Victory for ${this.userNames[shot.shooterId]}!`)
      .prependTo($('#shot-log'));
  }
}

define((require, exports, module) => {
  module.exports = {
    userNames: [],
    renderBoards: renderBoards,
    renderShipToCursor: renderShipToCursor,
    renderExplodeLastSquare: renderExplodeLastSquare,
    setReadyButton: setReadyButton,
    setMessageArea: setMessageArea,
    renderLoggedShot: renderLoggedShot
  };
});