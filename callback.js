var http = require("http");

var data = http.createServer(function (req, res) {
  res.writeHead(200);
  res.end("aaaa");
});

data.listen(8989);
