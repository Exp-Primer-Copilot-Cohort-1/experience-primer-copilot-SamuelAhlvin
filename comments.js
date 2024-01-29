// Create a web server application
// Run: node comments.js
// Then, open: http://localhost:3000/
// See:  https://www.w3schools.com/nodejs/nodejs_http.asp

var http = require('http');
var url = require('url');
var fs = require('fs');
var formidable = require('formidable');

// Create a server object
http.createServer(function (req, res) {
  // Parse the request
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  if (filename == './') {
    filename = './comments.html';
  }

  // If the request is for a file, send the file
  if (filename != './comments.html') {
    fs.readFile(filename, function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      } 
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    });
  }

  // If the request is for the comments page, handle the request
  else {
    // If the request is a POST request, process the form
    if (req.method == 'POST') {
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields) {
        // Save the comment
        var comment = fields.comment;
        fs.appendFile('comments.txt', comment + '\n', function (err) {
          if (err) throw err;
          console.log('Saved!');
        });

        // Return a response
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<h1>Thank you for your comment.</h1>');
        return res.end();
      });
    }

    // If the request is a GET request, return the comments
    else {
      fs.readFile('comments.txt', function(err, data) {
        if (err) {
          res.writeHead(404, {'Content-Type': 'text/html'});
          return res.end("404 Not Found");
        } 
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<h1>Comments</h1>');
        res.write(data);
        return res.end();
      });
    }
  }
}).listen(3000); // The server object listens on port 3000