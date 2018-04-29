# About
A browser-based battleship implementation. This project was started as a stretch-project for LighthouseLabs.

# Screenshots
![Game setup](/docs/1-setup.png)
![Explosions!](/docs/2-explosion.png)
![Almost done...](/docs/3-gameplay.png)
![Victory!](/docs/4-victory.png)
![Leaderboard](/docs/5-leaderboard.png)

# Getting started
Clone the repository and run `npm install` to install necessary files. To begin the game, navigate to the downloaded directory and run `npm run start`. In your browser, go to `http://localhost:8080` or whichever port is shown.

# Gameplay
## Battleship Rules
- Each player is given a 10 x 10 board on which they secretly place five ships of lengths 2, 3, 3, 4, and 5
- Players can only see their own ships; their opponent is shown as a blank board.
- Players take turns shooting at their opponent's board, attempting to discover the location of their opponent's ships.
- A shot is indicated as a miss (no ship) or a hit (there is a ship).
- When all of a ship's squares are hit, it becomes 'sunk'.
- When all of a player's ships are sunk, that player has lost.

## Game Controls
### Game Setup
- To begin, each player is given a board with ships randomly placed.
- Players can click-and-drag to reposition their ships, or right-click to rotate.
- Players can also enter their name
- When finished, click the 'Finished' button or press `spacebar`

### On your turn
- The top board represents your opponent's board.
- Click a square to take a shot
- A 'miss' is shown as grey, a 'hit' as red.

## Single Player (vs AI)
- The AI will automatically take a shot on its turn

## 2-Player Hotseat
- To begin your turn, press the green 'Ready' button
- Take your shot
- After your turn, press the red 'Finished' button to hide the boards from view
- Switch seats with your opponent - they won't be able to see your board once hidden!
- Your opponent presses the green 'Ready' button and plays their turn.

# Game AI
The game AI is based on a three-state system:
- `random`, where the AI takes random shots in a diagonal pattern to find the smallest remaining ship
- `targeting`, for when the AI has made a hit and starts exploring surroundng squares to determine which way the ship lays
- `striking`, for when the AI has made two adjacent hits and will continue shooting in that direction (or backtracking when necessary)
Once a ship has been sunk, the AI reverts to `random`.

The AI does not 'cheat' by checking if a shot would be a 'hit' before making it. It always uses the same information given to the player (despite interfacing with the game engine's internal state).

Note: the 'sink-reverts-to-`random`' AI is quite effective when ships are spaced out. However, it becomes weak when ships are clustered together, often missing shots obvious to human players

# Features
## Gameplay features
- single player vs AI gameplay
- two player 'hotseat' gameplay
- full shot logging and ship status listings
- visual shot effects
- leaderboard for highscore tracking

## Dev notes
The game engine is a custom-built Finite State Machine with automatic and user-triggered transitions. The complete FSM can be rendered in chart format by running `node write-chart.js` and opening `statemap.md` in a [mermaid](https://mermaidjs.github.io/)-compatible viewer. See below for a recent SVG version of the state map.

The game engine interfaces with a data store loosely based on Vue.js's [Vuex](https://github.com/vuejs/vuex) state management system.

The rendering engine is a separate module which makes heavy use of JQuery.

Please note: original Lighthous Labs eslint settings have been overridden to allow ECMA 2015. This will allow more advanced concepts such as 'const'/'let', 'class', etc to be used. This change was accepted by the instructor prior to beginning, to allow these advanced concepts to be learned.

Please also note: the original project requirements stated only HTML, CSS, Javascript, and JQuery were to be used. This requirement was stretched slightly to allow an Express+EJS server to handle saving user scores and rendering the leaderboard. Additionally, [require.js](https://github.com/requirejs/requirejs) was used to import modules in the client, rather than implementing a build-step.

![Game engine Finite State Machine](/docs/statemap.svg)

# Issues
- Name input should be handled on keypress-enter (eg. hide the box?)
- AI is weaker when ships are clustered together - could better integrate the hitStack[] array
- Once many shots have been made, AI slows down as it retries already-made shots more often. This end-game will likely be irrelevant once clustering is addressed

# Roadmap
- Implement a 'splitscreen' mode where two players don't need to swap seats between each turn
  - eg. Only display the 'obscured' opponent boards side-by-side for players to shoot at, not their own board revealing ship locations
  - Could implement a keyboard control to speed up (instead of swapping mouse between players)
- Implement 2P network play

# External Resources Used
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
- https://stackoverflow.com/questions/16512182/how-to-create-empty-2d-array-in-javascript
- https://css-tricks.com/snippets/css/complete-guide-grid/
- http://journal.stuffwithstuff.com/2014/07/15/a-turn-based-game-loop/
- https://stackoverflow.com/questions/3385936/jquery-follow-the-cursor-with-a-div
- https://css-tricks.com/almanac/properties/p/pointer-events/
- https://codepen.io/LukeAskew/pen/gabgom?editors=0100
- https://css-tricks.com/examples/WebKitScrollbars/
- [Background image source](http://www.kcra.com/article/grandmother-contracts-flesh-eating-bacteria-from-myrtle-beach-ocean-water-family-claims/10395694)