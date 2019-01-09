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
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (query['cmd'] == 'add')
    {
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
    else
    {
      res.end('');
    }
}