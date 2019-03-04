const express = require('express');

// added so we can serve index.html...
var http = require('http');
var fs = require('fs');

const app = express();

var session = require('express-session'); 
app.use(session({ secret: 'happy jungle', 
                  resave: false, 
                  saveUninitialized: false, 
                  cookie: { maxAge: 60000 }}));

app.get('/', serveIndex);                  
app.get('/game', game);
app.listen(process.env.PORT,  process.env.IP, startHandler())

function startHandler()
{
  console.log('Server listening on port ' + process.env.PORT)
}

function game(req, res)
{
  let result = {};
  try
  {
    // if we have not picked a secret number, restart the game...
    if (req.session.answer == undefined)
    {
      req.session.guesses = 0;
      req.session.answer = Math.floor(Math.random() * 100) + 1;
    }
      
    // if a guess was not made, restart the game...
    if (req.query.guess == undefined)
    {
      result = {'gameStatus' : 'Pick a number from 1 to 100.'}; 
      req.session.guesses = 0;
      req.session.answer = Math.floor(Math.random() * 100) + 1;
    }
    else
    {
      checkGuess(req.query.guess);
      
      // a guess was made, check to see if it is correct...
      if (req.query.guess == req.session.answer)
      {
        req.session.guesses = req.session.guesses + 1;
        result = {'gameStatus' : `Correct! It took you ${req.session.guesses} guesses. Play Again!`}; 
        req.session.answer = undefined;
      }
      // a guess was made, check to see if too high...
      else if (req.query.guess > req.session.answer)
      {
        req.session.guesses = req.session.guesses + 1;
        result = {'gameStatus' : 'To High. Guess Again!', 'guesses' : req.session.guesses}; 
      }
      // a guess was made, it must be too low...
      else
      {
        req.session.guesses = req.session.guesses + 1;
        result = {'gameStatus' : 'To Low. Guess Again!', 'guesses' : req.session.guesses}; 
      };
    }
  }
  catch (e)
  {
    result = {'error' : e.message};
  }
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(result));
  res.end('');
}

function checkGuess(g)
{
  if (g == undefined || g == '' || isNaN(g))
    throw Error("You must guess a number.");
}

// added so we can serve index.html...
function serveIndex(req, res)
{
  res.writeHead(200, {'Content-Type': 'text/html'});
  var index = fs.readFileSync('index.html');
  res.end(index);
}