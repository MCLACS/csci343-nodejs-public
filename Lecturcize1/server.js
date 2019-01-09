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
    console.log("Handling a request")
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<p>Hello!!!</p>');
    res.end('<p>Have a nice day!!!</p>');
}