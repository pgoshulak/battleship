const fs = require('fs');
const strip = require('./scripts/util/strip-json-comments');
const OUTPUT_FILE = './statemap.md';

const gameEngineCode = fs.readFileSync('./scripts/gameEngine.js').toString();
let gameStateCode = gameEngineCode
  .split('stateMap:')[1]
  .split(', /* State map end */')[0]
  .replace(/\s/g, '')
  .replace(/'/g, `"`);

let statemap = JSON.parse(JSON.parse(JSON.stringify(strip(gameStateCode))));

let output = "```mermaid\ngraph TD;\n";


for (stateStart in statemap) {
  let transitions = statemap[stateStart];
  for (trans in transitions) {
    output += `${stateStart}[${stateStart}] -- ${trans} --> ${transitions[trans]}[${transitions[trans]}] ;\n`;
  }
}

output += "```";

fs.writeFileSync(OUTPUT_FILE, output);