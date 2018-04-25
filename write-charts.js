const fs = require('fs');
const stripComments = require('./scripts/util/strip-json-comments');
const OUTPUT_FILE = './statemap.md';

const gameEngineCode = fs.readFileSync('./scripts/gameEngine.js').toString();
let gameStateCode = gameEngineCode
  // Find start of statemap obj
  .split('stateMap:')[1]
  // Find end of statemap obj
  .split(/,\s+\/\* State map end \*\//)[0]
  // Strip whitespace
  .replace(/\s/g, '')
  // Replace '' -> ""
  .replace(/'/g, `"`);

let statemap = JSON.parse(JSON.parse(JSON.stringify(stripComments(gameStateCode))));

let output = "# Battleship\n## State Transition Map\n```mermaid\ngraph TD;\n";

for (stateStart in statemap) {
  let transitions = statemap[stateStart];
  for (trans in transitions) {
    // Eg. startGame[startGame] -- next --> awaitingShot[awaitingShot]
    output += `${stateStart}[${stateStart}] -- ${trans} --> ${transitions[trans]}[${transitions[trans]}] ;\n`;
  }
}

output += "```";

fs.writeFileSync(OUTPUT_FILE, output);