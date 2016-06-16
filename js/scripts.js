var mysql = require("mysql");

// Create a connection to the database.
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root"
});

con.connect(function(err) {
  if (err) {
    console.log('Error connecting to the database');
    return;
  }

  console.log('Connection established');
})

con.end(function(err) {

});
