# Battleship
## State Transition Map
```mermaid
graph TD;
gameEntry[gameEntry] -- next --> awaitingShipPickup[awaitingShipPickup] ;
awaitingShipPickup[awaitingShipPickup] -- click --> checkIsOwnShip[checkIsOwnShip] ;
awaitingShipPickup[awaitingShipPickup] -- playerReadyButton --> setPlayerReady[setPlayerReady] ;
awaitingShipPickup[awaitingShipPickup] -- keySpacebar --> setPlayerReady[setPlayerReady] ;
checkIsOwnShip[checkIsOwnShip] -- yes --> shipPickedUp[shipPickedUp] ;
checkIsOwnShip[checkIsOwnShip] -- no --> awaitingShipPickup[awaitingShipPickup] ;
shipPickedUp[shipPickedUp] -- clickRight --> rotateShip[rotateShip] ;
shipPickedUp[shipPickedUp] -- click --> isValidPlacement[isValidPlacement] ;
rotateShip[rotateShip] -- next --> shipPickedUp[shipPickedUp] ;
isValidPlacement[isValidPlacement] -- yes --> placeShip[placeShip] ;
isValidPlacement[isValidPlacement] -- no --> shipPickedUp[shipPickedUp] ;
placeShip[placeShip] -- next --> awaitingShipPickup[awaitingShipPickup] ;
setPlayerReady[setPlayerReady] -- next --> checkBothPlayersReady[checkBothPlayersReady] ;
checkBothPlayersReady[checkBothPlayersReady] -- yes --> prepareGameStart[prepareGameStart] ;
checkBothPlayersReady[checkBothPlayersReady] -- no --> screeningSetupBoards[screeningSetupBoards] ;
prepareGameStart[prepareGameStart] -- playerAi --> startGameAi[startGameAi] ;
prepareGameStart[prepareGameStart] -- playerLocal --> randomizeStartPlayer[randomizeStartPlayer] ;
randomizeStartPlayer[randomizeStartPlayer] -- playerReadyButton --> startGame[startGame] ;
randomizeStartPlayer[randomizeStartPlayer] -- keySpacebar --> startGame[startGame] ;
startGame[startGame] -- next --> awaitingShot[awaitingShot] ;
screeningSetupBoards[screeningSetupBoards] -- playerReadyButton --> removeSetupBoardScreens[removeSetupBoardScreens] ;
screeningSetupBoards[screeningSetupBoards] -- keySpacebar --> removeSetupBoardScreens[removeSetupBoardScreens] ;
removeSetupBoardScreens[removeSetupBoardScreens] -- next --> awaitingShipPickup[awaitingShipPickup] ;
awaitingShot[awaitingShot] -- click --> checkShotResult[checkShotResult] ;
checkShotResult[checkShotResult] -- reset --> awaitingShot[awaitingShot] ;
checkShotResult[checkShotResult] -- miss --> endOfTurn[endOfTurn] ;
checkShotResult[checkShotResult] -- hit --> checkSunk[checkSunk] ;
checkSunk[checkSunk] -- victory --> gameOver[gameOver] ;
checkSunk[checkSunk] -- sunk --> endOfTurn[endOfTurn] ;
checkSunk[checkSunk] -- notSunk --> endOfTurn[endOfTurn] ;
endOfTurn[endOfTurn] -- playerAi --> awaitingAiShot[awaitingAiShot] ;
endOfTurn[endOfTurn] -- playerLocal --> awaitingPlayerDone[awaitingPlayerDone] ;
awaitingPlayerDone[awaitingPlayerDone] -- playerReadyButton --> screeningGameplayBoards[screeningGameplayBoards] ;
awaitingPlayerDone[awaitingPlayerDone] -- keySpacebar --> screeningGameplayBoards[screeningGameplayBoards] ;
screeningGameplayBoards[screeningGameplayBoards] -- playerReadyButton --> removeGameplayBoardScreens[removeGameplayBoardScreens] ;
screeningGameplayBoards[screeningGameplayBoards] -- keySpacebar --> removeGameplayBoardScreens[removeGameplayBoardScreens] ;
removeGameplayBoardScreens[removeGameplayBoardScreens] -- next --> awaitingShot[awaitingShot] ;
```