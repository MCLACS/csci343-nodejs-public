var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);


const quotes = 
{
  "quotes" :
  [
    {"quoteText" : "And nobody knows what a community college is."},
    {"quoteText" : "A boom that has never been seen before.  There is nothing like it."},
    {"quoteText" : "Covfefe"},
    {"quoteText" : "No Collusion"}
  ],
  "disclaimer" : "I do not agree with or endorse any of these quotes, nor do I intend to influence your political beliefs."
};




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
    if (query['cmd'] == 'getQuote')
    {
      result = getQuote(query);
    }
    else if (query['cmd'] == 'getD')
    {
      result = getD(query);
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

function getQuote(query)
{
  var n = Math.floor(Math.random() * 3); 
  var q = quotes["quotes"][n]["quoteText"];
  var result = { "quote" : q };
  return result;
}

function getD(query)
{
  var result = { "disclaimer" : quotes["disclaimer"] };
  return result;
}












