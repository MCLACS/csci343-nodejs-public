const express = require('express');
const app = express();

// install session module first using 'npm install express-session'
var session = require('express-session'); 
app.use(session({ secret: 'happy jungle', 
                  resave: false, 
                  saveUninitialized: 
                  false, 
                  cookie: { maxAge: 60000 }}))
                  
app.get('/introduce', introduce);
app.listen(process.env.PORT,  process.env.IP, startHandler())

function startHandler()
{
  console.log('Server listening on port ' + process.env.PORT)
}

function introduce(req, res)
{
  let result= {};
  try
  {
    // if the session is empty, set a default...
    if (req.session.name == undefined)
      req.session.name = 'nobody';
      
    // if a name is given, remeber it...
    if (req.query.name != undefined)  
      req.session.name = req.query.name;

    result = {'greeting' : `Hello ${req.session.name}`}; 
  }
  catch (e)
  {
    result = {'error' : e.message};
  }
  
  res.writeHead(200, {'Content-Type': 'application/json'});    
  res.write(JSON.stringify(result));
  res.end('');
}

