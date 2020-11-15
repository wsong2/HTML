var express = require('express');
var app = express();
	
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.urlencoded({ extended: true }));
	
require('./routes/myroutes.js')(app);

const port = 3000;

var server = app.listen(port, function () {
   var host = server.address().address
   //var port = server.address().port
   console.log("App listening at http://%s:%s", host, port)
})