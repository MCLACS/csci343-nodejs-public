const express = require('express');
const app = express();

// install mysql module first using 'npm install mysql'
var mysql = require('mysql');

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

app.get('/', list);                  
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
      writeResult(res, {'error' : err});
    else
    {
      con.query("SELECT * FROM SONG ORDER BY SONG_NAME", function (err, result, fields) 
      {
        if (err) 
          writeResult(res, {'error' : err});
        else
          writeResult(res, {'result' : result});
      });
    }
  });
}

function add(req, res)
{
  if (req.query.song == undefined)
    writeResult(res, {'error' : "add requires you to enter a song"});
  else
  {
    var con = mysql.createConnection(conInfo);
    con.connect(function(err) 
    {
      if (err) 
        writeResult(res, {'error' : err});
      else
      {
        con.query('INSERT INTO SONG (SONG_NAME) VALUES (?)', [req.query.song], function (err, result, fields) 
        {
          if (err) 
            writeResult(res, {'error' : err});
          else
          {
            con.query("SELECT * FROM SONG ORDER BY SONG_NAME", function (err, result, fields) 
            {
              if (err) 
                writeResult(res, {'error' : err});
              else
                writeResult(res, {'result' : result});
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
    writeResult(res, {'error' : "add requires you to enter a song"});
  else
  {
    var con = mysql.createConnection(conInfo);
    con.connect(function(err) 
    {
      if (err) 
        writeResult(res, {'error' : err});
      else
      {
        con.query('DELETE FROM SONG WHERE SONG_NAME = ?', [req.query.song], function (err, result, fields) 
        {
          if (err) 
            writeResult(res, {'error' : err});
          else
          {
            con.query("SELECT * FROM SONG ORDER BY SONG_NAME", function (err, result, fields) 
            {
              if (err) 
                writeResult(res, {'error' : err});
              else
                writeResult(res, {'result' : result});
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
      writeResult(res, {'error' : err});
    else
    {
      con.query('DELETE FROM SONG', function (err, result, fields) 
      {
        if (err) 
          writeResult(res, {'error' : err});
        else
        {
          con.query("SELECT * FROM SONG ORDER BY SONG_NAME", function (err, result, fields) 
          {
            if (err) 
              writeResult(res, {'error' : err});
            else
              writeResult(res, {'result' : result});
          });
        }
      });
    }
  });
}

function writeResult(res, obj)
{
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(obj));
  res.end('');
}