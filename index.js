"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');

const PORT = process.env.PORT || 8081;
const SCORES_DATA = './scores.json';

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/scores', (req, res) => {
  if (fs.existsSync(SCORES_DATA)) {
    let scoresJson = JSON.parse(fs.readFileSync(SCORES_DATA, 'utf8'));
    res.json(scoresJson);
    return;
  }
  res.send('Error loading scores');
});

app.listen(PORT, () => {
  console.log('Battleship listening on port ' + PORT);
});