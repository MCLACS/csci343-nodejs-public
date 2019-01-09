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
    
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;   
    console.log(query);
    
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<ul>');
    for (var key in query)
    {
      res.write('<li>'+key+'->'+query[key]+'</li>')  
    }
    res.write('</ul>');

    res.end('');
}