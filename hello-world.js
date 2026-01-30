var http = require("http");

http
  .createServer(function (req, res) {
    console.log(req.url);
    //if (req.url === "/favicon.ico") return res.end();
    console.log("Hello World log");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World response");
  })
  .listen(8989);
