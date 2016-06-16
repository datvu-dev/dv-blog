// $(document).ready(function() {
  var http = require("http");
  var mysql = require("mysql");
  var net = require('net');



  // Console will print the message
  console.log('Server running at http://127.0.0.1:8082/');

  // $("#submit-btn").on('click', function() {
    // Create a connection to the database.
    var pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "",
      database: "dv_blog"
    });





    pool.getConnection(function(err, connection){
      if (err) {
        throw err;
      }
      connection.query('SELECT * FROM posts', function(err, rows) {
        if (err) {
          throw err;
        }

        http.createServer(function (request, response) {

           // Send the HTTP header
           // HTTP Status: 200 : OK
           // Content Type: text/plain
           response.writeHead(200, {'Content-Type': 'text/plain'});

           console.log('this is a test');
           response.end('finish');
           // Send the response body as "Hello World"

        }).listen(8082);
      });

      connection.release();
    });



    // con.connect(function(err) {
    //   if (err) {
    //     console.log('Error connecting to the database');
    //     return;
    //   }
    //
    //   console.log('Connection established');
    // });

    // console.log(con);


    // con.end(function(err) {

    // });
  // });

// });
