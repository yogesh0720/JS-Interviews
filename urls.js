var https = require('https');
var URLs = [
	'https://jsonplaceholder.typicode.com/todos',
  'https://jsonplaceholder.typicode.com/posts/59'
]

function checkURLisActiveOrInactive(){
    var options = {
    hostname: 'jsonplaceholder.typicode.com',
    port: 443,
    path: '/',
    method: 'GET',
    rejectUnauthorized: true
    };


    var req = https.request(options, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    });
    req.end();

    req.on('error', function(e) {
    console.error(e);
    });
}

