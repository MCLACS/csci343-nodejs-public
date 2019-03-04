var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);

function startHandler()
{
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
}

function requestHandler(req, res) 
{
  try
  {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (query['cmd'] == undefined)
      throw Error("A command must be specified");
      
    var result = {};
    if (query['cmd'] == 'calcRun')
    {
      result = calcRun(query);
    }
    else if (query['cmd'] == 'calcWalk')
    {
      result = calcWalk(query);
    }   
    else
    {
      throw Error("Invalid command: " + query['cmd']);
    }
 
    res.write(JSON.stringify(result));
    res.end('');
  }
  catch (e)
  {
    var error = {'error' : e.message};
    res.write(JSON.stringify(error));
    res.end('');
  }
}

function calcRun(query)
{
  if (query['miles'] == undefined)  
    throw Error("Please specify the miles you are going to run.");

  var dMiles = parseInt(query['miles']);
  var result = {'milesRun' : dMiles, 'minutes' : dMiles*10}; 
  return result;
}

function calcWalk(query)
{
  if (query['miles'] == undefined)  
    throw Error("Please specify the miles you are going to walk.");

  var dMiles = parseInt(query['miles']);
  var result = {'milesWalked' : dMiles, 'minutes' : dMiles*20}; 
  return result;
}