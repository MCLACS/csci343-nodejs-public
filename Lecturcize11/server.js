const express = require('express');
const app = express();

// install mysql module first using 'npm install mysql'
var mysql = require('mysql');

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
  var con = mysql.createConnection({
    host: process.env.IP,
    user: process.env.C9_USER,
    password: "",
    database: "SONGDB"
  });

  con.connect(function(err) 
  {
    if (err) 
      throw err;
    con.query("SELECT * FROM SONG ORDER BY SONG_NAME", function (err, result, fields) 
    {
      if (err) 
        throw err;
      let obj = {'result' : result}; 

      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(obj));
      res.end('');
    });
  });
}

function add(req, res)
{
  if (req.query.song == undefined)
    throw Error("add requires you to enter a song");

  var con = mysql.createConnection({
      host: process.env.IP,
      user: process.env.C9_USER,
      password: "",
      database: "SONGDB"
  });

  con.connect(function(err) 
  {
    if (err) 
      throw err;
    con.query('INSERT INTO SONG (SONG_NAME) VALUES (?)', [req.query.song], function (err, result, fields) 
    {
      if (err) 
        throw err;
      con.query("SELECT * FROM SONG ORDER BY SONG_NAME", function (err, result, fields) 
      {
        if (err) 
          throw err;
        let obj = {'result' : result}; 
  
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(obj));
        res.end('');
      });
    });
  });
}

function remove(req, res)
{
  if (req.query.song == undefined)
    throw Error("remove requires you to enter a song");

  var con = mysql.createConnection({
      host: process.env.IP,
      user: process.env.C9_USER,
      password: "",
      database: "SONGDB"
  });

  con.connect(function(err) 
  {
    if (err) 
      throw err;
    con.query('DELETE FROM SONG WHERE SONG_NAME = ?', [req.query.song], function (err, result, fields) 
    {
      if (err) 
        throw err;
      con.query("SELECT * FROM SONG", function (err, result, fields) 
      {
        if (err) 
          throw err;
        let obj = {'result' : result}; 
  
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(obj));
        res.end('');
      });
    });
  });
}

function clear(req, res)
{
  var con = mysql.createConnection({
      host: process.env.IP,
      user: process.env.C9_USER,
      password: "",
      database: "SONGDB"
  });

  con.connect(function(err) 
  {
    if (err) 
      throw err;
    con.query('DELETE FROM SONG', function (err, result, fields) 
    {
      if (err) 
        throw err;
      con.query("SELECT * FROM SONG", function (err, result, fields) 
      {
        if (err) 
          throw err;
        let obj = {'result' : result}; 
  
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(obj));
        res.end('');
      });
    });
  });
}