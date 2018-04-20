// Constants defining the ship inside a square
const SHIP = {
  NONE: 0,
  PATROL: 1,
  SUBMARINE: 2,
  DESTROYER: 3,
  BATTLESHIP: 4,
  CARRIER: 5
};

const SHIP_SIZE = {};
SHIP_SIZE[SHIP.PATROL] = 2;
SHIP_SIZE[SHIP.SUBMARINE] = 3;
SHIP_SIZE[SHIP.DESTROYER] = 3;
SHIP_SIZE[SHIP.BATTLESHIP] = 4;
SHIP_SIZE[SHIP.CARRIER] = 5;

// Constants defining a square's status
const STATUS = {
  EMPTY: 0,
  MISS: 1,
  ALIVE: 2,
  HIT: 3,
  SUNK: 4
};

// Height and width of a board square
const BOARD_SQUARE_SIZE = 24;