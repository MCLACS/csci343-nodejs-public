const express = require('express');
const app = express();

app.get('/add', add);
app.get('/sub', subtract);
app.listen(process.env.PORT,  process.env.IP, startHandler())

function startHandler()
{
  console.log('Server listening on port ' + process.env.PORT)
}

function add(req, res)
{
  try
  {
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (req.query.num == undefined || req.query.num.length < 2)  
      throw Error("Expecting at least two numbers");
    
    let sum = 0;
    for (let i in req.query.num)
    {
      let num = req.query.num[i];
      if (isNaN(num))
        throw Error("Invalid number");
      sum = sum + parseInt(num);
    }
      
    let result = {'sum' : sum}; 
    res.write(JSON.stringify(result));
  }
  catch (e)
  {
    res.write(JSON.stringify({'error' : e.message}));
  }
  res.end('');
}

function subtract(req, res)
{
  try
  {
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (req.query.num == undefined || req.query.num.length < 2)  
      throw Error("Expecting at least two numbers");
      
    let sub = req.query.num[0];
    for (let i = 1; i < req.query.num.length; i++)
    {
      let num = req.query.num[i];
      if (isNaN(num))
        throw Error("Invalid number");
      sub = sub - parseInt(num);
    }
      
    let result = {'sub' : sub}; 
    res.write(JSON.stringify(result));
  }
  catch (e)
  {
    res.write(JSON.stringify({'error' : e.message}));
  }
  res.end('');
}