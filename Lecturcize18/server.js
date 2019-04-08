const express = require('express');
const app = express();

// install mysql module first using 'npm install mysql'
var mysql = require('mysql');

// added so we can serve index.html...
var http = require('http');
var fs = require('fs');

const conInfo = 
{
    host: process.env.IP,
    user: process.env.C9_USER,
    password: "",
    database: "SONGDB"
};

var session = require('express-session'); 
app.use(session({ secret: 'happy jungle', 
                  resave: false, 
                  saveUninitialized: false, 
                  cookie: { maxAge: 60000 }}))

app.get('/', serveIndex);                  
app.get('/list', list);                  
app.get('/add', add);
app.get('/remove', remove);
app.get('/clear', clear);

app.listen(process.env.PORT,  process.env.IP, startHandler())

function startHandler()
{
  console.log('Server listening on port ' + process.env.PORT)
}

function list(req, res)
{
  var con = mysql.createConnection(conInfo);
  con.connect(function(err) 
  {
    if (err) 
      writeResult(req, res, {'error' : err});
    else
    {
      con.query("SELECT * FROM SONG ORDER BY SONG_NAME", function (err, result, fields) 
      {
        if (err) 
          writeResult(req, res, {'error' : err});
        else
          writeResult(req, res, {'result' : result});
      });
    }
  });
}

function add(req, res)
{
  if (req.query.song == undefined)
    writeResult(req, res, {'error' : "add requires you to enter a song"});
  else
  {
    var con = mysql.createConnection(conInfo);
    con.connect(function(err) 
    {
      if (err) 
        writeResult(req, res, {'error' : err});
      else
      {
        con.query('INSERT INTO SONG (SONG_NAME) VALUES (?)', [req.query.song], function (err, result, fields) 
        {
          if (err) 
            writeResult(req, res, {'error' : err});
          else
          {
            con.query("SELECT * FROM SONG ORDER BY SONG_NAME", function (err, result, fields) 
            {
              if (err) 
                writeResult(req, res, {'error' : err});
              else
                writeResult(req, res, {'result' : result});
            });
          }
        });
      }
    });
  }
}

function remove(req, res)
{
  if (req.query.song == undefined)
    writeResult(req, res, {'error' : "add requires you to enter a song"});
  else
  {
    var con = mysql.createConnection(conInfo);
    con.connect(function(err) 
    {
      if (err) 
        writeResult(req, res, {'error' : err});
      else
      {
        con.query('DELETE FROM SONG WHERE SONG_NAME = ?', [req.query.song], function (err, result, fields) 
        {
          if (err) 
            writeResult(req, res, {'error' : err});
          else
          {
            con.query("SELECT * FROM SONG ORDER BY SONG_NAME", function (err, result, fields) 
            {
              if (err) 
                writeResult(req, res, {'error' : err});
              else
                writeResult(req, res, {'result' : result});
            });
          }
        });
      }
    });
  }
}

function clear(req, res)
{
  var con = mysql.createConnection(conInfo);
  con.connect(function(err) 
  {
    if (err) 
      writeResult(req, res, {'error' : err});
    else
    {
      con.query('DELETE FROM SONG', function (err, result, fields) 
      {
        if (err) 
          writeResult(req, res, {'error' : err});
        else
        {
          con.query("SELECT * FROM SONG ORDER BY SONG_NAME", function (err, result, fields) 
          {
            if (err) 
              writeResult(req, res, {'error' : err});
            else
              writeResult(req, res, {'result' : result});
          });
        }
      });
    }
  });
}

function writeResult(req, res, obj)
{
  if (req.session.commandCount == undefined)
    req.session.commandCount = 0;

  req.session.commandCount++;

  obj.commandCount = req.session.commandCount;
  
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(obj));
  res.end('');
}

// added so we can serve index.html...
function serveIndex(req, res)
{
  res.writeHead(200, {'Content-Type': 'text/html'});
  var index = fs.readFileSync('index.html');
  res.end(index);
}