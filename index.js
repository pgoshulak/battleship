"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');

const PORT = process.env.PORT || 8081;
const SCORES_DATA = './scores.json';

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/scores/:user?', (req, res) => {
  if (fs.existsSync(SCORES_DATA)) {
    // Read scores from server JSON file
    let scoresJson = fs.readFileSync(SCORES_DATA, 'utf8');
    let userHighlight = '';
    if (req.params.user) {
      userHighlight = req.params.user;
    }
    res.render('scores', { scoresJson, userHighlight });
    return;
  }
  res.send('Error loading scores');
});

app.post('/scores', (req, res) => {
  let scoresJson = {};
  let userName = req.body.userName;
  // Read scores if they exist
  if (fs.existsSync(SCORES_DATA)) {
    scoresJson = JSON.parse(fs.readFileSync(SCORES_DATA, 'utf8'));
  }

  // Create an entry listing the difference in ships (+2)
  let score = {
    scoreDiff: req.body.scoreDiff,
    timestamp: new Date()
  };

  // Create the user if doesn't exist
  if (!scoresJson[userName]) {
    scoresJson[userName] = [score];
  } else {
    scoresJson[userName].push(score);
  }

  // Write updated scores to file
  fs.writeFile(SCORES_DATA, JSON.stringify(scoresJson));

  res.send();
});

app.listen(PORT, () => {
  console.log('Battleship listening on port ' + PORT);
});