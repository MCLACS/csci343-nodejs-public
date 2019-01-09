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
    if (query['cmd'] != 'add')
      throw Error("Invalid command: " + query['cmd']);
    if (query['num'] == undefined || query['num'].length < 2)  
      throw Error("Expecting at least two numbers");
    
    console.log("Handling a request");
    console.log(query);
    var sum = 0;
    for (var i in query['num'])
    {
      sum = sum + parseInt(query['num'][i]);
    }
    
    var result = {'sum' : sum};
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