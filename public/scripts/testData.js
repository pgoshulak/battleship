const randomBoardNoShots = `[
    [{"ship":1,"status":2},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":3,"status":2},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0}],
    [{"ship":1,"status":2},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":3,"status":2},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0}],
    [{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":3,"status":2},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0}],
    [{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0}],
    [{"ship":4,"status":2},{"ship":4,"status":2},{"ship":4,"status":2},{"ship":4,"status":2},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":2,"status":2},{"ship":0,"status":0}],
    [{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":2,"status":2},{"ship":0,"status":0}],
    [{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":2,"status":2},{"ship":0,"status":0}],
    [{"ship":0,"status":0},{"ship":0,"status":0},{"ship":5,"status":2},{"ship":5,"status":2},{"ship":5,"status":2},{"ship":5,"status":2},{"ship":5,"status":2},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0}],
    [{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0}],
    [{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0}]
  ]`;
const randomBoardWithShots = `[
    [{"ship":5,"status":2},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0}],
    [{"ship":5,"status":2},{"ship":0,"status":0},{"ship":3,"status":4},{"ship":3,"status":4},{"ship":3,"status":4},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":2,"status":2},{"ship":0,"status":0}],
    [{"ship":5,"status":2},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":1},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":1},{"ship":2,"status":3},{"ship":0,"status":1}],
    [{"ship":5,"status":2},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":2,"status":2},{"ship":0,"status":0}],
    [{"ship":5,"status":2},{"ship":0,"status":0},{"ship":0,"status":1},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0}],
    [{"ship":0,"status":1},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":1},{"ship":0,"status":0},{"ship":0,"status":1}],
    [{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":1,"status":4}],
    [{"ship":0,"status":0},{"ship":0,"status":1},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":1,"status":4}],
    [{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":1},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0}],
    [{"ship":4,"status":2},{"ship":4,"status":3},{"ship":4,"status":2},{"ship":4,"status":3},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":1},{"ship":0,"status":0}]
  ]`;
const randomBoardAlmostDead = `[
    [{"ship":5,"status":4},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0}],
    [{"ship":5,"status":4},{"ship":0,"status":0},{"ship":3,"status":4},{"ship":3,"status":4},{"ship":3,"status":4},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":2,"status":4},{"ship":0,"status":0}],
    [{"ship":5,"status":4},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":1},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":1},{"ship":2,"status":4},{"ship":0,"status":1}],
    [{"ship":5,"status":4},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":2,"status":4},{"ship":0,"status":0}],
    [{"ship":5,"status":4},{"ship":0,"status":0},{"ship":0,"status":1},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0}],
    [{"ship":0,"status":1},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":1},{"ship":0,"status":0},{"ship":0,"status":1}],
    [{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":1,"status":4}],
    [{"ship":0,"status":0},{"ship":0,"status":1},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":1,"status":4}],
    [{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":1},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0}],
    [{"ship":4,"status":2},{"ship":4,"status":3},{"ship":4,"status":3},{"ship":4,"status":3},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":0},{"ship":0,"status":1},{"ship":0,"status":0}]
  ]`;